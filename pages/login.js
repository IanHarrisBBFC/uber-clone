import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error.code, error.message);
      alert(`Sign-in error: ${error.code}\n\n${error.message}`);
    }
  };

  return (
    <Wrapper>
      <HeroSection>
        <HeroImage
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MfPAOfarF9VV-qj6ZgFxyU4GliYT8463V1uKPJ5bEL3.jpg"
          alt="Heathrow International Airport"
        />
        <HeroOverlay />
        <HeroContent>
          <LogoContainer>
            <TaxiIcon
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/P9Su0EpSKC5T-ppi2ulQXwOYJWoe3KQ17gmGKNpGS25.png"
              alt="CabnFly Logo"
            />
          </LogoContainer>
          <HeroTitle>Premium Airport Transfers</HeroTitle>
          <HeroSubtitle>Your journey begins with comfort and reliability</HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <LoginSection>
        <LoginCard>
          <WelcomeText>Welcome to CabnFly</WelcomeText>
          <Description>
            Book premium airport transfers to and from all major UK airports including Heathrow, Manchester, Birmingham, and Gatwick.
          </Description>
          
          <FeaturesGrid>
            <Feature>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </FeatureIcon>
              <FeatureText>Licensed Drivers</FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </FeatureIcon>
              <FeatureText>24/7 Service</FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-3.375c0-.621-.504-1.125-1.125-1.125h-3.75a1.125 1.125 0 00-1.125 1.125v.375" />
                </svg>
              </FeatureIcon>
              <FeatureText>Luxury Fleet</FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </FeatureIcon>
              <FeatureText>Fixed Prices</FeatureText>
            </Feature>
          </FeaturesGrid>

          <SignInButton onClick={handleSignIn}>
            <GoogleIcon>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </GoogleIcon>
            Continue with Google
          </SignInButton>

          <AirportLogos>
            <AirportBadge>Heathrow</AirportBadge>
            <AirportBadge>Manchester</AirportBadge>
            <AirportBadge>Birmingham</AirportBadge>
            <AirportBadge>Gatwick</AirportBadge>
          </AirportLogos>
        </LoginCard>
      </LoginSection>
    </Wrapper>
  );
}

// Styled components
const Wrapper = tw.div`
  flex flex-col lg:flex-row min-h-screen bg-gray-100
`;

const HeroSection = tw.div`
  relative lg:w-1/2 h-64 lg:h-screen overflow-hidden
`;

const HeroImage = tw.img`
  absolute inset-0 w-full h-full object-cover
`;

const HeroOverlay = tw.div`
  absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-brand-blue/80 to-brand-blue/40
`;

const HeroContent = tw.div`
  relative z-10 flex flex-col items-center justify-center h-full p-8 text-white text-center
`;

const LogoContainer = tw.div`
  mb-4
`;

const TaxiIcon = tw.img`
  h-20 lg:h-28 object-contain
`;

const HeroTitle = tw.h1`
  text-3xl lg:text-5xl font-bold mb-2 text-white drop-shadow-lg
`;

const HeroSubtitle = tw.p`
  text-lg lg:text-xl text-gray-100 drop-shadow
`;

const LoginSection = tw.div`
  flex-1 flex items-center justify-center p-6 lg:p-12
`;

const LoginCard = tw.div`
  bg-white rounded-2xl shadow-xl p-8 w-full max-w-md
`;

const WelcomeText = tw.h2`
  text-2xl font-bold text-brand-blue mb-2 text-center
`;

const Description = tw.p`
  text-gray-600 text-center mb-6 text-sm leading-relaxed
`;

const FeaturesGrid = tw.div`
  grid grid-cols-2 gap-3 mb-6
`;

const Feature = tw.div`
  flex items-center gap-2 p-3 bg-gray-50 rounded-lg
`;

const FeatureIcon = tw.div`
  text-brand-blue w-5 h-5 flex-shrink-0
`;

const FeatureText = tw.span`
  text-xs font-medium text-gray-700
`;

const SignInButton = tw.button`
  w-full flex items-center justify-center gap-3 bg-brand-blue text-white py-4 px-6 rounded-xl
  font-semibold text-lg hover:bg-brand-blue-light transition duration-300 shadow-lg hover:shadow-xl
`;

const GoogleIcon = tw.div`
  flex items-center justify-center
`;

const AirportLogos = tw.div`
  flex flex-wrap justify-center gap-2 mt-6 pt-6 border-t border-gray-100
`;

const AirportBadge = tw.span`
  text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium
`;
