import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {Car, Users, Wrench, UserCheck, UserCog,Motorbike } from "lucide-react";


export default function AdminDashboardStats() {
  const { data, loading } = useSelector((state) => state.users);

  const stats = useMemo(() => {
    let mechanics = 0;
    let customers = 0;
    let admins = 0;
	let fourWheelers = 6;
	let twoWheelers = 40;
  

    data.forEach((u) => {
      if (u.role === "mechanic") mechanics++;
      if (u.role === "customer") customers++;
      if (u.role === "admin") admins++;
    });

    return {
      total: data.length,
      mechanics,
      customers,
	  fourWheelers,
	  twoWheelers,
      admins,
    };
  }, [data]);


  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">

      {/* Total Users */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users size={20} /> Total Users
          </CardTitle>
          <Badge>{stats.total}</Badge>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          All registered users
        </CardContent>
      </Card>

      {/* Mechanics */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench size={20} /> Mechanics
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800">{stats.mechanics}</Badge>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Total mechanics in system
        </CardContent>
      </Card>

      {/* Customers */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <UserCheck size={20} /> Customers
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">{stats.customers}</Badge>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Registered customers
        </CardContent>
      </Card>

	  {/* Four wheelers */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Car size={20} /> Four Wheelers
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">{stats.fourWheelers}</Badge>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
         Service Completed
        </CardContent>
      </Card>

	 {/* Two wheelers */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Motorbike size={20} /> Two Wheelers
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">{stats.twoWheelers}</Badge>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
         Service Completed
        </CardContent>
      </Card>

    </div>
  );
}
