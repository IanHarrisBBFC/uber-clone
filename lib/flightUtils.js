// Flight Intelligence utilities for calculating pickup times

export function calculatePickupTime(arrivalTime, isInternational) {
  if (!arrivalTime) return null;
  
  const arrival = new Date(arrivalTime);
  // Add buffer: 60 minutes for international, 45 minutes for domestic
  const bufferMinutes = isInternational ? 60 : 45;
  const pickupTime = new Date(arrival.getTime() + bufferMinutes * 60000);
  
  return pickupTime;
}

export function formatTimeForInput(date) {
  if (!date) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDateForInput(date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getReturnPickupTime(returnFlightDeparture, isInternational) {
  if (!returnFlightDeparture) return null;
  
  const departure = new Date(returnFlightDeparture);
  // Subtract buffer: 120 minutes for international, 90 minutes for domestic
  const bufferMinutes = isInternational ? 120 : 90;
  const pickupTime = new Date(departure.getTime() - bufferMinutes * 60000);
  
  return pickupTime;
}

export function formatFlightDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
