import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from 'react-redux'
import { ConfirmDialog } from "../components/ui/components/ui/ConfirmDialog.jsx";



export default function ServiceCardUi({
	title = "Untitled Service",
	description = "Explore the service in detail.",
	basePrice = "",
	onEdit, // Used to trigger the edit modal
	onDelete,
	onBook,
	role // Passed from the Service component
}) {

	return (
		<Card className="rounded-xl shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.03]">
			{/* Header */}
			<CardHeader className="pb-0">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-lg sm:text-xl leading-tight">
							{title}
						</CardTitle>
						<Badge className="bg-slate-100 text-slate-800 mt-1 text-xs px-2 py-0.5">
							Service
						</Badge>
					</div>

					{/* Admin Controls */}
					{role === "admin" && (
						<div className="flex gap-2 mt-1">
							<button
								onClick={onEdit}
								className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 transition"
								title="Edit"
							>
								<FaEdit size={16} />
							</button>

							<ConfirmDialog
								title="Delete Service?"
								desc="This action cannot be undone."
								actionLabel="Delete"
								onConfirm={onDelete}
								trigger={
									<button className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 transition"  title="Delete">
										<FaTrash size={16} className="text-red-500" />
									</button>
								}
							/>


						</div>
					)}
				</div>
			</CardHeader>

			{/* Content */}
			<CardContent className="pt-3">
				<p className="text-sm text-muted-foreground line-clamp-3">
					{description}
				</p>

				<div className="flex justify-between items-center mt-4">
					<div>
						<p className="text-xs text-muted-foreground">Base Price</p>
						<p className="text-base font-semibold">₹{basePrice}</p>
					</div>

					<Button size="sm" onClick={onBook}>
						Book Now
					</Button>
				</div>

				<Separator className="my-3" />

				<div className="flex justify-between text-xs text-muted-foreground">
					<span>Instant Support</span>
					<span>Available 24/7</span>
				</div>
			</CardContent>
		</Card>
	);
}