import React, { useMemo, useContext } from "react";
import { useSelector } from "react-redux";

import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { CheckCircle, XCircle, Clock, Truck, Box } from "lucide-react";
import SearchContext from "../context/searchContext";

export default function ServiceBookingStats({ onFilter }) {
  const { data = [], loading = false } = useSelector(
    (state) => state.serviceRequests
  );

 
  const { setSearch } = useContext(SearchContext);

  const countStatus = (requests) => {
    const result = {
      waiting: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0,
      other: 0,
      total: 0,
    };

    for (let req of requests) {
      const status = (req?.status || "other").toLowerCase();

      if (status === "waiting") result.waiting++;
      else if (status === "accepted") result.accepted++;
      else if (status === "completed") result.completed++;
      else if (status === "cancelled" || status === "canceled") result.cancelled++;
      else result.other++;

      result.total++;
    }

    return result;
  };


  const counts = useMemo(() => countStatus(data), [data]);


  const cards = [
    {
      key: "waiting",
      title: "Waiting",
      subtitle: "Requests awaiting mechanic",
      icon: Clock,
      count: counts.waiting,
      colorClass: "bg-yellow-100 text-yellow-800",
    },
    {
      key: "accepted",
      title: "Accepted",
      subtitle: "Currently assigned to mechanic",
      icon: Truck,
      count: counts.accepted,
      colorClass: "bg-blue-100 text-blue-800",
    },
    {
      key: "completed",
      title: "Completed",
      subtitle: "Successfully finished services",
      icon: CheckCircle,
      count: counts.completed,
      colorClass: "bg-green-100 text-green-800",
    },
    {
      key: "cancelled",
      title: "Cancelled",
      subtitle: "Cancelled or declined requests",
      icon: XCircle,
      count: counts.cancelled,
      colorClass: "bg-red-100 text-red-800",
    },
    {
      key: "other",
      title: "Other",
      subtitle: "Unclassified statuses",
      icon: Box,
      count: counts.other,
      colorClass: "bg-slate-100 text-slate-800",
    },
  ];

  // ✅ click handler
  const handleClick = (statusKey) => {
    if (setSearch) setSearch("");       // clear search
    if (onFilter) onFilter(statusKey);  // filter table
  };

  // ✅ Loading skeleton
  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="min-w-0 p-4">
            <Skeleton height={18} width="60%" />
            <div className="mt-3">
              <Skeleton height={36} width={80} />
            </div>
            <Skeleton height={12} width="90%" className="mt-3" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.key}
            onClick={() => handleClick(card.key)}
            className="min-w-0 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.colorClass}`}>
                  <Icon size={18} />
                </div>

                <div>
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {card.subtitle}
                  </div>
                </div>
              </div>

              <Badge className="text-base">{card.count}</Badge>
            </CardHeader>

            <CardContent className="pt-2 text-sm text-muted-foreground">
              <div>Total: {counts.total}</div>

              <div className="mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ prevent card click double
                    handleClick(card.key);
                  }}
                >
                  View {card.title}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
