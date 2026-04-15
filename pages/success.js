import React from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Success() {
  const router = useRouter();
  const { pickup, dropoff, vehicle, price } = router.query;

  return (
    <Wrapper>
      <Content>
        <SuccessIcon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </SuccessIcon>

        <Title>Booking Confirmed!</Title>
        <Subtitle>Your airport transfer has been successfully booked.</Subtitle>

        <BookingCard>
          <BookingHeader>
            <BookingRef>Booking Reference</BookingRef>
            <RefNumber>CAB{Math.random().toString(36).substring(2, 8).toUpperCase()}</RefNumber>
          </BookingHeader>

          <BookingDetails>
            <DetailRow>
              <DetailLabel>Vehicle</DetailLabel>
              <DetailValue>{vehicle || "Premium Vehicle"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Pickup</DetailLabel>
              <DetailValue>{pickup || "Address"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Drop-off</DetailLabel>
              <DetailValue>{dropoff || "Airport"}</DetailValue>
            </DetailRow>
            <DetailRow className="border-t pt-3 mt-3">
              <DetailLabel className="font-bold">Total</DetailLabel>
              <DetailValue className="text-xl font-bold text-brand-black">£{price || "0.00"}</DetailValue>
            </DetailRow>
          </BookingDetails>
        </BookingCard>

        <InfoText>
          A confirmation email has been sent to your registered email address.
          Your driver will contact you 30 minutes before pickup.
        </InfoText>

        <ButtonGroup>
          <Link href="/" className="w-full">
            <PrimaryButton>Back to Home</PrimaryButton>
          </Link>
        </ButtonGroup>
      </Content>

      <Footer>
        <FooterText>Need help? Call us at 0800 123 4567</FooterText>
      </Footer>
    </Wrapper>
  );
}

const Wrapper = tw.div`
  min-h-screen bg-gray-100 flex flex-col
`;

const Content = tw.div`
  flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto
`;

const SuccessIcon = tw.div`
  w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6
`;

const Title = tw.h1`
  text-2xl font-bold text-brand-black text-center
`;

const Subtitle = tw.p`
  text-gray-600 text-center mt-2 mb-6
`;

const BookingCard = tw.div`
  w-full bg-white rounded-xl shadow-lg overflow-hidden mb-6
`;

const BookingHeader = tw.div`
  bg-brand-black text-white p-4 text-center
`;

const BookingRef = tw.p`
  text-sm text-gray-300
`;

const RefNumber = tw.p`
  text-xl font-bold tracking-wider mt-1
`;

const BookingDetails = tw.div`
  p-4 space-y-3
`;

const DetailRow = tw.div`
  flex justify-between items-start
`;

const DetailLabel = tw.span`
  text-sm text-gray-500
`;

const DetailValue = tw.span`
  text-sm font-medium text-gray-800 text-right max-w-[60%]
`;

const InfoText = tw.p`
  text-sm text-gray-500 text-center mb-6
`;

const ButtonGroup = tw.div`
  w-full space-y-3
`;

const PrimaryButton = tw.button`
  w-full bg-brand-black text-white py-4 rounded-xl font-bold hover:bg-brand-black/90 transition
`;

const Footer = tw.div`
  p-4 text-center bg-white border-t
`;

const FooterText = tw.p`
  text-sm text-gray-600
`;
