import { useState, useEffect } from "react";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import PaginationUi from './PaginationUi';
import { fetchServiceRequests } from "../slices/serviceRequestsSlice.js";
import { useDispatch, useSelector } from "react-redux";


export default function AllServiceRequestsTable() {

	const [page, setPage] = useState(1)
	const dispatch = useDispatch()

	const { data = [], loading = false, totalPages} = useSelector((state) => state.serviceRequests);

	useEffect(() => {
		dispatch(fetchServiceRequests({ page }))
	}, [page, dispatch])

	//format date
	const formatDate = (iso) => {
		try {
			const d = new Date(iso);
			return d.toLocaleString();
		} catch {
			return iso;
		}
	};

	const renderStatusBadge = (status) => {
		switch (status) {
			case "waiting":
				return <Badge className="bg-yellow-100 text-yellow-800">Waiting</Badge>;
			case "accepted":
				return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>;
			case "completed":
				return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
			case "cancelled":
				return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
			default:
				return <Badge>{status}</Badge>;
		}
	};

	// Mobile-friendly collapsed row (show minimal fields)
	const MobileRow = ({ req }) => (
		<div className="block lg:hidden border rounded-md p-3 mb-3 bg-card">
			<div className="flex items-start justify-between gap-2">
				<div>
					<div className="text-sm font-medium truncate">{req.vehicleType || "Vehicle"}</div>
					<div className="text-xs text-muted-foreground truncate">{req.userLocation?.address || req.issueDescription}</div>
				</div>
				<div className="text-right space-y-1">
					<div>{renderStatusBadge(req.status)}</div>
					<div className="text-xs text-muted-foreground">{formatDate(req.createdAt)}</div>
				</div>
			</div>

			<details className="mt-3 text-sm">
				<summary className="cursor-pointer flex items-center justify-between">
					<span className="text-sm">Details</span>
					<MoreHorizontal size={16} />
				</summary>

				<div className="mt-2 space-y-2">
					<div><strong>Issue:</strong> {req.issueDescription}</div>
					<div><strong>Customer:</strong> {req.customerNumber || "—"}</div>
					<div><strong>Mechanic:</strong> {req.mechanicId || "—"}</div>

					<div className="flex gap-2 mt-2">
						<Button size="sm" onClick={() => onRowClick(req)}>Open</Button>
						{req.status === "waiting" && (
							<>
								<Button size="sm" variant="ghost" onClick={() => onAccept(req._id)}><Eye /></Button>
								<Button size="sm" variant="destructive" onClick={() => onReject(req._id)}><Trash /></Button>
							</>
						)}
					</div>
				</div>
			</details>
		</div>
	);

	if (loading) {
		// simple skeleton table while loading
		return (
			<div className="p-4">
				<div className="hidden lg:block rounded-md overflow-hidden border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Request</TableHead>
								<TableHead>Issue</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 6 }).map((_, i) => (
								<TableRow key={i}>
									<TableCell><Skeleton width={120} /></TableCell>
									<TableCell><Skeleton count={1} /></TableCell>
									<TableCell><Skeleton width={80} /></TableCell>
									<TableCell><Skeleton width={100} /></TableCell>
									<TableCell><Skeleton width={120} /></TableCell>
									<TableCell><Skeleton width={140} /></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{/* Mobile skeleton */}
				<div className="block lg:hidden mt-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="border rounded-md p-3 mb-3">
							<Skeleton height={14} width="60%" />
							<div className="mt-2"><Skeleton count={1} /></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-4">
			{/* Desktop / large screens */}
			<div className="hidden lg:block rounded-md overflow-hidden border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Request</TableHead>
							<TableHead>Issue</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{data?.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
									No service requests found
								</TableCell>
							</TableRow>
						) : (
							data?.map((req) => (
								<TableRow key={req._id} className="hover:bg-muted/50">
									<TableCell onClick={() => onRowClick(req)} className="cursor-pointer">
										<div className="font-medium">{req.vehicleType || "Vehicle"}</div>
										<div className="text-xs text-muted-foreground truncate max-w-xs">{req.issueDescription}</div>
									</TableCell>

									<TableCell className="max-w-sm truncate">{req.issueDescription}</TableCell>

									<TableCell>{renderStatusBadge(req.status)}</TableCell>

									<TableCell>{req.customerNumber || "—"}</TableCell>

									<TableCell className="truncate max-w-xs">{req.userLocation?.address || "—"}</TableCell>

									<TableCell>{formatDate(req.createdAt)}</TableCell>

									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Button size="sm" onClick={() => onRowClick(req)}><Eye /></Button>
											{req.status === "waiting" && (
												<>
													<Button size="sm" variant="destructive" onClick={() => onReject(req._id)}><Trash /></Button>
												</>
											)}
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Mobile screens */}
			<div className="block lg:hidden mt-3">
				{data?.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">No service requests found</div>
				) : (
					data?.map((req) => <MobileRow key={req._id} req={req} />)
				)}
			</div>

			{/* Pagination */}

			<div className="mt-4 flex justify-center">
				<PaginationUi page={page} setPage={setPage} totalPages={totalPages} />
			</div>
		</div>
	);
}
