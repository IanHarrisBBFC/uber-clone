import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "!mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Map({ pickup, dropoff }) {
    useEffect(() => {
		console.log("[v0] Map rendering with pickup:", pickup, "dropoff:", dropoff);
		
		const map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/streets-v12",
			center: [75.8366318, 25.1389012],
			zoom: 3
		});

		const addMarker = (coordinates) => {
			new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
		};

		// Check if pickup has valid coordinates (not [0,0])
		const hasValidPickup = pickup && pickup[0] !== 0 && pickup[1] !== 0;
		const hasValidDropoff = dropoff && dropoff[0] !== 0 && dropoff[1] !== 0;

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

		return () => map.remove();
	}, [pickup, dropoff]);

    return <Wrapper id="map"></Wrapper>;
}

const Wrapper = tw.div`
  flex-1 h-1/2
`;
