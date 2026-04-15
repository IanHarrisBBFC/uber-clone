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
                new mapboxgl.Marker({ color: '#111111' }).setLngLat(pickup).addTo(map);
            }

            if (hasValidDropoff) {
                new mapboxgl.Marker({ color: '#FFD700' }).setLngLat(dropoff).addTo(map);
            }

            // Draw route between pickup and dropoff
            if (hasValidPickup && hasValidDropoff) {
                map.fitBounds([pickup, dropoff], {
                    padding: 80
                });

                // Fetch route from Mapbox Directions API
                try {
                    const response = await fetch(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
                    );
                    const data = await response.json();
                    
                    if (data.routes && data.routes.length > 0) {
                        const route = data.routes[0].geometry;

                        map.on('load', () => {
                            // Add route line
                            if (map.getSource('route')) {
                                map.getSource('route').setData({
                                    type: 'Feature',
                                    properties: {},
                                    geometry: route
                                });
                            } else {
                                map.addSource('route', {
                                    type: 'geojson',
                                    data: {
                                        type: 'Feature',
                                        properties: {},
                                        geometry: route
                                    }
                                });

                                map.addLayer({
                                    id: 'route',
                                    type: 'line',
                                    source: 'route',
                                    layout: {
                                        'line-join': 'round',
                                        'line-cap': 'round'
                                    },
                                    paint: {
                                        'line-color': '#111111',
                                        'line-width': 4,
                                        'line-opacity': 0.8
                                    }
                                });
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error fetching route:", error);
                }
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
