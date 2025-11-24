import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const ReviewCards = () => {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Mock data 
		const mockReviews = [
			{
				id: 1,
				userName: "Rajesh Kumar",
				userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
				rating: 5,
				comment: "Excellent service! The mechanic arrived quickly and fixed my car on the spot. Very professional!",
				date: "2025-11-20"
			},
			{
				id: 2,
				userName: "Priya Sharma",
				userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
				rating: 4,
				comment: "Great experience. Quick diagnosis and fair pricing. Highly recommend OnTheSpotX!",
				date: "2025-11-18"
			},
			{
				id: 3,
				userName: "Amit Patel",
				userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
				rating: 5,
				comment: "Best mobile mechanic service in town. No more waiting at workshops. Amazing!",
				date: "2025-11-15"
			},
			{
				id: 4,
				userName: "Sneha Verma",
				userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
				rating: 5,
				comment: "Transparent pricing and genuine parts used. Perfect service experience!",
				date: "2025-11-12"
			},
			{
				id: 5,
				userName: "Arjun Singh",
				userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
				rating: 4,
				comment: "Fast and reliable. The technician was knowledgeable and courteous throughout.",
				date: "2025-11-10"
			},
			{
				id: 6,
				userName: "Anjali Desai",
				userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
				rating: 5,
				comment: "I'm impressed with the quality of service. Will definitely use again!",
				date: "2025-11-08"
			}
		];
		
		setReviews(mockReviews);
		setLoading(false);
	}, []);

	const renderStars = (rating) => {
		return (
			<div className="flex gap-1">
				{Array.from({ length: 5 }).map((_, i) => (
					<Star
						key={i}
						size={16}
						className={i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
					/>
				))}
			</div>
		);
	};

	if (loading) {
		return <div className="text-center py-8">Loading reviews...</div>;
	}

	return (
		<section className="py-12 px-5 overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-[20px] sm:text-[40px] font-bold text-center mb-4">
					What Our Customers Say
				</h2>
				<p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
					Don't just take our word for it. Here's what our satisfied customers have to say about their experience with OnTheSpotX.
				</p>

				{/* Scrolling Container */}
				<div className="relative w-full overflow-hidden">
					{/* Gradient overlays for smooth edges */}
					<div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
					<div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

					{/* Scrolling Cards */}
					<div className="flex animate-scroll gap-6 py-4">
						{/* First set of reviews */}
						{reviews.map((review) => (
							<div key={review.id} className="flex-shrink-0 w-full sm:w-96">
								<Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white border-2">
									<CardContent className="p-6 h-full flex flex-col">
										{/* Stars */}
										<div className="mb-3">
											{renderStars(review.rating)}
										</div>

										{/* Comment */}
										<p className="text-gray-700 text-sm mb-6 flex-grow line-clamp-4">
											"{review.comment}"
										</p>

										{/* User Info */}
										<div className="flex items-center gap-3 pt-4 border-t">
											<Avatar className="h-10 w-10">
												<AvatarImage src={review.userImage} alt={review.userName} />
												<AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="font-semibold text-sm text-gray-900">{review.userName}</p>
												<p className="text-xs text-gray-500">{review.date}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						))}
						
						{/* Duplicate set for seamless loop */}
						{reviews.map((review) => (
							<div key={`${review.id}-duplicate`} className="flex-shrink-0 w-full sm:w-96">
								<Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white border-2">
									<CardContent className="p-6 h-full flex flex-col">
										{/* Stars */}
										<div className="mb-3">
											{renderStars(review.rating)}
										</div>

										{/* Comment */}
										<p className="text-gray-700 text-sm mb-6 flex-grow line-clamp-4">
											"{review.comment}"
										</p>

										{/* User Info */}
										<div className="flex items-center gap-3 pt-4 border-t">
											<Avatar className="h-10 w-10">
												<AvatarImage src={review.userImage} alt={review.userName} />
												<AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="font-semibold text-sm text-gray-900">{review.userName}</p>
												<p className="text-xs text-gray-500">{review.date}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						))}
					</div>
				</div>

				{/* Mobile Info */}
				<div className="mt-8 text-center text-sm text-gray-600">
					<p className="text-xs">Swipe left to see more reviews →</p>
				</div>
			</div>

			<style>{`
				@keyframes scroll {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}

				.animate-scroll {
					animation: scroll 40s linear infinite;
				}

				.animate-scroll:hover {
					animation-play-state: paused;
				}
			`}</style>
		</section>
	);
};

export default ReviewCards;
