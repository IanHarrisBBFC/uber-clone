import { useState } from 'react';
import { calculatePickupTime, formatTimeForInput, formatDateForInput, formatFlightDateTime } from '../lib/flightUtils';

export default function FlightIntelligence({ onFlightData, collectionDate, collectionTime, onDateTimeChange }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [flightData, setFlightData] = useState(null);
  const [error, setError] = useState('');
  const [showReturnFlight, setShowReturnFlight] = useState(false);
  const [returnFlightNumber, setReturnFlightNumber] = useState('');
  const [returnFlightData, setReturnFlightData] = useState(null);

  const searchFlight = async () => {
    if (!flightNumber.trim()) {
      setError('Please enter a flight number');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch('/api/search-flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightNumber: flightNumber.trim(),
          date: collectionDate || new Date().toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to find flight');
      }

      setFlightData(data);
      
      // Calculate pickup time based on flight arrival
      const pickupTime = calculatePickupTime(data.arrival.time, data.isInternational);
      
      if (pickupTime) {
        const date = formatDateForInput(pickupTime);
        const time = formatTimeForInput(pickupTime);
        onDateTimeChange(date, time);
      }

      onFlightData({
        outbound: data,
        return: returnFlightData,
      });
    } catch (err) {
      setError(err.message);
      setFlightData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const searchReturnFlight = async () => {
    if (!returnFlightNumber.trim()) {
      setError('Please enter a return flight number');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      // Use return date (typically next day or later)
      const returnDate = new Date(collectionDate);
      returnDate.setDate(returnDate.getDate() + 1);

      const response = await fetch('/api/search-flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightNumber: returnFlightNumber.trim(),
          date: returnDate.toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to find return flight');
      }

      setReturnFlightData(data);
      onFlightData({
        outbound: flightData,
        return: data,
      });
    } catch (err) {
      setError(err.message);
      setReturnFlightData(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="use-flight"
          checked={!!flightData}
          onChange={(e) => {
            if (!e.target.checked) {
              setFlightData(null);
              setFlightNumber('');
              setError('');
            }
          }}
          className="rounded"
        />
        <label htmlFor="use-flight" className="text-sm font-medium text-gray-700">
          I have a flight number (Auto-calculate pickup time)
        </label>
      </div>

      {flightData ? (
        <div className="bg-blue-50 p-4 rounded-lg mb-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-700">{flightData.airline}</p>
              <p className="text-lg font-bold text-blue-600">{flightData.flightNumber}</p>
              <p className="text-xs text-gray-600">
                {formatFlightDateTime(flightData.arrival.time)}
              </p>
              <p className="text-xs text-gray-600">
                Arriving: {flightData.arrival.airport} (Terminal {flightData.arrival.terminal})
              </p>
              <p className="text-xs text-green-600 font-semibold mt-1">
                {flightData.isInternational ? '✓ International' : '✓ Domestic'}
                {' '} - {flightData.isInternational ? '60' : '45'} min buffer
              </p>
            </div>
            <button
              onClick={() => setFlightData(null)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Change
            </button>
          </div>

          <div className="border-t pt-3 mt-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showReturnFlight}
                onChange={(e) => setShowReturnFlight(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Add return flight</span>
            </label>

            {showReturnFlight && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Return flight number (e.g., BA210)"
                  value={returnFlightNumber}
                  onChange={(e) => setReturnFlightNumber(e.target.value.toUpperCase())}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={searchReturnFlight}
                  disabled={isSearching}
                  className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSearching ? 'Searching...' : 'Add Return Flight'}
                </button>
              </div>
            )}

            {returnFlightData && (
              <div className="mt-3 bg-white p-3 rounded border border-blue-200">
                <p className="text-sm font-semibold text-gray-700">{returnFlightData.airline}</p>
                <p className="text-sm font-bold text-blue-600">{returnFlightData.flightNumber}</p>
                <p className="text-xs text-gray-600">
                  {formatFlightDateTime(returnFlightData.departure.time)}
                </p>
                <button
                  onClick={() => setReturnFlightData(null)}
                  className="text-xs text-red-600 hover:text-red-800 mt-2"
                >
                  Remove return flight
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Flight number (e.g., BA274)"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#111111] focus:border-transparent"
          />
          <button
            onClick={searchFlight}
            disabled={isSearching}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isSearching ? 'Searching Flight...' : 'Search Flight'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
