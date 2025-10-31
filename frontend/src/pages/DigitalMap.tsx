import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import api from "../config/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

// Fix for missing marker icons in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { Experience } from "../types";

// Setup default icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function DigitalMap() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await api.get("/experiences/featured");
        if (data.success) {
          setExperiences(data.experiences);
        } else {
          toast.error("Failed to load experiences.");
        }
      } catch (error: unknown) {
        let message = "Something went wrong while fetching experiences.";
        if (isAxiosError(error) && error.response?.data.message) {
          message = error.response?.data.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[28.3949, 84.124]} // Center of Nepal
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Map over experiences and render markers */}
        {experiences.map((exp) =>
          exp.coordinates && exp.coordinates.lat && exp.coordinates.lng ? (
            <Marker
              key={exp._id}
              position={[exp.coordinates.lat, exp.coordinates.lng]}
            >
              <Popup minWidth={200}>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">{exp.name}</h3>
                  <p className="text-sm text-gray-600">{exp.location}</p>
                  <button
                    onClick={() => navigate(`/experience/${exp._id}`)}
                    className="mt-2 w-full px-3 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition"
                  >
                    Explore Experience
                  </button>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
