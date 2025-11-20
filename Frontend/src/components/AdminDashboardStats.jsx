import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, Wrench, UserCheck } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useContext } from "react";
import SearchContext from "../context/searchContext";


export default function AdminDashboardStats() {
	const { data, loading } = useSelector((state) => state.users);
	const { search, setSearch } = useContext(SearchContext);

	const stats = useMemo(() => {
		let mechanics = 0, customers = 0, admins = 0;

		data.forEach((user) => {
			if (user.role === "mechanic") mechanics++;
			if (user.role === "customer") customers++;
			if (user.role === "admin") admins++;
			if(user.isVerified == false) pendingMechanics++;
		});

		return { total: data.length, mechanics, customers, admins };
	}, [data]);

	// Skeleton loading 
	if (loading) {
		return (
			<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
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
			<Card onClick={(e) => setSearch("")} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<Users size={20} /> Total Users
					</CardTitle>
					<Badge>{stats.total}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">
					All registered users
				</CardContent>
			</Card>

			{/* Mechanics */}
			<Card onClick={(e) => setSearch("mechanic")} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<Wrench size={20} /> Mechanics
					</CardTitle>
					<Badge className="bg-blue-100 text-blue-800">{stats.mechanics}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">
					Total mechanics in system
				</CardContent>
			</Card>

			{/* Customers */}
			<Card onClick={(e) => setSearch("customer")} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<UserCheck size={20} /> Customers
					</CardTitle>
					<Badge className="bg-green-100 text-green-800">{stats.customers}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">
					Registered customers
				</CardContent>
			</Card>

			{/* Pending Mechanics */}
			<Card onClick={(e) => setSearch("")} className="min-w-0">
				<CardHeader className="flex items-center justify-between gap-2">
					<CardTitle className="text-base flex items-center gap-2 truncate">
						<Users size={20} /> Pending Mechanics
					</CardTitle>
					<Badge>{stats.mechanics.isVerified}</Badge>
				</CardHeader>
				<CardContent className="text-muted-foreground text-sm">
					Pending request of All Mechanics
				</CardContent>
			</Card>

		</div>
	);
}
