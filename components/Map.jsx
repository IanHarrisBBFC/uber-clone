import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "!mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Map({ pickup, dropoff }) {
    useEffect(() => {
		const map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/streets-v12",
			center: [75.8366318, 25.1389012],
			zoom: 3
		});

		if (pickup.length != 0) {
			addCoordinates(map, pickup);
		}

		if (dropoff.length != 0) {
			addCoordinates(map, dropoff);
		}

		if (pickup.length != 0 && dropoff.length != 0) {
			map.fitBounds([pickup, dropoff], {
				padding: 60
			});
		}
	}, []);

	const addCoordinates = (map, coordinates) => {
		const marker1 = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
	};

    return <Wrapper id="map"></Wrapper>;
}

const Wrapper = tw.div`
  flex-1 h-1/2
`;
