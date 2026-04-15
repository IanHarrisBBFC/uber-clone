import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { carList } from "./data/data";

export default function RideSelector({ pickup, dropoff }) {
  const [rideDuration, setRideDuration] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const hasValidPickup = pickup && pickup.length === 2 && pickup[0] !== 0 && pickup[1] !== 0;
    const hasValidDropoff = dropoff && dropoff.length === 2 && dropoff[0] !== 0 && dropoff[1] !== 0;

    if (!hasValidPickup || !hasValidDropoff) return;

    const fetchDirections = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRideDuration(data.routes[0].duration / 60);
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    fetchDirections();
  }, [pickup, dropoff]);

  const formatPrice = (duration, multiplier) => {
    const basePrice = 25;
    const perMinuteRate = 0.5;
    const price = basePrice + (duration * perMinuteRate * multiplier);
    return price.toFixed(2);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <Wrapper>
      <Header>
        <Title>Select Your Vehicle</Title>
        {rideDuration > 0 && (
          <Duration>
            <DurationIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </DurationIcon>
            {formatDuration(rideDuration)} journey
          </Duration>
        )}
      </Header>

      <CarList>
        {carList.map((car, index) => (
          <CarCard
            key={index}
            $selected={selectedCar === index}
            onClick={() => setSelectedCar(index)}
          >
            <CarImageContainer>
              <CarImage src={car.imgUrl} alt={car.service} />
            </CarImageContainer>

            <CarInfo>
              <CarService>{car.service}</CarService>
              <CarDescription>{car.description}</CarDescription>
              <CarFeatures>
                <Feature>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {car.passengers}
                </Feature>
                <Feature>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  {car.luggage}
                </Feature>
              </CarFeatures>
            </CarInfo>

            <PriceContainer>
              <Price>£{formatPrice(rideDuration, car.multiplier)}</Price>
              {selectedCar === index && <SelectedBadge>Selected</SelectedBadge>}
            </PriceContainer>
          </CarCard>
        ))}
      </CarList>
    </Wrapper>
  );
}

const Wrapper = tw.div`
  flex-1 flex flex-col bg-white
`;

const Header = tw.div`
  p-4 border-b flex items-center justify-between
`;

const Title = tw.h2`
  font-bold text-brand-black
`;

const Duration = tw.div`
  flex items-center gap-1 text-sm text-gray-600
`;

const DurationIcon = tw.span`
  text-brand-black
`;

const CarList = tw.div`
  flex-1 overflow-y-auto
`;

const CarCard = tw.div`
  flex items-center p-4 border-b cursor-pointer transition
  ${(props) => props.$selected ? 'bg-brand-black/5 border-l-4 border-l-brand-black' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}
`;

const CarImageContainer = tw.div`
  w-24 h-16 flex items-center justify-center flex-shrink-0
`;

const CarImage = tw.img`
  max-w-full max-h-full object-contain
`;

const CarInfo = tw.div`
  flex-1 ml-3
`;

const CarService = tw.h3`
  font-bold text-brand-dark
`;

const CarDescription = tw.p`
  text-xs text-gray-500
`;

const CarFeatures = tw.div`
  flex gap-3 mt-1
`;

const Feature = tw.span`
  flex items-center gap-1 text-xs text-gray-500
`;

const PriceContainer = tw.div`
  text-right
`;

const Price = tw.div`
  font-bold text-lg text-brand-black
`;

const SelectedBadge = tw.span`
  text-xs text-brand-yellow bg-brand-black px-2 py-0.5 rounded-full
`;
