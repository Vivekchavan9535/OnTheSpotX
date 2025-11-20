// src/pages/UsersTable.jsx
import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, fetchSingleUser } from "../slices/usersSlice";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ui/components/ui/ConfirmDialog.jsx";
import SearchContext from "../context/searchContext";
import PaginationUi from '../components/PaginationUi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function UsersTable() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data, loading, error } = useSelector((state) => state.users);


	// minimal, safe sorting by fullName A->Z
	const sortedUsers = [...data].sort((a, b) =>
		(a?.fullName ?? "").localeCompare(b?.fullName ?? "")
	);

	// centralized search state from App
	const { search, setSearch } = useContext(SearchContext);

	const handleDelete = (id) => dispatch(deleteUser(id));
	const handleShow = (id) => {
		dispatch(fetchSingleUser(id));
		navigate(`/user/${id}`);
	};

	// skeleton counts
	const SKELETON_COUNT = 6;

	// role -> tailwind classes for badge (choose readable pairs)
	function getRoleBadgeClass(role) {
		switch ((role || "").toLowerCase()) {
			case "admin":
				return "bg-purple-100 text-purple-800";
			case "mechanic":
				return "bg-blue-100 text-blue-800";
			case "customer":
				return "bg-gray-100 text-gray-800";
			case "manager":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-slate-100 text-slate-800";
		}
	}

	return (
		<div className="p-5 sm:p-8">
			{/* top notices */}
			<div className="p-5">
				{error && <p className="mt-3 text-sm text-red-500">{String(error)}</p>}
				{!loading && data.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No users found</p>}
			</div>

			{/* Search input always rendered */}
			<div className="max-w-sm mb-4">
				<Input
					placeholder="Search users..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			{/* mobile card list */}
			<div className="space-y-4 md:hidden cursor-pointer">
				{loading ? (
					// show skeleton cards while loading
					Array.from({ length: SKELETON_COUNT }).map((_, i) => (
						<div key={i} className="p-4 bg-white rounded-lg shadow border flex items-start gap-4">
							<div>
								<Skeleton circle height={48} width={48} />
							</div>
							<div className="flex-1">
								<Skeleton width={`60%`} height={18} />
								<Skeleton width={`40%`} height={14} style={{ marginTop: 8 }} />
								<div className="flex gap-2 mt-2">
									<Skeleton width={60} height={20} />
									<Skeleton width={40} height={20} />
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<Skeleton width={36} height={32} />
								<Skeleton width={36} height={32} />
							</div>
						</div>
					))
				) : (
					sortedUsers.slice(1).map((user) => (
						<div key={user._id} className="p-4 bg-white rounded-lg shadow border flex items-start gap-4">
							<Avatar><AvatarFallback>{(user.fullName || "U").split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback></Avatar>
							<div className="flex-1">
								<h3 className="font-semibold">{user.fullName}</h3>
								<p className="text-sm text-muted-foreground">{user.email}</p>
								<div className="flex gap-2 mt-2 items-center">
									{/* role badge with nicer color */}
									<Badge className={getRoleBadgeClass(user.role)}>{user.role}</Badge>

									<span
										className={`text-xs px-2 py-1 rounded-full ${user.isVerified == true ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
										{user.isVerified == false ? "Not Verified" : "Verified"}
									</span>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Button type="button" onClick={() => handleShow(user._id)} variant="ghost" size="sm"><Eye size={16} /></Button>
								<ConfirmDialog
									title="Delete this user?"
									desc="This action cannot be undone."
									actionLabel="Delete"
									onConfirm={() => handleDelete(user._id)}
									trigger={<Button type="button" variant="destructive" size="sm"><Trash size={16} /></Button>}
								/>
							</div>
						</div>
					))
				)}

				<PaginationUi />
			</div>

			{/* desktop table */}
			<div className="hidden md:block overflow-x-auto cursor-pointer">
				{loading ? (
					// skeleton table
					<div className="bg-white rounded shadow">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from({ length: SKELETON_COUNT }).map((_, i) => (
									<TableRow key={i}>
										<TableCell className="flex items-center gap-3">
											<Skeleton circle height={40} width={40} />
											<div>
												<Skeleton width={140} height={14} />
												<Skeleton width={100} height={12} />
											</div>
										</TableCell>
										<TableCell><Skeleton width={160} height={12} /></TableCell>
										<TableCell><Skeleton width={80} height={20} /></TableCell>
										<TableCell><Skeleton width={60} height={20} /></TableCell>
										<TableCell className="text-right"><Skeleton width={120} height={28} /></TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{sortedUsers.slice(1).map((user) => (
									<TableRow key={user._id}>
										<TableCell className="flex items-center gap-3">
											<Avatar>
												<AvatarFallback>{(user.fullName || "U").split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{user.fullName}</div>
												<div className="text-xs text-muted-foreground">ID: {user._id}</div>
											</div>
										</TableCell>

										<TableCell>{user.email}</TableCell>

										{/* role badge with color mapping */}
										<TableCell>
											<Badge className={getRoleBadgeClass(user.role)}>{user.role}</Badge>
										</TableCell>

										<TableCell>
											{(() => {
												const value = user?.isVerified;
												const isVerified = value === false;

												const pillClass = isVerified ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"

												return (
													<span
														className={`px-2 py-1 text-xs rounded-full ${pillClass}`}
														title={isVerified ? "Verified user" : "Not verified"}
													>
														{isVerified ? "Not verified" : "Verified"}
													</span>
												);
											})()}
										</TableCell>

										<TableCell className="text-right">
											<div className="flex gap-2 justify-end">
												<Button onClick={() => handleShow(user._id)} variant="ghost" size="sm"><Eye size={16} /></Button>

												<ConfirmDialog
													title="Delete User?"
													desc="This action cannot be undone."
													actionLabel="Delete"
													onConfirm={() => handleDelete(user._id)}
													trigger={<Button variant="destructive" size="sm"><Trash size={16} /></Button>}
												/>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className="mt-4">
							<PaginationUi />
						</div>
					</>
				)}
			</div>

			{/* bottom loading indicator (optional) */}
			<div className="p-5 text-center">
				{loading && <p className="mt-3 text-sm">Loading...</p>}
			</div>
		</div>
	);
}
