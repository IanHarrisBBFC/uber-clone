// Flight search API using AviationStack
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { flightNumber, date } = req.body;

    if (!flightNumber) {
      return res.status(400).json({ error: 'Flight number required' });
    }

    // Search flight using AviationStack API
    const response = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}&flight_iata=${flightNumber.toUpperCase()}&date=${date}`
    );

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const flight = data.data[0];
    
    // Extract flight details
    const flightInfo = {
      flightNumber: flight.flight.iata,
      airline: flight.airline.name,
      departure: {
        airport: flight.departure.airport,
        iata: flight.departure.iata,
        time: flight.departure.scheduled,
      },
      arrival: {
        airport: flight.arrival.airport,
        iata: flight.arrival.iata,
        time: flight.arrival.scheduled,
        terminal: flight.arrival.terminal || 'Not specified',
      },
      status: flight.flight_status,
      isInternational: flight.departure.iata !== flight.arrival.iata && 
                      !isUKAirport(flight.arrival.iata),
    };

    return res.status(200).json(flightInfo);
  } catch (error) {
    console.error('Flight search error:', error);
    return res.status(500).json({ error: 'Failed to search flight' });
  }
}

function isUKAirport(iata) {
  const ukAirports = ['LHR', 'LGW', 'MAN', 'BHX', 'EDI', 'GLA', 'BRS', 'NCL', 'LPL', 'STN', 'LTN', 'LCY', 'EMA', 'LBA'];
  return ukAirports.includes(iata);
}
