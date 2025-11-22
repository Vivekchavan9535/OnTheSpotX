import { useEffect, useState } from "react";

const indiaTranslations = [
	"INDIA", // Eng
	"भारत", // Hindi
	"ভারত", // Bengali
	"இந்தியா", // Tamil
	"భారతదేశం", // Telugu
	"ಭಾರತ", // Kannada
	"ഇന്ത്യ", // Malayalam
	"ભારત", // Gujarati
	"ਭਾਰਤ", // Punjabi
	"भारत", // Marathi
	"بھارت", // Urdu
];

export default function IndiaText() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % indiaTranslations.length);
		}, 1000); // change every 2 seconds
		return () => clearInterval(interval);
	}, []);

	return (
		<span className="tricolor-text text-4xl sm:text-6xl font-extrabold transition-all duration-500">
			{indiaTranslations[index]}
		</span>
	);
}
