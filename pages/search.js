import React, { useState, useEffect, useCallback } from "react";
import tw from "tailwind-styled-components";
import Link from "next/link";

export default function Search() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const popularAirports = [
    "London Heathrow Airport, UK",
    "Manchester Airport, UK",
    "Birmingham Airport, UK",
    "London Gatwick Airport, UK",
    "London Stansted Airport, UK",
    "Edinburgh Airport, UK",
  ];

  const searchPlaces = useCallback(async (query, setSuggestions) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            limit: 5,
            types: "place,address,poi",
            country: "GB",
          })
      );
      const data = await response.json();
      if (data.features) {
        setSuggestions(data.features.map((f) => f.place_name));
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (activeField === "pickup") {
        searchPlaces(pickup, setPickupSuggestions);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [pickup, activeField, searchPlaces]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (activeField === "dropoff") {
        searchPlaces(dropoff, setDropoffSuggestions);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [dropoff, activeField, searchPlaces]);

  const handleConfirm = (e) => {
    if (!pickup.trim() || !dropoff.trim()) {
      e.preventDefault();
      alert("Please enter both pickup and dropoff locations.");
    }
  };

  const selectSuggestion = (value, field) => {
    if (field === "pickup") {
      setPickup(value);
      setPickupSuggestions([]);
    } else {
      setDropoff(value);
      setDropoffSuggestions([]);
    }
    setActiveField(null);
  };

  const selectAirport = (airport) => {
    if (!pickup) {
      setPickup(airport);
    } else if (!dropoff) {
      setDropoff(airport);
    }
  };

  return (
    <Wrapper>
      {/* Header */}
      <HeaderSection>
        <Link href="/">
          <BackButton>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </BackButton>
        </Link>
        <HeaderTitle>Book Your Transfer</HeaderTitle>
        <HeaderSpacer />
      </HeaderSection>

      {/* Main Content */}
      <ContentSection>
        {/* Location Inputs */}
        <InputCard>
          <InputRow>
            <IconColumn>
              <PickupDot />
              <ConnectorLine />
              <DropoffSquare />
            </IconColumn>

            <InputColumn>
              <InputWrapper>
                <InputLabel>Pickup Location</InputLabel>
                <Input
                  placeholder="Enter pickup address or airport"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onFocus={() => setActiveField("pickup")}
                />
                {pickupSuggestions.length > 0 && (
                  <SuggestionsList>
                    {pickupSuggestions.map((suggestion, index) => (
                      <SuggestionItem
                        key={index}
                        onClick={() => selectSuggestion(suggestion, "pickup")}
                      >
                        <SuggestionIcon>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </SuggestionIcon>
                        {suggestion}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </InputWrapper>

              <Divider />

              <InputWrapper>
                <InputLabel>Drop-off Location</InputLabel>
                <Input
                  placeholder="Enter destination address or airport"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  onFocus={() => setActiveField("dropoff")}
                />
                {dropoffSuggestions.length > 0 && (
                  <SuggestionsList>
                    {dropoffSuggestions.map((suggestion, index) => (
                      <SuggestionItem
                        key={index}
                        onClick={() => selectSuggestion(suggestion, "dropoff")}
                      >
                        <SuggestionIcon>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </SuggestionIcon>
                        {suggestion}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </InputWrapper>
            </InputColumn>

            <SwapButton onClick={() => {
              const temp = pickup;
              setPickup(dropoff);
              setDropoff(temp);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
            </SwapButton>
          </InputRow>
        </InputCard>

        {/* Popular Airports */}
        <SectionTitle>Popular UK Airports</SectionTitle>
        <AirportChips>
          {popularAirports.map((airport, index) => (
            <AirportChip key={index} onClick={() => selectAirport(airport)}>
              <ChipIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </ChipIcon>
              {airport.split(",")[0]}
            </AirportChip>
          ))}
        </AirportChips>

        {/* Confirm Button */}
        <Link
          href={{
            pathname: "/confirm",
            query: {
              pickup: pickup.trim(),
              dropoff: dropoff.trim(),
            },
          }}
        >
          <ConfirmButton onClick={handleConfirm}>
            Get Quote
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </ConfirmButton>
        </Link>

        {/* Info Cards */}
        <InfoGrid>
          <InfoCard>
            <InfoIcon className="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </InfoIcon>
            <InfoText>Fixed Prices</InfoText>
          </InfoCard>
          <InfoCard>
            <InfoIcon className="text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </InfoIcon>
            <InfoText>Flight Tracking</InfoText>
          </InfoCard>
          <InfoCard>
            <InfoIcon className="text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </InfoIcon>
            <InfoText>5-Star Service</InfoText>
          </InfoCard>
        </InfoGrid>
      </ContentSection>
    </Wrapper>
  );
}

// Styled Components
const Wrapper = tw.div`
  min-h-screen bg-gray-100
`;

const HeaderSection = tw.header`
  bg-brand-blue text-white p-4 flex items-center justify-between
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

const ContentSection = tw.main`
  p-4 max-w-lg mx-auto
`;

const InputCard = tw.div`
  bg-white rounded-2xl shadow-lg p-4 mb-6
`;

const InputRow = tw.div`
  flex items-stretch gap-3
`;

const IconColumn = tw.div`
  flex flex-col items-center py-4
`;

const PickupDot = tw.div`
  w-3 h-3 rounded-full bg-brand-blue
`;

const ConnectorLine = tw.div`
  flex-1 w-0.5 bg-gray-300 my-1
`;

const DropoffSquare = tw.div`
  w-3 h-3 bg-brand-yellow
`;

const InputColumn = tw.div`
  flex-1
`;

const InputWrapper = tw.div`
  relative py-2
`;

const InputLabel = tw.label`
  text-xs font-semibold text-gray-500 uppercase tracking-wide
`;

const Input = tw.input`
  w-full py-2 text-lg outline-none border-none bg-transparent
  placeholder:text-gray-400 focus:placeholder:text-gray-300
`;

const Divider = tw.div`
  h-px bg-gray-200
`;

const SuggestionsList = tw.div`
  absolute top-full left-0 right-0 bg-white shadow-xl rounded-xl z-30 max-h-48 overflow-y-auto border
`;

const SuggestionItem = tw.div`
  flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-50 text-sm
  border-b border-gray-50 last:border-b-0
`;

const SuggestionIcon = tw.span`
  text-gray-400
`;

const SwapButton = tw.button`
  p-2 text-brand-blue hover:bg-brand-blue/10 rounded-full transition self-center
`;

const SectionTitle = tw.h2`
  font-bold text-gray-700 mb-3
`;

const AirportChips = tw.div`
  flex flex-wrap gap-2 mb-6
`;

const AirportChip = tw.button`
  flex items-center gap-1 px-3 py-2 bg-white rounded-full text-sm font-medium
  text-gray-700 shadow-sm hover:shadow-md hover:bg-brand-blue hover:text-white transition
`;

const ChipIcon = tw.span`
  text-brand-blue group-hover:text-white
`;

const ConfirmButton = tw.button`
  w-full flex items-center justify-center gap-2 bg-brand-blue text-white py-4 rounded-xl
  font-bold text-lg hover:bg-brand-blue-light transition shadow-lg hover:shadow-xl
`;

const InfoGrid = tw.div`
  grid grid-cols-3 gap-3 mt-6
`;

const InfoCard = tw.div`
  bg-white rounded-xl p-3 text-center shadow-sm
`;

const InfoIcon = tw.div`
  flex justify-center mb-1
`;

const InfoText = tw.p`
  text-xs font-medium text-gray-600
`;
