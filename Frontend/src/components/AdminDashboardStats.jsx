import React, { useMemo, useContext } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, Wrench, UserCheck, FolderKanban } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SearchContext from "../context/searchContext";
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardStats({totalRequests = 0 }) {

	const navigate = useNavigate()


	
	const { data: usersData, loading: usersLoading = false } = useSelector((state) => state.users);
	const {data: serviceRequestsData, loading: serviceRequestsLoading = false } = useSelector((state) => state.serviceRequests);
	const {data: usersStatsData} = useSelector((state) => state.usersStats);

	const { totalUsers = 0, totalCustomers = 0, totalMechanics = 0, pendingMechanics = 0 } = usersStatsData || {};

	const loading = usersLoading || serviceRequestsLoading;

	const { search, setSearch } = useContext(SearchContext);



	// Skeleton loading
	if (loading) {
		return (
			<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i} className="min-w-0 p-4">
						<Skeleton height={22} width="70%" />
						<Skeleton height={20} width="40%" className="mt-2" />
						<Skeleton height={12} width="90%" className="mt-2" />
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 cursor-pointer">
			{/* Total Users */}
			<Card onClick={() => setSearch("")} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<Users size={20} /> Total Users
					</CardTitle>
					<Badge>{totalUsers}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">All registered users</CardContent>
			</Card>

			{/* Mechanics */}
			<Card onClick={() => setSearch("mechanic")} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<Wrench size={20} /> Mechanics
					</CardTitle>
					<Badge className="bg-blue-100 text-blue-800">{totalMechanics}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">Total mechanics in system</CardContent>
			</Card>

			{/* Customers */}
			<Card onClick={() => setSearch("customer")} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<UserCheck size={20} /> Customers
					</CardTitle>
					<Badge className="bg-green-100 text-green-800">{totalCustomers}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">Registered customers</CardContent>
			</Card>

			{/* Pending Mechanics */}
			<Card onClick={() => setSearch("pendingMechanics")} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<Users size={20} /> Pending Mechanics
					</CardTitle>
					<Badge>{pendingMechanics}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">Mechanics awaiting verification</CardContent>
			</Card>

			{/* All Service Requests Booked till now */}
			<Card onClick={() => { navigate('/all-service-requests?status=total&page=1') }} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<FolderKanban size={20} /> All Service Requests Booked
					</CardTitle>
					<Badge>{totalRequests}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">All service requests booked till now</CardContent>
			</Card>
		</div>
	);
}
