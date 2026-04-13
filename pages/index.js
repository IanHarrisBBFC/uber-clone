import { useEffect, useState } from "react";
import Link from "next/link";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName || "Guest",
          photoUrl: user.photoURL || "/default-profile.png",
        });
      } else {
        setUser(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const airports = [
    { name: "Heathrow", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Q96qtXU1n4cT-ENL1LcTHyKC5GlCpBg6zwJAqPk7IL8.jpg" },
    { name: "Manchester", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NKYFoNLN3fLl-PmEk8YESq8DqB2Nz8hp3aNbW5Ky0a4.jpg" },
    { name: "Birmingham", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SJmc8syhToSd-40AgOmgAYXd0fHIhQH34eARJXnAW0p.jpg" },
    { name: "Gatwick", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rpBfpoRLxwlS-WUIYEd1fZT4f2VbAstXzdCEWmxCHcp.jpg" },
  ];

  return (
    <Wrapper>
      {/* Hero Section */}
      <HeroSection>
        <HeroImage
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wI0S8reqFCXK-wajzrlFgNLv9tca6oKyJaHqBo1etuj.png"
          alt="Premium Airport Transfers"
        />
        <HeroOverlay />
        
        {/* Header */}
        <Header>
          <LogoContainer>
            <Logo
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/P9Su0EpSKC5T-ppi2ulQXwOYJWoe3KQ17gmGKNpGS25.png"
              alt="CabnFly"
            />
            <BrandName>CabnFly</BrandName>
          </LogoContainer>
          <Profile>
            <UserName>{user?.name}</UserName>
            <UserImage
              src={user?.photoUrl}
              alt="Profile"
              onClick={() => signOut(auth)}
            />
          </Profile>
        </Header>

        {/* Hero Content */}
        <HeroContent>
          <HeroTitle>Premium Airport Transfers</HeroTitle>
          <HeroSubtitle>Luxury vehicles, professional drivers, fixed prices</HeroSubtitle>
          
          <Link href="/search">
            <BookButton>
              <BookButtonIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </BookButtonIcon>
              Book Your Transfer
            </BookButton>
          </Link>
        </HeroContent>
      </HeroSection>

      {/* Main Content */}
      <ContentSection>
        {/* Service Cards */}
        <SectionTitle>Our Services</SectionTitle>
        <ServiceGrid>
          <Link href="/search">
            <ServiceCard>
              <ServiceImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ZWNZSeEbdwEw-Vg0B8ck54tLZKPggDr2FpNFdJnLCD2.png"
                alt="Airport Transfer"
              />
              <ServiceContent>
                <ServiceTitle>Airport Transfer</ServiceTitle>
                <ServiceDescription>To and from all UK airports</ServiceDescription>
              </ServiceContent>
            </ServiceCard>
          </Link>

          <ServiceCard onClick={() => alert("Coming soon!")}>
            <ServiceIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </ServiceIcon>
            <ServiceContent>
              <ServiceTitle>Pre-Book</ServiceTitle>
              <ServiceDescription>Schedule in advance</ServiceDescription>
            </ServiceContent>
          </ServiceCard>

          <ServiceCard onClick={() => alert("Coming soon!")}>
            <ServiceIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </ServiceIcon>
            <ServiceContent>
              <ServiceTitle>Corporate</ServiceTitle>
              <ServiceDescription>Business accounts</ServiceDescription>
            </ServiceContent>
          </ServiceCard>
        </ServiceGrid>

        {/* Popular Airports */}
        <SectionTitle>Popular Airports</SectionTitle>
        <AirportGrid>
          {airports.map((airport, index) => (
            <Link href="/search" key={index}>
              <AirportCard>
                <AirportImage src={airport.image} alt={airport.name} />
                <AirportOverlay />
                <AirportName>{airport.name}</AirportName>
              </AirportCard>
            </Link>
          ))}
        </AirportGrid>

        {/* Fleet Preview */}
        <SectionTitle>Our Premium Fleet</SectionTitle>
        <FleetGrid>
          <FleetCard>
            <FleetImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rm0kaGQ1rmiI-7ke9zOInTvCtJ6TTLhPrmR0DtBTgtQ.png"
              alt="Executive Saloon"
            />
            <FleetInfo>
              <FleetName>Executive Saloon</FleetName>
              <FleetDesc>Audi A6 or similar</FleetDesc>
            </FleetInfo>
          </FleetCard>
          <FleetCard>
            <FleetImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gv684D8YAl4J-7i8XaY73oiLwLvElvvo4qLTsrv7ZCo.png"
              alt="Luxury"
            />
            <FleetInfo>
              <FleetName>Luxury</FleetName>
              <FleetDesc>Mercedes S-Class</FleetDesc>
            </FleetInfo>
          </FleetCard>
          <FleetCard>
            <FleetImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/q3cXedoVmhIR-7FbezwJtfuKOEdJn19lDka9u5YumR6.png"
              alt="MPV"
            />
            <FleetInfo>
              <FleetName>Executive MPV</FleetName>
              <FleetDesc>Mercedes V-Class</FleetDesc>
            </FleetInfo>
          </FleetCard>
        </FleetGrid>
      </ContentSection>
    </Wrapper>
  );
}

// Styled components
const Wrapper = tw.div`
  min-h-screen bg-gray-50
`;

const HeroSection = tw.div`
  relative h-80 lg:h-96
`;

const HeroImage = tw.img`
  absolute inset-0 w-full h-full object-cover object-center
`;

const HeroOverlay = tw.div`
  absolute inset-0 bg-gradient-to-b from-brand-blue/90 via-brand-blue/70 to-brand-blue/90
`;

const Header = tw.header`
  relative z-10 flex justify-between items-center p-4 lg:p-6
`;

const LogoContainer = tw.div`
  flex items-center gap-2
`;

const Logo = tw.img`
  h-12 lg:h-14 object-contain
`;

const BrandName = tw.span`
  text-white font-bold text-xl hidden sm:block
`;

const Profile = tw.div`
  flex items-center gap-3
`;

const UserName = tw.span`
  text-white text-sm hidden sm:block
`;

const UserImage = tw.img`
  h-10 w-10 rounded-full border-2 border-white cursor-pointer hover:opacity-80 transition
`;

const HeroContent = tw.div`
  relative z-10 flex flex-col items-center justify-center text-center px-4 pt-8
`;

const HeroTitle = tw.h1`
  text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg
`;

const HeroSubtitle = tw.p`
  text-gray-200 mb-6 text-lg
`;

const BookButton = tw.button`
  flex items-center gap-2 bg-brand-yellow text-brand-dark font-bold py-4 px-8 rounded-xl
  hover:bg-brand-gold transition shadow-lg hover:shadow-xl text-lg
`;

const BookButtonIcon = tw.span`
  w-5 h-5
`;

const ContentSection = tw.main`
  px-4 lg:px-8 py-6 max-w-6xl mx-auto
`;

const SectionTitle = tw.h2`
  text-xl font-bold text-brand-blue mb-4 mt-6
`;

const ServiceGrid = tw.div`
  grid grid-cols-1 sm:grid-cols-3 gap-4
`;

const ServiceCard = tw.div`
  bg-white rounded-xl shadow-md overflow-hidden cursor-pointer
  hover:shadow-lg transition transform hover:-translate-y-1
`;

const ServiceImage = tw.img`
  w-full h-32 object-contain bg-gray-50 p-4
`;

const ServiceIcon = tw.div`
  w-full h-32 flex items-center justify-center bg-gray-50 text-brand-blue
`;

const ServiceContent = tw.div`
  p-4
`;

const ServiceTitle = tw.h3`
  font-bold text-brand-dark
`;

const ServiceDescription = tw.p`
  text-sm text-gray-600
`;

const AirportGrid = tw.div`
  grid grid-cols-2 lg:grid-cols-4 gap-4
`;

const AirportCard = tw.div`
  relative rounded-xl overflow-hidden h-32 cursor-pointer group
`;

const AirportImage = tw.img`
  absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300
`;

const AirportOverlay = tw.div`
  absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent
`;

const AirportName = tw.span`
  absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow
`;

const FleetGrid = tw.div`
  grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8
`;

const FleetCard = tw.div`
  bg-white rounded-xl shadow-md overflow-hidden
`;

const FleetImage = tw.img`
  w-full h-40 object-contain bg-gray-50 p-4
`;

const FleetInfo = tw.div`
  p-4 border-t
`;

const FleetName = tw.h4`
  font-bold text-brand-dark
`;

const FleetDesc = tw.p`
  text-sm text-gray-600
`;
