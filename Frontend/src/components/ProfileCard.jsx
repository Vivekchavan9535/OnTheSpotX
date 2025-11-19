import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

/* Mini icon wrapper */
const Icon = ({ children, size = 16 }) => (
  <span style={{ width: size, height: size }} className="inline-flex items-center justify-center mr-1">
    {children}
  </span>
);

const StarIcon = () => (
  <Icon>
    <svg width="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .6l3.7 7.4L23.5 9.7l-5.5 5.4L19.3 24 12 20.2 4.7 24l1.3-8.9L.5 9.7l7.8-1.7z" />
    </svg>
  </Icon>
);

const PhoneIcon = () => (
  <Icon>
    <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.9 19.9 0 0 1 11 18a19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1.2.4 2.4.9 3.5a2 2 0 0 1-.5 2.1l-1.6 1.7a16 16 0 0 0 6 6l1.7-1.7a2 2 0 0 1 2.1-.4c1.1.5 2.3.8 3.5.9A2 2 0 0 1 22 16.9z" />
    </svg>
  </Icon>
);

export default function ProfileCard({ user, mechanic }) {
  const name =
    mechanic?.fullName ||
    user?.fullName ||
    mechanic?.name ||
    user?.name ||
    "Unknown";

  const email = mechanic?.email || user?.email || "—";
  const phone = mechanic?.phone || user?.phone || "—";
  const avatar = user?.avatar || mechanic?.avatar || "";
  const initial = name.charAt(0).toUpperCase();

  /** Mechanic-specific */
  const isMechanic = Boolean(mechanic);

  const location =
    mechanic?.location?.address ||
    (mechanic?.location
      ? `${mechanic.location.latitude}, ${mechanic.location.longitude}`
      : null);

  const experience = mechanic?.experience ?? null;
  const rating = mechanic?.rating ?? null;
  const reviews = mechanic?.reviews ?? 0;
  const services = mechanic?.services ?? [];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="shadow-lg">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-6">
          <Avatar className="w-24 h-24">
            {avatar && <AvatarImage src={avatar} />}
            <AvatarFallback className="text-5xl">{initial}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-semibold">{name}</h3>

            {/* Sub text */}
            <p className="text-sm text-muted-foreground mt-2">
              {isMechanic ? "Mechanic" : "Registered User"}
            </p>

            {/* Mechanic badges */}
            {isMechanic && (
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                {services.slice(0, 3).map((s, i) => (
                  <Badge key={i}>{s}</Badge>
                ))}
              </div>
            )}

            {/* Rating (mechanic only) */}
            {isMechanic && (
              <div className="mt-3 flex justify-center sm:justify-start items-center gap-2">
                <StarIcon />
                <span className="font-medium">{rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({reviews} reviews)
                </span>
              </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button size="sm" className="flex gap-2">
                <PhoneIcon /> Call
              </Button>

              <Button variant="outline" size="sm">
                Message
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Details Section */}
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Email */}
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{email}</p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium">{phone}</p>
            </div>

            {/* Experience (mechanic only) */}
            {isMechanic ? (
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-medium">{experience} years</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium">User</p>
              </div>
            )}
          </div>

          {/* Mechanic-only extra details */}
          {isMechanic && (
            <>
              {/* Location */}
              <div>
                <h4 className="text-sm font-semibold">Location</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {location || "Not set"}
                </p>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-sm font-semibold">Services Offered</h4>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {services.length ? (
                    services.map((s, i) => <li key={i}>{s}</li>)
                  ) : (
                    <li>No services listed</li>
                  )}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
