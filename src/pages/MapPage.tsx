import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockRequests, categoryLabels, categoryIcons, statusLabels } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

// Fix default marker icons in leaflet + bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Simulated coords for mock data (São Paulo area)
const mockCoords: Record<string, [number, number]> = {
  "1": [-23.5536, -46.6581], // Rua Augusta - Consolação
  "2": [-23.5613, -46.6560], // Av. Paulista - Bela Vista
  "3": [-23.5647, -46.6728], // Rua Oscar Freire - Pinheiros
  "4": [-23.5600, -46.6650], // Rua Haddock Lobo - Cerqueira César
};

const CENTER: [number, number] = [-23.5587, -46.6620];

export default function MapPage() {
  useEffect(() => {
    // Force leaflet to recalculate sizes after mount
    window.dispatchEvent(new Event("resize"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col pb-16">
      {/* Header */}
      <div className="z-10 bg-background/80 px-5 pt-5 pb-3 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-foreground">Mapa de Ocorrências</h1>
        <p className="text-xs text-muted-foreground">
          {mockRequests.length} ocorrências registradas na cidade
        </p>
      </div>

      {/* Map */}
      <div className="flex-1" style={{ minHeight: "calc(100vh - 120px)" }}>
        <MapContainer
          center={CENTER}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
          style={{ height: "100%", minHeight: "calc(100vh - 120px)" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockRequests.map((req) => {
            const pos = mockCoords[req.id];
            if (!pos) return null;
            return (
              <Marker key={req.id} position={pos}>
                <Popup>
                  <div className="min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryIcons[req.category]}</span>
                      <span className="font-semibold text-sm">{categoryLabels[req.category]}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">{req.description}</p>
                    <p className="mt-1 text-xs text-gray-500">{req.address}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400">{req.protocol}</span>
                      <span
                        className={`text-[10px] font-semibold ${
                          req.status === "resolved"
                            ? "text-green-600"
                            : req.status === "progress"
                            ? "text-blue-600"
                            : "text-orange-500"
                        }`}
                      >
                        {statusLabels[req.status]}
                      </span>
                    </div>
                    <Link
                      to={`/requests/${req.id}`}
                      className="mt-2 block text-center text-xs font-medium text-blue-600 hover:underline"
                    >
                      Ver detalhes →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
