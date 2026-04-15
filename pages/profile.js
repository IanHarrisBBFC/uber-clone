import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createClient } from "@/lib/supabase/client";
import styled from "twin.macro";

const Wrapper = styled.div`
  min-h-screen bg-gray-100
`;

const Container = styled.div`
  max-width: 1200px margin 0 auto p-4
`;

const Header = styled.div`
  bg-[#111111] text-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center
`;

const Profile = styled.div`
  flex items-center gap-4
`;

const Avatar = styled.img`
  w-16 h-16 rounded-full border-2 border-[#FFD700]
`;

const RideHistory = styled.div`
  bg-white rounded-lg shadow-md overflow-hidden
`;

const RideItem = styled.div`
  border-b border-gray-200 p-6 hover:bg-gray-50 transition flex justify-between items-center
`;

const RideDetails = styled.div`
  flex-1
`;

const RideDate = styled.p`
  text-sm text-gray-500 mb-1
`;

const RideRoute = styled.p`
  font-semibold text-[#111111] mb-2
`;

const RidePrice = styled.p`
  text-lg font-bold text-[#FFD700]
`;

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
  }, []);

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
    return <Wrapper><Container><p className="text-center py-8">Loading...</p></Container></Wrapper>;
  }

  if (!user) return null;

  const totalSpent = rides.reduce((sum, ride) => sum + parseFloat(ride.price || 0), 0);
  const totalRides = rides.length;

  return (
    <Wrapper>
      <Container>
        {/* Header */}
        <Header>
          <Profile>
            <Avatar src={user.photoURL} alt={user.displayName} />
            <div>
              <h1 className="text-2xl font-bold">{user.displayName || "User"}</h1>
              <p className="text-gray-300">{user.email}</p>
            </div>
          </Profile>
          <button
            onClick={() => signOut(auth)}
            className="bg-[#FFD700] text-[#111111] px-4 py-2 rounded font-bold hover:bg-yellow-600"
          >
            Sign Out
          </button>
        </Header>

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
        <RideHistory>
          <div className="p-6 bg-[#111111] text-white">
            <h2 className="text-2xl font-bold">Ride History</h2>
          </div>
          {rides.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No rides yet. Book your first transfer now!</p>
            </div>
          ) : (
            rides.map((ride) => (
              <RideItem key={ride.id}>
                <RideDetails>
                  <RideDate>
                    {new Date(ride.created_at).toLocaleDateString()} at{" "}
                    {new Date(ride.created_at).toLocaleTimeString()}
                  </RideDate>
                  <RideRoute>
                    {ride.pickup} → {ride.dropoff}
                  </RideRoute>
                  <p className="text-sm text-gray-600">{ride.vehicle} • {ride.duration} mins</p>
                </RideDetails>
                <RidePrice>£{ride.price}</RidePrice>
              </RideItem>
            ))
          )}
        </RideHistory>
      </Container>
    </Wrapper>
  );
}
