import React, { useMemo } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
	CheckCircle,
	XCircle,
	Clock,
	Truck,
	Box
} from "lucide-react";

export default function ServiceBookingStats({ data, loading = false }) {

	const handleClick = (key) => {
		console.log("Clicked:", key);
	};

	const cards = useMemo(() => {
		if (!data) return [];
		console.log("hii");
		
		return [
			{
				key: "total",
				title: "Total Requests",
				subtitle: "All service requests",
				count: data.totalRequests,
				icon: Box,
				colorClass: "bg-blue-100 text-blue-600",
			},
			{
				key: "accepted",
				title: "Accepted",
				subtitle: "Approved requests",
				count: data.acceptedRequests,
				icon: CheckCircle,
				colorClass: "bg-green-100 text-green-600",
			},
			{
				key: "completed",
				title: "Completed",
				subtitle: "Finished services",
				count: data.completedRequests,
				icon: Truck,
				colorClass: "bg-purple-100 text-purple-600",
			},
			{
				key: "pending",
				title: "Pending",
				subtitle: "Waiting for action",
				count: data.pendingRequests,
				icon: Clock,
				colorClass: "bg-yellow-100 text-yellow-600",
			},
			{
				key: "cancelled",
				title: "Cancelled",
				subtitle: "Rejected requests",
				count: data.cancelledRequests,
				icon: XCircle,
				colorClass: "bg-red-100 text-red-600",
			},
		];
	}, [data]);

	if (loading) {
		return (
			<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				{[...Array(5)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton height={20} width={120} />
							<Skeleton height={14} width={80} />
						</CardHeader>
						<CardContent>
							<Skeleton height={30} />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
			{cards.map((card) => {
				const Icon = card.icon;

				return (
					<Card
						key={card.key}
						onClick={() => handleClick(card.key)}
						className="min-w-0 hover:shadow-lg transition-shadow cursor-pointer"
					>
						<CardHeader className="flex items-start justify-between gap-2">
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-lg ${card.colorClass}`}>
									<Icon size={18} />
								</div>

								<div>
									<CardTitle className="text-sm font-medium">
										{card.title}
									</CardTitle>
									<div className="text-xs text-muted-foreground">
										{card.subtitle}
									</div>
								</div>
							</div>

							<Badge className="text-base">{card.count}</Badge>
						</CardHeader>

						<CardContent className="pt-2 text-sm text-muted-foreground">

							<div className="mt-2">
								<Button
									size="sm"
									variant="ghost"
									onClick={(e) => {
										e.stopPropagation();
										handleClick(card.key);
									}}
								>
									View {card.title}
								</Button>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
