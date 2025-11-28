import React, { useMemo, useContext } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CheckCircle, XCircle, Clock, Truck, Box } from "lucide-react";
import SearchContext from "../context/searchContext";




export default function ServiceBookingStats({ onFilter = () => { }, sliceKey = "serviceRequests" }) {
	// safe selector — use provided sliceKey or fallback
	const serviceSlice = useSelector((state) => state[sliceKey] || {});
	const { data: requests = [], loading = false } = serviceSlice || {};

	const { setSearch } = useContext(SearchContext) || {};

	const counts = useMemo(() => {
		const initial = {
			waiting: 0,
			accepted: 0,
			completed: 0,
			cancelled: 0,
			other: 0,
			total: 0,
		};

		for (const r of (requests || [])) {
			const s = (r?.status || "other").toString().toLowerCase();
			if (s === "waiting") initial.waiting++;
			else if (s === "accepted") initial.accepted++;
			else if (s === "completed") initial.completed++;
			else if (s === "cancelled" || s === "canceled") initial.cancelled++;
			else initial.other++;
			initial.total++;
		}

		return initial;
	}, [requests]);

	const items = [
		{
			key: "waiting",
			title: "Waiting",
			subtitle: "Requests awaiting mechanic",
			icon: Clock,
			count: counts.waiting,
			colorClass: "bg-yellow-100 text-yellow-800",
		},
		{
			key: "accepted",
			title: "Accepted",
			subtitle: "Currently assigned to mechanic",
			icon: Truck,
			count: counts.accepted,
			colorClass: "bg-blue-100 text-blue-800",
		},
		{
			key: "completed",
			title: "Completed",
			subtitle: "Successfully finished services",
			icon: CheckCircle,
			count: counts.completed,
			colorClass: "bg-green-100 text-green-800",
		},
		{
			key: "cancelled",
			title: "Cancelled",
			subtitle: "Cancelled or declined requests",
			icon: XCircle,
			count: counts.cancelled,
			colorClass: "bg-red-100 text-red-800",
		},
	];

	// Loading skeleton
	if (loading) {
		return (
			<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i} className="min-w-0 p-4">
						<Skeleton height={18} width="60%" />
						<div className="mt-3">
							<Skeleton height={36} width={80} />
						</div>
						<Skeleton height={12} width="90%" className="mt-3" />
					</Card>
				))}
			</div>
		);
	}

	const handleClick = (statusKey) => {
		if (typeof setSearch === "function") setSearch("");
		onFilter(statusKey);
	};

	return (
		<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
			{items.map((it) => {
				const Icon = it.icon;
				return (
					<Card
						key={it.key}
						onClick={() => handleClick(it.key)}
						className="min-w-0 hover:shadow-lg transition-shadow cursor-pointer"
					>
						<CardHeader className="flex items-start justify-between gap-2">
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-lg ${it.colorClass}`}>
									<Icon size={18} />
								</div>
								<div>
									<CardTitle className="text-sm font-medium">{it.title}</CardTitle>
									<div className="text-xs text-muted-foreground">{it.subtitle}</div>
								</div>
							</div>

							<Badge className="text-base">{it.count}</Badge>
						</CardHeader>

						<CardContent className="pt-2 text-sm text-muted-foreground">
							<div>Total: {counts.total}</div>
							<div className="mt-2">
								<Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleClick(it.key); }}>
									View {it.title}
								</Button>
							</div>
						</CardContent>
					</Card>
				);
			})}

			{/* small 'other' card to the right (fits the grid on lg screens) */}
			<Card onClick={() => handleClick("other")} className="min-w-0 hover:shadow-lg transition-shadow cursor-pointer">
				<CardHeader className="flex items-start justify-between gap-2">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-slate-100 text-slate-800">
							<Box size={18} />
						</div>
						<div>
							<CardTitle className="text-sm font-medium">Other</CardTitle>
							<div className="text-xs text-muted-foreground">Unclassified statuses</div>
						</div>
					</div>

					<Badge className="text-base">{counts.other}</Badge>
				</CardHeader>

				<CardContent className="pt-2 text-sm text-muted-foreground">
					<div>Total: {counts.total}</div>
					<div className="mt-2">
						<Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleClick("other"); }}>
							View Others
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
