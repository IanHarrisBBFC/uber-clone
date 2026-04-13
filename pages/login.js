import React, { useEffect } from "react";
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div className="relative lg:w-1/2 h-72 lg:h-screen">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MfPAOfarF9VV-qj6ZgFxyU4GliYT8463V1uKPJ5bEL3.jpg"
          alt="Heathrow International Airport"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#003D7A]/90 to-[#003D7A]/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white text-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/P9Su0EpSKC5T-ppi2ulQXwOYJWoe3KQ17gmGKNpGS25.png"
            alt="CabnFly Logo"
            className="h-20 lg:h-32 mb-4"
          />
          <h1 className="text-3xl lg:text-5xl font-bold mb-2 drop-shadow-lg">CabnFly</h1>
          <p className="text-lg lg:text-xl text-gray-200">Your Premier Airport Transfer Service</p>
        </div>
      </div>

      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#003D7A] mb-2 text-center">Welcome to CabnFly</h2>
          <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
            Book premium airport transfers to and from all major UK airports including Heathrow, Manchester, Birmingham, and Gatwick.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-gray-700">Licensed Drivers</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-gray-700">24/7 Service</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs font-medium text-gray-700">Luxury Fleet</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-gray-700">Fixed Prices</span>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-[#003D7A] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#002D5A] transition duration-300 shadow-lg hover:shadow-xl"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Airport Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
            <span className="text-xs px-3 py-1 bg-[#003D7A]/10 text-[#003D7A] rounded-full font-medium">Heathrow</span>
            <span className="text-xs px-3 py-1 bg-[#003D7A]/10 text-[#003D7A] rounded-full font-medium">Manchester</span>
            <span className="text-xs px-3 py-1 bg-[#003D7A]/10 text-[#003D7A] rounded-full font-medium">Birmingham</span>
            <span className="text-xs px-3 py-1 bg-[#003D7A]/10 text-[#003D7A] rounded-full font-medium">Gatwick</span>
          </div>
        </div>
      </div>
    </div>
  );
}
