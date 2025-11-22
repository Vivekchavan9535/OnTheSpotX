import { useState, useContext, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import UserContext from "../context/userContext";
import { useParams } from "react-router-dom";

export default function ServiceRequest() {
    const { user, loading } = useContext(UserContext);
    const { serviceId } = useParams();

    const [formData, setFormData] = useState({
        userId: null,
        serviceId: serviceId,
        issueDescription: "",
        vehicleType: "two-wheeler",
        userLocation: {
            latitude: "",
            longitude: "",
            address: "",
        },
        distance: 0,
        estimatedTime: 0,
        totalCost: 0,
    });

    useEffect(() => {
        if (user && !loading) {
            setFormData(prev => ({
                ...prev,
                userId: user._id,
            }));
        }
    }, [user, loading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["latitude", "longitude", "address"].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                userLocation: { ...prev.userLocation, [name]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const fetchGeoAddress = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        // Add options for mobile reliability (high accuracy, timeout)
        // Add error callback for permission denial/timeout
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );

                    if (!res.ok) {
                        throw new Error(`Reverse geocoding failed with status: ${res.status}`);
                    }

                    const data = await res.json();
                    
                    setFormData((prev) => ({
                        ...prev,
                        userLocation: {
                            // Ensure coords are stored as strings if they need to match initial state
                            latitude: String(latitude),
                            longitude: String(longitude),
                            address: data.display_name || "Address could not be determined",
                        },
                    }));
                } catch (err) {
                    console.error("Reverse geocoding failed", err);
                    alert("Failed to find address from coordinates.");
                }
            },
            (error) => {
                console.error("Geolocation Error:", error);
                let message = "Could not get your location. Please check settings.";
                if (error.code === error.PERMISSION_DENIED) {
                    message = "Permission denied. Allow location access in your browser settings.";
                } else if (error.code === error.TIMEOUT) {
                    message = "Location request timed out. Please try again.";
                }
                alert(message);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.issueDescription) {
            alert("Issue description is required!");
            return;
        }
        console.log("Service Request Submitted:", formData);
        // dispatch or API call here
    };


    return (
        loading ? <p>Loading</p> : (
            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">Service Request Form</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>User ID</Label>
                        <Input name="userId" value={formData.userId || ''} readOnly />
                    </div>

                    <div>
                        <Label>Service ID</Label>
                        <Input name="serviceId" value={formData.serviceId} readOnly />
                    </div>

                    <div>
                        <Label htmlFor="issueDescription">Issue Description</Label>
                        <Textarea
                            id="issueDescription"
                            name="issueDescription"
                            value={formData.issueDescription}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <select
                            id="vehicleType"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                        >
                            <option value="two-wheeler">Two-Wheeler</option>
                            <option value="four-wheeler">Four-Wheeler</option>
                        </select>
                    </div>

                    <div>
                        <Label>Location</Label>
                        <Button
                            type="button"
                            variant="outline"
                            className="mb-2 w-full" // Added w-full for better mobile layout
                            onClick={fetchGeoAddress}
                        >
                            Use Current Location
                        </Button>
                        <Textarea
                            name="address"
                            value={formData.userLocation.address}
                            onChange={handleChange}
                            placeholder="Address (Manually enter or use location button)"
                            required
                        />
                        {/* Hidden Inputs for Latitude/Longitude */}
                        <Input type="hidden" name="latitude" value={formData.userLocation.latitude} />
                        <Input type="hidden" name="longitude" value={formData.userLocation.longitude} />
                    </div>

                    <div>
                        <Label htmlFor="distance">Distance (km)</Label>
                        <Input
                            id="distance"
                            type="number"
                            name="distance"
                            value={formData.distance}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                        <Input
                            id="estimatedTime"
                            type="number"
                            name="estimatedTime"
                            value={formData.estimatedTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="totalCost">Total Cost (₹)</Label>
                        <Input
                            id="totalCost"
                            type="number"
                            name="totalCost"
                            value={formData.totalCost}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                        Submit Request
                    </Button>
                </form>
            </div>
        )
    );
}