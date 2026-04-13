import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map({ pickup, dropoff }) {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") return;

        let map;
        
        const initMap = async () => {
            const mapboxgl = (await import("mapbox-gl")).default;
            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

            map = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v12",
                center: [75.8366318, 25.1389012],
                zoom: 3
            });

            setMapLoaded(true);

            const addMarker = (coordinates) => {
                new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
            };

            // Check if pickup has valid coordinates (not [0,0] and not empty)
            const hasValidPickup = pickup && pickup.length === 2 && pickup[0] !== 0 && pickup[1] !== 0;
            const hasValidDropoff = dropoff && dropoff.length === 2 && dropoff[0] !== 0 && dropoff[1] !== 0;

            if (hasValidPickup) {
                addMarker(pickup);
            }

            if (hasValidDropoff) {
                addMarker(dropoff);
            }

            if (hasValidPickup && hasValidDropoff) {
                map.fitBounds([pickup, dropoff], {
                    padding: 60
                });
            }
        };

        initMap();

        return () => {
            if (map) map.remove();
        };
    }, [pickup, dropoff]);

    return <Wrapper id="map"></Wrapper>;
}

const Wrapper = tw.div`
  flex-1 h-1/2
`;
