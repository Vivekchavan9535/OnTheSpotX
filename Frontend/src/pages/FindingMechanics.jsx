// src/components/FindingMechanicsMinimal.jsx
import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Loader2, X } from "lucide-react";

export default function FindingMechanicsMinimal({
  onCancel,
  onFinish,
  initialSeconds = 300,
}) {
//   const STORAGE_KEY = "requestId";
//   const TIME_KEY = "requestStartTime";

  const [requestId, setRequestId] = useState(() => localStorage.getItem('requestId'));
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  const intervalRef = useRef(null);

  //Setup on mount (restore timer)
  useEffect(() => {
    const id = localStorage.getItem('requestId');
    const startTime = Number(localStorage.getItem("requestStartTime"));

    if (!id) {
      setRequestId(null);
      return;
    }

    setRequestId(id);

    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = initialSeconds - elapsed;
      setSecondsLeft(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        handleFinish(id);
        return;
      }
    }

    startTimer();

    return () => stopTimer();
  }, []);

  // Start countdown timer
  const startTimer = () => {
    stopTimer();

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          handleFinish(requestId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop timer safely
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // When timer ends
  const handleFinish = (id) => {
    localStorage.removeItem('requestId');
    localStorage.removeItem('requestStartTime');
    setRequestId(null);

    if (typeof onFinish === "function") onFinish(id);
  };

  //Cancel button
  const handleCancel = () => {
    stopTimer();
    localStorage.removeItem("requestId");
    localStorage.removeItem("requestStartTime");
    setRequestId(null);
    if (typeof onCancel === "function") onCancel(requestId);
  };

  const percent = Math.max(0, Math.round((secondsLeft / initialSeconds) * 100));

  // If no requestId found
  if (!requestId) {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>No Active Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">You have no ongoing service requests.</p>
            <Button onClick={() => window.location.href = "/services"}>Back to Services</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Waiting UI
  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Finding Mechanics
            </div>
            <span className="text-xs text-muted-foreground">Req: {requestId}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm">Searching for a mechanic nearby…</p>

          <Progress value={percent} className="h-2" />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </span>
            <span>{percent}%</span>
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={handleCancel} className="flex items-center gap-1">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
