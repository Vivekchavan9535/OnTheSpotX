import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard"; 
import { fetchSingleUser } from "../slices/usersSlice";
import {fetchSingleMechanic} from "../slices/mechanicSlice"

export default function ShowUser() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { currentUser, loading, error } = useSelector((state) => state.users || {});
  console.log(currentUser);
  

  useEffect(() => {
	if (!id) return; 
	// dispatch(fetchSingleUser(id));
	dispatch(fetchSingleMechanic(id))
  }, [dispatch, id]);

  if (loading) return <div className="p-4">Loading user...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error.message || error}</div>;
  if (!currentMech) return <div className="p-4">User not found.</div>;


  return (
	<div className="p-4">
	  <ProfileCard {...currentMech} />
	</div>
  );
}
