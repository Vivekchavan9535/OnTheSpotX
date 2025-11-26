// src/pages/FindingMechanics.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Loader2, Phone, ArrowLeft, MapPin, Wrench } from "lucide-react";
import axios from "../config/axios";

import { toast } from "react-toastify";

const toastErr = (msg) =>
	toast.error(msg, {
		position: "top-center",
		autoClose: 3000,
		theme: "dark",
	});

const toastSuccess = (msg) =>
	toast.success(msg, {
		position: "top-center",
		autoClose: 1000,
		theme: "dark",
	});

export default function FindingMechanics() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [request, setRequest] = useState(null);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`/service-request/${id}`, {
					headers: { Authorization: localStorage.getItem("token") },
				});
				setRequest(res.data.request);
			} catch (error) {
				console.log(error);
				setErr("No request found");
			}
			setLoading(false);
		};

		if (id) {
			fetchData();
		} else {
			setErr("No request id in URL");
			setLoading(false);
		}
	}, [id]);

	// pooling api
	useEffect(() => {
		if (!id) return;

		const interval = setInterval(async () => {
			try {
				const res = await axios.get(`/service-request/${id}`, {
					headers: { Authorization: localStorage.getItem("token") },
				});

				const updated = res.data.request;

				// if previously accepted and now changed mechanic cancelled/waiting
				if (request?.status === "accepted" && updated.status === "waiting") {
					toastErr("Mechanic cancelled the request. Searching again...");
					setRequest(updated); 
					return;
				}

				setRequest(updated);
			} catch (err) {
				console.log("poll error");
			}
		}, 10000); // 10second

		return () => clearInterval(interval);
	}, [id, request, navigate]);

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
				<Card className="w-full max-w-md shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span>Loading your request...</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Please wait while we fetch your mechanic details.
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error or no request
	if (err || !request) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
				<Card className="w-full max-w-md shadow-lg">
					<CardHeader>
						<CardTitle className="text-base">Request not found</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-center">
						<p className="text-sm text-muted-foreground">
							{err || "We couldn't find this service request."}
						</p>
						<div className="flex justify-center gap-2">
							<Button onClick={() => navigate(-1)} variant="outline">
								<ArrowLeft className="h-4 w-4 mr-1" />
								Go Back
							</Button>
							<Button onClick={() => (window.location.href = "/services")}>
								Back to Services
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const mechanic = request.mechanicId;
	const shortId = request._id ? request._id.slice(-6) : "";
	const status = request.status || "";

	const statusColor =
		status === "accepted"
			? "bg-emerald-100 text-emerald-700 border-emerald-200"
			: status === "completed"
				? "bg-blue-100 text-blue-700 border-blue-200"
				: "bg-amber-100 text-amber-700 border-amber-200";

	const isMechanicLoading = !mechanic || !mechanic.fullName;

	return (
		<div className="flex items-center justify-center bg-muted/40 px-4">
			<Card className="w-full max-w-md shadow-lg border border-border/60">
				<CardHeader>
					<CardTitle className="flex justify-between items-center text-base">
						{mechanic && <div className="flex flex-col gap-1">
							<span className="font-semibold">Mechanic Assigned ✅</span>
							<span className="text-xs text-muted-foreground">
								Your roadside assistance is on the way.
							</span>
						</div>}

						{shortId && (
							<span className="text-[11px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
								Req ID: {shortId}
							</span>
						)}
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-5">
					{/* Status pill */}
					<div
						className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${statusColor}`}
					>
						{status === "accepted" ? (
							<span className="w-2 h-2 rounded-full bg-current opacity-80" />
						) : (
							<Loader2 className="h-3 w-3 animate-spin" />
						)}
						<span className="capitalize">
							Status: {status || "updating..."}
						</span>
					</div>

					{/* Mechanic Details */}
					<div className="rounded-lg border bg-card/40 p-3 space-y-2">
						<div className="flex items-center gap-2 text-sm">
							<Wrench className="h-4 w-4 text-muted-foreground" />
							<div>
								<p className="text-xs text-muted-foreground">Assigned mechanic</p>
								<p className="font-semibold capitalize flex items-center gap-2">
									{isMechanicLoading ? (
										<>
											<Loader2 className="h-3 w-3 animate-spin" />
											Finding...
										</>
									) : (
										mechanic.fullName
									)}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2 text-sm">
							<Phone className="h-4 w-4 text-muted-foreground" />
							<div>
								<p className="text-xs text-muted-foreground">Phone</p>
								<p>{mechanic?.phone || "-"}</p>
							</div>
						</div>
					</div>

					{/* Request Details */}
					<div className="space-y-2 text-sm">
						{request.issueDescription && (
							<p>
								<span className="font-semibold">Issue:&nbsp;</span>
								<span>{request.issueDescription}</span>
							</p>
						)}

						{request.userLocation?.address && (
							<p className="flex items-start gap-1">
								<MapPin className="h-4 w-4 mt-[2px] text-muted-foreground" />
								<span>
									<span className="font-semibold">Location:&nbsp;</span>
									{request.userLocation.address}
								</span>
							</p>
						)}
					</div>

					{/* Actions */}
					<div className="flex justify-between items-center pt-1">
						<Button
							variant="outline"
							onClick={() => navigate(-1)}
							className="flex items-center gap-1"
						>
							<ArrowLeft className="h-4 w-4" />
							Back
						</Button>

						<Button
							onClick={() =>
								mechanic?.phone &&
								(window.location.href = `tel:${mechanic.phone}`)
							}
							className="flex items-center gap-1"
							disabled={!mechanic?.phone}
						>
							<Phone className="h-4 w-4" />
							{mechanic?.phone ? "Call Mechanic" : "Waiting..."}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
