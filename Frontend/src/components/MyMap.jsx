// src/components/MyMap.jsx
import React, { useState, useMemo } from "react";
import { Map, Overlay,ZoomControl } from "pigeon-maps";
import handyMan from '../assets/handyMan.png'

export default function MyMap({
	mechlat = 12.9728512,
	mechLong = 77.6077312,
	customerLat = 12.9788512,
	customerLong = 77.6077312,
}) {
	// choose center: prefer customer, then mechanic, else fallback
	const center = useMemo(() => {
		if (customerLat && customerLong) return [customerLat, customerLong];
		if (mechlat && mechLong) return [mechlat, mechLong];
		return [12.9728512, 77.6077312];
	}, [mechlat, mechLong, customerLat, customerLong]);

	const [zoom, setZoom] = useState(13);

	return (
		<div className="w-full max-w-full mx-auto p-3">
			<div className="relative w-full h-[400px] lg:h-[600px]  rounded-lg overflow-hidden">
				{/* Map */}
				<Map
					center={center}
					defaultCenter={center}
					zoom={zoom}
					defaultZoom={13}
					attribution={false}
					height={"100%"}
				>
					<ZoomControl />
					{/* Pin icon on mechanic */}
					{mechlat && mechLong && (
						<Overlay anchor={[mechlat, mechLong]} offset={[20, 30]}>
							<div className="text-3xl select-none hover " aria-hidden>
							<img className="h-12 filter " src={handyMan} alt="" /> <p className="font-bold text-xs text-center">Mechanic</p>
							</div>
						</Overlay>
					)}

					{/* Pin icon on customer */}
					{customerLat && customerLong && (
						<Overlay anchor={[customerLat, customerLong]} offset={[20, 30]}>
							<div className="text-3xl select-none" aria-hidden>
								<img className="h-10 " src="https://icon-library.com/images/location-icon-svg/location-icon-svg-11.jpg" alt="" /><p className="font-bold text-xs text-center">You</p>
							</div>
						</Overlay>
					)}
				</Map>
			</div>
		</div>
	);
}
