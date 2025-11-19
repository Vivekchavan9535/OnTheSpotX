import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser, fetchSingleUser } from "../slices/usersSlice";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/alert-dialog";
import { ConfirmDialog } from "../components/ui/components/ui/ConfirmDialog.jsx";



export default function UsersTable() {
	const { data, loading } = useSelector((state) => state.users);
	const navigate = useNavigate();
	const dispatch = useDispatch();


	const handleDelete = (userId) => {
			dispatch(deleteUser(userId));
	};

	const handleShow = (userId) => {
		dispatch(fetchSingleUser(userId));
		navigate(`/user/${userId}`);
	}

	return (
		<div className="p-5 sm:p-8">

			{/* Mobile table*/}
			<div className="space-y-4 md:hidden">
				{(
					data.slice(1).map((user) => (
						<div key={user._id} className="p-4 bg-white rounded-lg shadow border flex items-start gap-4">
							<Avatar>
								<AvatarFallback className="bg-gradient-to-br from-indigo-500 to-sky-400 text-white">
									{user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1">
								<h3 className="font-semibold">{user.fullName}</h3>
								<p className="text-sm text-muted-foreground">{user.email}</p>
								<div className="flex gap-2 mt-2">
									<Badge className={
										user.role === "admin"
											? "bg-yellow-100 text-yellow-800"
											: user.role === "mechanic"
												? "bg-blue-100 text-blue-800"
												: "bg-green-100 text-green-800"
									}>
										{user.role}
									</Badge>

									<span className={`text-xs px-2 py-1 rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
										{user.status}
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
									trigger={
										<Button type="button" variant="destructive" size="sm"><Trash size={16} /></Button>
									}
								/>

							</div>
						</div>
					))
				)}
			</div>

			{/* 💻 Desktop Table */}
			<div className="hidden md:block overflow-x-auto">
				<Table className="w-full min-w-[600px]">
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
						{
							data.slice(1).map((user) => (
								<TableRow key={user._id} className="hover:bg-gray-50 transition">
									<TableCell className="flex items-center gap-3">
										<Avatar>
											<AvatarFallback className="bg-gradient-to-br from-indigo-500 to-sky-400 text-white">
												{user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<span className="font-medium">{user.fullName}</span>
											<span className="text-xs text-muted-foreground">ID: {user._id}</span>
										</div>
									</TableCell>

									<TableCell>{user.email}</TableCell>

									<TableCell>
										<Badge className={
											user.role === "admin"
												? "bg-yellow-100 text-yellow-800"
												: user.role === "mechanic"
													? "bg-blue-100 text-blue-800"
													: "bg-green-100 text-green-800"
										}>
											{user.role}
										</Badge>
									</TableCell>

									<TableCell>
										<span className={`inline-flex px-2 py-1 text-xs rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
											{user.status}
										</span>
									</TableCell>

									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Button onClick={() => handleShow(user._id)} variant="ghost" size="sm"><Eye size={16} />
											</Button>
											<ConfirmDialog
												title="Delete this user?"
												desc="This action cannot be undone."
												actionLabel="Delete"
												onConfirm={() => handleDelete(user._id)}
												trigger={
													<Button variant="destructive" size="sm">
														<Trash size={16} />
													</Button>
												}
											/>
										</div>
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}