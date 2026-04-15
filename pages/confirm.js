import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import Map from "../components/Map";
import { useRouter } from "next/router";
import Link from "next/link";
import RideSelector from "../components/RideSelector";

export default function Confirm() {
  const router = useRouter();
  const { pickup, dropoff } = router.query;

  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleConfirmBooking = async () => {
    if (!selectedRide) {
      alert("Please select a vehicle first");
      return;
    }
    
    setIsBooking(true);
    
    try {
      // Navigate to success page with booking details
      // In production, this would process Stripe payment first
      router.push({
        pathname: '/success',
        query: {
          pickup,
          dropoff,
          vehicle: selectedRide.vehicle.service,
          price: selectedRide.price
        }
      });
    } catch (error) {
      console.error('[v0] Booking error:', error);
      alert('Error processing booking: ' + error.message);
      setIsBooking(false);
    }
  };

  const getCoordinates = async (location, setCoordinates) => {
    if (!location) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?` +
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            limit: 1,
            country: "GB",
          })
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setCoordinates(data.features[0].center);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    if (pickup) getCoordinates(pickup, setPickupCoordinates);
    if (dropoff) getCoordinates(dropoff, setDropoffCoordinates);
  }, [pickup, dropoff]);

  return (
    <Wrapper>
      {/* Header */}
      <HeaderBar>
        <Link href="/search">
          <BackButton>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </BackButton>
        </Link>
        <HeaderTitle>Choose Your Ride</HeaderTitle>
        <HeaderSpacer />
      </HeaderBar>

      {/* Route Summary */}
      <RouteSummary>
        <RoutePoint>
          <RouteDot className="bg-brand-black" />
          <RouteText>
            <RouteLabel>Pickup</RouteLabel>
            <RouteAddress>{pickup || "Not selected"}</RouteAddress>
          </RouteText>
        </RoutePoint>
        <RouteConnector />
        <RoutePoint>
          <RouteDot className="bg-brand-yellow" />
          <RouteText>
            <RouteLabel>Drop-off</RouteLabel>
            <RouteAddress>{dropoff || "Not selected"}</RouteAddress>
          </RouteText>
        </RoutePoint>
      </RouteSummary>

      {/* Main content: map left, vehicles right */}
      <MainContent>
        {/* Left: Map */}
        <MapContainer>
          <Map pickup={pickupCoordinates} dropoff={dropoffCoordinates} />
        </MapContainer>

        {/* Right: Ride Selector + Confirm */}
        <RideContainer>
          <RideSelector pickup={pickupCoordinates} dropoff={dropoffCoordinates} onSelect={setSelectedRide} />
          <ConfirmButtonContainer>
            <ConfirmButton onClick={handleConfirmBooking} disabled={isBooking || !selectedRide}>
              <ButtonContent>
                {isBooking ? (
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {isBooking ? "Processing..." : selectedRide ? `Confirm £${selectedRide.price}` : "Select a Vehicle"}
              </ButtonContent>
            </ConfirmButton>
            <SecureText>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Secure payment with Stripe
            </SecureText>
          </ConfirmButtonContainer>
        </RideContainer>
      </MainContent>
    </Wrapper>
  );
}

// Styled components
const Wrapper = tw.div`
  flex h-screen flex-col bg-gray-100 overflow-hidden
`;

const HeaderBar = tw.header`
  bg-brand-black text-white p-4 flex items-center justify-between z-20
`;

const BackButton = tw.button`
  p-2 hover:bg-white/10 rounded-full transition
`;

const HeaderTitle = tw.h1`
  font-bold text-lg
`;

const HeaderSpacer = tw.div`
  w-10
`;

const RouteSummary = tw.div`
  bg-white p-4 shadow-sm z-10
`;

const RoutePoint = tw.div`
  flex items-center gap-3
`;

const RouteDot = tw.div`
  w-3 h-3 rounded-full flex-shrink-0
`;

const RouteConnector = tw.div`
  w-0.5 h-4 bg-gray-300 ml-1.5 my-1
`;

const RouteText = tw.div`
  flex-1 min-w-0
`;

const RouteLabel = tw.span`
  text-xs text-gray-500 font-medium
`;

const RouteAddress = tw.p`
  text-sm font-medium text-gray-800 truncate
`;

const MainContent = tw.div`
  flex flex-1 overflow-hidden
`;

const MapContainer = tw.div`
  flex-1 relative
`;

const RideContainer = tw.div`
  w-full md:w-96 lg:w-[420px] flex flex-col flex-1 overflow-hidden bg-gray-50 border-l border-gray-200
`;

const ConfirmButtonContainer = tw.div`
  p-4 bg-white border-t shadow-lg
`;

const ConfirmButton = tw.button`
  w-full bg-brand-black text-white py-4 rounded-xl font-bold text-lg
  hover:bg-brand-black-light transition shadow-lg
`;

const ButtonContent = tw.span`
  flex items-center justify-center gap-2
`;


const SecureText = tw.p`
  flex items-center justify-center gap-1 text-xs text-gray-500 mt-2
`;
