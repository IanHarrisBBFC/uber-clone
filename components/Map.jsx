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

            // Check if coordinates are valid numbers (not NaN, not 0, not undefined)
            const isValidCoord = (coord) => {
                return coord && 
                       Array.isArray(coord) && 
                       coord.length === 2 && 
                       typeof coord[0] === 'number' && 
                       typeof coord[1] === 'number' && 
                       !isNaN(coord[0]) && 
                       !isNaN(coord[1]) &&
                       coord[0] !== 0 && 
                       coord[1] !== 0;
            };
            
            const hasValidPickup = isValidCoord(pickup);
            const hasValidDropoff = isValidCoord(dropoff);

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
