// src/components/ProfileCard.jsx
import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* local uploaded image path */
const LOCAL_AVATAR_PATH = "/mnt/data/9C850328-876F-4AEE-A945-0AC0ED347BD6.jpeg";

const Icon = ({ children, size = 16 }) => (
	<span style={{ width: size, height: size }} className="inline-flex items-center justify-center mr-1">
		{children}
	</span>
);

const StarIcon = () => (
	<Icon>
		<svg width="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
			<path d="M12 .6l3.7 7.4L23.5 9.7l-5.5 5.4L19.3 24 12 20.2 4.7 24l1.3-8.9L.5 9.7l7.8-1.7z" />
		</svg>
	</Icon>
);

const PhoneIcon = () => (
	<Icon>
		<svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
			<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.9 19.9 0 0 1 11 18a19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1.2.4 2.4.9 3.5a2 2 0 0 1-.5 2.1l-1.6 1.7a16 16 0 0 0 6 6l1.7-1.7a2 2 0 0 1 2.1-.4c1.1.5 2.3.8 3.5.9A2 2 0 0 1 22 16.9z" />
		</svg>
	</Icon>
);

/* helper to convert phone to wa.me usable digits (remove spaces, +, parentheses, dashes) */
function formatPhoneForLink(phone = "") {
	if (!phone) return "";
	return String(phone).replace(/[^0-9]/g, "");
}

/* format createdAt to human readable string */
function formatDate(date) {
	if (!date) return "—";
	try {
		return new Date(date).toLocaleDateString("en-IN", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return String(date);
	}
}

export default function ProfileCard({ user, mechanic, loading = false }) {

	const name = mechanic?.fullName || user?.fullName || "Unknown";
	const email = mechanic?.email || user?.email || "—";
	const phone = mechanic?.phone || user?.phone || "";
	const avatar = user?.avatar || mechanic?.avatar || LOCAL_AVATAR_PATH;
	const initial = name ? String(name).charAt(0).toUpperCase() : "?";
	const isMechanic = Boolean(mechanic);
	const isVerified = mechanic?.isVerified;





	const location = mechanic?.location?.address ||
		(mechanic?.location ? `${mechanic.location.latitude}, ${mechanic.location.longitude}` : null);

	const experience = mechanic?.experience ?? null;
	const rating = mechanic?.rating ?? null;
	const reviews = mechanic?.reviews ?? null;
	const services = mechanic?.services ?? [];
	const specialization = mechanic?.specialization ?? null;

	// createdAt field (new)
	const createdAt = mechanic?.createdAt || user?.createdAt || null;

	const telCall = () => {
		if (!phone) return;
		window.location.href = `tel:${phone}`;
	};

	const openWhatsApp = (presetText = "") => {
		const digits = formatPhoneForLink(phone);
		if (!digits) return;
		const text = encodeURIComponent(presetText || `Hello ${name}, I need some help.`);
		window.open(`https://wa.me/${digits}?text=${text}`, "_blank");
	};

	// skeleton loading
	if (loading) {
		return (
			<div className="max-w-3xl mx-auto p-4">
				<Card className="shadow-lg">
					<div className="flex flex-col sm:flex-row items-center gap-5 p-6">
						<div className="w-24 h-24 sm:w-28 sm:h-28">
							<Skeleton circle height={112} width={112} />
						</div>

						<div className="flex-1 w-full text-center sm:text-left space-y-3">
							<div><Skeleton height={24} width="50%" /></div>
							<div><Skeleton height={16} width="40%" /></div>

							<div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
								<Skeleton height={28} width={64} />
								<Skeleton height={28} width={48} />
								<Skeleton height={28} width={56} />
							</div>

							<div className="mt-4 flex flex-col sm:flex-row gap-2 w-full">
								<Skeleton height={36} width="100%" style={{ maxWidth: 160 }} />
								<Skeleton height={36} width="100%" style={{ maxWidth: 160 }} />
								<Skeleton height={36} width="100%" style={{ maxWidth: 160 }} />
							</div>
						</div>
					</div>

					<Separator />

					<CardContent className="p-6 space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div>
								<Skeleton height={12} width="60%" />
								<div className="mt-2"><Skeleton height={16} width="100%" /></div>
							</div>

							<div>
								<Skeleton height={12} width="60%" />
								<div className="mt-2"><Skeleton height={16} width="100%" /></div>
							</div>

							<div>
								<Skeleton height={12} width="60%" />
								<div className="mt-2"><Skeleton height={16} width="100%" /></div>
							</div>
						</div>

						<div>
							<Skeleton height={14} width="30%" />
							<div className="mt-2 space-y-2">
								<Skeleton height={12} width="100%" />
								<Skeleton height={12} width="100%" />
							</div>
						</div>

						<div>
							<Skeleton height={14} width="30%" />
							<div className="mt-2 space-y-2">
								<Skeleton height={12} width="100%" />
								<Skeleton height={12} width="100%" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto p-4">
			<Card className="shadow-lg">
				<div className="flex flex-col sm:flex-row items-center gap-5 p-6">
					<Avatar className="w-24 h-24 sm:w-28 sm:h-28">
						{avatar ? <AvatarImage src={avatar} /> : null}
						<AvatarFallback className="text-5xl">{initial}</AvatarFallback>
					</Avatar>

					<div className="flex-1 text-center sm:text-left">
						<h3 className="text-xl font-semibold">{name}</h3>

						<p className="text-sm text-muted-foreground mt-2">{isMechanic ? "Mechanic" : "Registered User"}</p>

						<div className="flex flex-row items-center mt-3 gap-2">
							{isMechanic && (
								<div className="flex flex-wrap justify-center sm:justify-start gap-2 capitalize">
									{specialization && <Badge>{specialization}</Badge>}
									{services.slice(0, 3).map((s, i) => <Badge key={i}>{s}</Badge>)}
								</div>
							)}

							<span className={`text-xs px-2 py-1 rounded-full ${isVerified == false ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
								{isVerified == false ? "Not Verified" : "Verified"}
							</span>

						</div>
						{isMechanic && (
							<div className="mt-3 flex justify-center sm:justify-start items-center gap-2">
								<StarIcon />
								<span className="font-medium">{rating ?? "—"}</span>
								<span className="text-sm text-muted-foreground">({reviews ?? 0} reviews)</span>
							</div>
						)}

						<div className="mt-4 flex flex-col sm:flex-row gap-2">
							<Button size="sm" className="flex gap-2" onClick={telCall} disabled={!phone}>
								<PhoneIcon /> Call
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => openWhatsApp(`Hi ${name}, I found your profile on the app and want to ask about your services.`)}
								disabled={!phone}
							>
								Message (WhatsApp)
							</Button>
						</div>
					</div>
				</div>

				<Separator />

				<CardContent className="p-6 space-y-6">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<p className="text-xs text-muted-foreground">Email</p>
							<p className="font-medium">{email}</p>
						</div>

						<div>
							<p className="text-xs text-muted-foreground">Phone</p>
							<p className="font-medium">{phone || "—"}</p>
						</div>

						{isMechanic ? (
							<div>
								<p className="text-xs text-muted-foreground">Experience</p>
								<p className="font-medium">{experience ? `${experience} years` : "—"}</p>
							</div>
						) : (
							<div>
								<p className="text-xs text-muted-foreground">Role</p>
								<p className="font-medium">User</p>
							</div>
						)}

						{/* Joined / Created At */}
						<div>
							<p className="text-xs text-muted-foreground">Joined</p>
							<p className="font-medium">{formatDate(createdAt)}</p>
						</div>
					</div>

					{isMechanic && (
						<>
							<div>
								<h4 className="text-sm font-semibold">Location</h4>
								<p className="mt-1 text-sm text-muted-foreground">{location || "Not set"}</p>
							</div>

							<div>
								<h4 className="text-sm font-semibold">Services Offered</h4>
								<ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
									{services.length ? services.map((s, i) => <li key={i}>{s}</li>) : <li>No services listed</li>}
								</ul>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
