import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, Wrench, UserCheck } from "lucide-react";

export default function AdminDashboardStats() {
  const { data } = useSelector((state) => state.users);

  const stats = useMemo(() => {
    let mechanics = 0;
    let customers = 0;
    let admins = 0;

    data.forEach((u) => {
      if (u.role === "mechanic") mechanics++;
      if (u.role === "customer") customers++;
      if (u.role === "admin") admins++;
    });

    return { total: data.length, mechanics, customers, admins };
  }, [data]);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Users */}
      <Card className="min-w-0">
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2 min-w-0 truncate">
            <Users size={20} className="shrink-0" />
            <span className="truncate">Total Users</span>
          </CardTitle>
          <Badge className="shrink-0">{stats.total}</Badge>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm break-words">
          All registered users
        </CardContent>
      </Card>

      {/* Mechanics */}
      <Card className="min-w-0">
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2 min-w-0 truncate">
            <Wrench size={20} className="shrink-0" />
            <span className="truncate">Mechanics</span>
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800 shrink-0">
            {stats.mechanics}
          </Badge>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm break-words">
          Total mechanics in system
        </CardContent>
      </Card>

      {/* Customers */}
      <Card className="min-w-0">
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2 min-w-0 truncate">
            <UserCheck size={20} className="shrink-0" />
            <span className="truncate">Customers</span>
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 shrink-0">
            {stats.customers}
          </Badge>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm break-words">
          Registered customers
        </CardContent>
      </Card>

    </div>
  );
}
