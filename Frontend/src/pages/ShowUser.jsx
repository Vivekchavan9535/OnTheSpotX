import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { fetchSingleUser } from "../slices/usersSlice";

export default function ShowUser() {
	const dispatch = useDispatch();
	const { id } = useParams();

	// safe selector fallback
	const { currentUser, loading, error } = useSelector((s) => s.users || {});

	useEffect(() => {
		if (!id) return;
		dispatch(fetchSingleUser(id));
		console.log(currentUser);
		
	}, [dispatch, id]);

	if (loading) return <div className="p-4">Loading user...</div>;
	if (error) return <div className="p-4 text-red-600">Error: {error.message || String(error)}</div>;
	if (!currentUser) return <div className="p-4">User not found.</div>;


	const userObj = currentUser.user ?? currentUser;
	const mechObj = currentUser.mechanic ?? currentUser.mechanic ?? undefined;

	return (
		<div className="p-4">
			<ProfileCard user={userObj} mechanic={mechObj} />
		</div>
	);
}
