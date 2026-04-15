import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const UK_AIRPORTS = [
  { code: "BHX", name: "Birmingham Airport" },
  { code: "LHR", name: "London Heathrow Airport" },
  { code: "LGW", name: "London Gatwick Airport" },
  { code: "MAN", name: "Manchester Airport" },
  { code: "GLA", name: "Glasgow Airport" },
  { code: "EDI", name: "Edinburgh Airport" },
  { code: "BRS", name: "Bristol Airport" },
  { code: "NCL", name: "Newcastle Airport" },
  { code: "LPL", name: "Liverpool John Lennon Airport" },
  { code: "STN", name: "London Stansted Airport" },
  { code: "LTN", name: "London Luton Airport" },
  { code: "LCY", name: "London City Airport" },
  { code: "EMA", name: "East Midlands Airport" },
  { code: "LBA", name: "Leeds Bradford Airport" },
];

const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 5) {
    const hour = h % 12 || 12;
    const period = h < 12 ? "AM" : "PM";
    const time = `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
    TIME_OPTIONS.push(time);
  }
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [formTab, setFormTab] = useState("full");
  const [selectedAirport, setSelectedAirport] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [collectionTime, setCollectionTime] = useState("");
  const [pickup, setPickup] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [passengers, setPassengers] = useState("1");
  const [luggage, setLuggage] = useState("1");
  const router = useRouter();

  // Address autocomplete using Mapbox
  const searchPlaces = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setPickupSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            limit: 5,
            country: "GB",
          })
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setPickupSuggestions(data.features.map((f) => f.place_name));
      } else {
        setPickupSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (showSuggestions) {
        searchPlaces(pickup);
      }
    }, 150);
    return () => clearTimeout(debounce);
  }, [pickup, showSuggestions, searchPlaces]);

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

  const handleGetQuote = () => {
    if (!selectedAirport || !collectionDate || !collectionTime) {
      alert("Please fill in all required fields");
      return;
    }
    router.push({
      pathname: "/confirm",
      query: {
        pickup: pickup || selectedAirport,
        dropoff: selectedAirport,
        date: collectionDate,
        time: collectionTime,
        passengers,
        luggage,
      },
    });
  };

  const airports = [
    { name: "Birmingham Airport", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SJmc8syhToSd-40AgOmgAYXd0fHIhQH34eARJXnAW0p.jpg", desc: "One of the UK's busiest airports, connecting passengers to domestic and international destinations." },
    { name: "Heathrow Airport", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MfPAOfarF9VV-qj6ZgFxyU4GliYT8463V1uKPJ5bEL3.jpg", desc: "One of the world's busiest international airports, a key transit point for global travel." },
    { name: "Gatwick Airport", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rpBfpoRLxwlS-WUIYEd1fZT4f2VbAstXzdCEWmxCHcp.jpg", desc: "Known for its efficient terminals and extensive flight network." },
    { name: "Manchester Airport", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NKYFoNLN3fLl-PmEk8YESq8DqB2Nz8hp3aNbW5Ky0a4.jpg", desc: "Serving millions of travelers every year, a major gateway to Europe and beyond." },
  ];

  const fleet = [
    { name: "Standard Saloon", passengers: "4", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1A8TInoYmh5L-pVy1JRQIj6miR0Z3bWqmGSnvvIxinC.png" },
    { name: "Estate", passengers: "4", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rm0kaGQ1rmiI-7ke9zOInTvCtJ6TTLhPrmR0DtBTgtQ.png" },
    { name: "MPV", passengers: "6", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/q3cXedoVmhIR-7FbezwJtfuKOEdJn19lDka9u5YumR6.png" },
    { name: "Minibus", passengers: "8", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/q3cXedoVmhIR-7FbezwJtfuKOEdJn19lDka9u5YumR6.png" },
    { name: "Luxury", passengers: "4", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gv684D8YAl4J-7i8XaY73oiLwLvElvvo4qLTsrv7ZCo.png" },
  ];

  const services = [
    {
      title: "Corporate Events",
      desc: "Punctual, professional transfers for business meetings, conferences and corporate events.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_78.png-ISxnjQARXrOgteWWzI5cjYby2tjKfB.jpeg",
    },
    {
      title: "Family / Large Parties",
      desc: "Spacious vehicles with ample luggage room for families and groups travelling together.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/q3cXedoVmhIR-7FbezwJtfuKOEdJn19lDka9u5YumR6.png",
    },
    {
      title: "Various Vehicles",
      desc: "From standard saloons to luxury executive cars — choose the right vehicle for your journey.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wI0S8reqFCXK-wajzrlFgNLv9tca6oKyJaHqBo1etuj.png",
    },
  ];

  const travelerTypes = [
    { title: "Business Travelers", desc: "Punctual and professional airport transfers, allowing you to focus on your work while we handle the logistics." },
    { title: "Corporate Clients", desc: "Reliable and executive-level service for corporate travelers, with luxury vehicle options available." },
    { title: "Families & Groups", desc: "Spacious vehicles with ample room for luggage, child seats available on request." },
    { title: "Holidaymakers", desc: "Start your trip on the right note with a comfortable ride to the airport." },
    { title: "Students & Individuals", desc: "Affordable and dependable transport between university and the airport." },
    { title: "Special Occasions", desc: "Need an airport transfer for a wedding, event, or celebration? We provide tailored solutions." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Booking Form */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_78.png-n9Q46lv7qR4bHXYH92ycGu8e2yskU8.jpeg"
            alt="Premium Mercedes Taxi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 to-[#111111]/50"></div>
        </div>

        {/* Transparent Header */}
        <header className="relative z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/P9Su0EpSKC5T-ppi2ulQXwOYJWoe3KQ17gmGKNpGS25.png"
                alt="CabnFly"
                className="h-12"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-white">{user?.name}</span>
              <img
                src={user?.photoUrl}
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-white cursor-pointer hover:opacity-80"
                onClick={() => signOut(auth)}
              />
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
                Your Premier Airport Transfer Service
              </h1>
              <p className="text-lg text-white mb-6">
                At CabnFly, we offer private hire taxi services from anywhere in the UK to all major airports, ensuring you reach your destination comfortably, on time, and at the best price.
              </p>
            </div>

            {/* Right - Booking Form */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Form Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#111111] mb-4">Book Your Transfer</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Airport</label>
                  <select
                    value={selectedAirport}
                    onChange={(e) => setSelectedAirport(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                  >
                    <option value="">Select an airport...</option>
                    {UK_AIRPORTS.map((airport) => (
                      <option key={airport.code} value={airport.name}>
                        {airport.name} ({airport.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Enter your pickup address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                  />
                  {showSuggestions && pickupSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg z-30 max-h-48 overflow-y-auto border border-gray-200">
                      {pickupSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setPickup(suggestion);
                            setPickupSuggestions([]);
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
                    <input
                      type="date"
                      value={collectionDate}
                      onChange={(e) => setCollectionDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collection Time</label>
                    <select
                      value={collectionTime}
                      onChange={(e) => setCollectionTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                    >
                      <option value="">Select time...</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Luggage</label>
                    <select
                      value={luggage}
                      onChange={(e) => setLuggage(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGetQuote}
                  className="w-full bg-[#111111] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#222222] transition"
                >
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#111111] text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#111111]/40"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                  <div className="mt-4 inline-block bg-[#FFD700] text-[#111111] text-sm font-semibold px-4 py-2 rounded-lg">
                    Book Now
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hassle Free Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#111111] text-center mb-4">
            Hassle Free Airport Transfers at Your Convenience
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            CabnFly is designed to cater to all types of travelers, ensuring a smooth and convenient journey tailored to individual needs.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelerTypes.map((type, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-[#111111] mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm">{type.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#111111] font-semibold mt-8">
            Skip the hassle. Travel smarter with CabnFly. Book now and experience the best in airport transfers.
          </p>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#111111] text-center mb-12">Our Fleet</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {fleet.map((vehicle, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-lg transition">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="h-24 w-full object-contain mb-4"
                />
                <h3 className="font-bold text-[#111111]">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">{vehicle.passengers} PERSON</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Airports Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#111111] text-center mb-12">Popular Airports</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {airports.map((airport, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                <img
                  src={airport.image}
                  alt={airport.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#111111] mb-2">{airport.name}</h3>
                  <p className="text-gray-600">{airport.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/P9Su0EpSKC5T-ppi2ulQXwOYJWoe3KQ17gmGKNpGS25.png"
            alt="CabnFly"
            className="h-16 mx-auto mb-4"
          />
          <p className="text-white">Your Premier Airport Transfer Service</p>
          <p className="text-sm text-gray-400 mt-4">CabnFly - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
