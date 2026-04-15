import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchRides(currentUser.uid);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, fetchRides]);

  const fetchRides = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRides(data || []);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-center py-8">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const totalSpent = rides.reduce((sum, ride) => sum + parseFloat(ride.price || 0), 0);
  const totalRides = rides.length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-4">
        {/* Header */}
        <div className="bg-[#111111] text-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src={user.photoURL || '/default-profile.png'}
              alt={user.displayName}
              width={64}
              height={64}
              className="rounded-full border-2 border-[#FFD700]"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.displayName || "User"}</h1>
              <p className="text-gray-300">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="bg-[#FFD700] text-[#111111] px-4 py-2 rounded font-bold hover:bg-yellow-600"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Total Rides</p>
            <p className="text-3xl font-bold text-[#111111]">{totalRides}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-[#FFD700]">£{totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Average Ride Cost</p>
            <p className="text-3xl font-bold text-[#111111]">£{(totalSpent / totalRides || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Ride History */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-[#111111] text-white">
            <h2 className="text-2xl font-bold">Ride History</h2>
          </div>
          {rides.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No rides yet. Book your first transfer now!</p>
              <Link href="/" className="text-[#FFD700] hover:underline mt-2 inline-block">
                Book Now
              </Link>
            </div>
          ) : (
            rides.map((ride) => (
              <div key={ride.id} className="border-b border-gray-200 p-6 hover:bg-gray-50 transition flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(ride.created_at).toLocaleDateString()} at{" "}
                    {new Date(ride.created_at).toLocaleTimeString()}
                  </p>
                  <p className="font-semibold text-[#111111] mb-2">
                    {ride.pickup} → {ride.dropoff}
                  </p>
                  <p className="text-sm text-gray-600">{ride.vehicle} • {ride.duration} mins</p>
                </div>
                <p className="text-lg font-bold text-[#111111]">£{ride.price}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
