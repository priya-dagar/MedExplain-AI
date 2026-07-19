import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../services/api";

// Local Leaflet image imports are unreliable with Vite's asset handling —
// pointing directly at CDN-hosted marker icons avoids broken/missing images.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Facility {
  name: string;
  facility_type: "hospital" | "clinic" | "diagnostic_lab";
  latitude: number;
  longitude: number;
  distance_km: number;
  address: string | null;
  phone: string | null;
  opening_hours: string | null;
}

type FilterKey = "all" | "hospital" | "clinic" | "diagnostic_lab";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hospital", label: "Hospital" },
  { key: "clinic", label: "Clinic" },
  { key: "diagnostic_lab", label: "Diagnostic Lab" },
];

function typeLabel(t: Facility["facility_type"]) {
  if (t === "hospital") return "Hospital";
  if (t === "diagnostic_lab") return "Diagnostic Lab";
  return "Clinic";
}

// Recenters the map whenever the user's location changes.
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function FindHealthcare() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const useMyLocation = () => {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Geolocation isn't supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocError("Couldn't get your location. Please allow location access."),
    );
  };

  useEffect(() => {
    useMyLocation();
  }, []);

  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    api
      .get("/api/healthcare/nearby", {
        params: {
          lat: coords.lat,
          lng: coords.lng,
          facility_type: activeFilter === "all" ? undefined : activeFilter,
        },
      })
      .then((res) => setFacilities(res.data.results))
      .finally(() => setLoading(false));
  }, [coords, activeFilter]);

  const filtered = useMemo(
    () => facilities.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
    [facilities, search],
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <h1 className="font-serif text-3xl font-bold text-[#1a2e2e] mb-1">Find Healthcare</h1>
        <p className="text-sm text-[#8a8a80] mb-5">
          Hospitals, clinics, and diagnostic labs near you
        </p>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <i className="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a80]" aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospitals, clinics, doctors…"
              className="w-full bg-white border border-[#e5e2d8] rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
          <button
            onClick={useMyLocation}
            className="flex items-center gap-1.5 text-sm font-medium bg-[#1a4d4a] text-white rounded-full px-5 py-2.5 hover:bg-[#153f3c] transition-colors"
          >
            <i className="ti ti-navigation text-base" aria-hidden="true" />
            Use My Location
          </button>
        </div>

        {locError && <p className="text-sm text-red-600 mb-3">{locError}</p>}

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                activeFilter === f.key
                  ? "bg-[#1a4d4a] text-white"
                  : "border border-[#d8d5cb] text-[#4a4a44] hover:bg-[#f1efe6]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase mb-2">
          Map view
        </p>
        <div className="rounded-xl overflow-hidden border border-[#e5e2d8] mb-6" style={{ height: 320 }}>
          {coords ? (
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap lat={coords.lat} lng={coords.lng} />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>You are here</Popup>
              </Marker>
              {filtered.map((f) => (
                <Marker key={`${f.name}-${f.latitude}-${f.longitude}`} position={[f.latitude, f.longitude]}>
                  <Popup>
                    <strong>{f.name}</strong>
                    <br />
                    {f.distance_km} km away
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-[#8a8a80]">
              Waiting for location…
            </div>
          )}
        </div>

        <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase mb-3">
          Nearby healthcare facilities · {filtered.length} found
        </p>

        {loading && <p className="text-sm text-[#8a8a80]">Searching…</p>}

        <div className="space-y-3">
          {filtered.map((f) => (
            <button
              key={`${f.name}-${f.latitude}-${f.longitude}`}
              onClick={() => setSelected(f)}
              className={`w-full text-left bg-white rounded-xl p-4 border transition-colors ${
                selected?.name === f.name ? "border-teal-600" : "border-transparent hover:border-[#e5e2d8]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#d9f0ea] flex items-center justify-center flex-shrink-0">
                    <i className="ti ti-building-hospital text-teal-700" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a2e2e]">{f.name}</p>
                    <div className="flex items-center gap-2 text-sm text-[#6b6b63] mt-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#efece3] text-xs">
                        {typeLabel(f.facility_type)}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ti ti-map-pin text-xs" aria-hidden="true" />
                        {f.distance_km} km
                      </span>
                    </div>
                  </div>
                </div>
                <i className="ti ti-chevron-right text-[#8a8a80]" aria-hidden="true" />
              </div>
            </button>
          ))}

          {!loading && filtered.length === 0 && coords && (
            <p className="text-sm text-[#8a8a80] text-center py-8">
              No facilities found nearby. Try a different filter or area.
            </p>
          )}
        </div>
      </div>

      {selected && (
        <div className="w-[340px] border-l border-[#e5e2d8] bg-[#f9f8f4] overflow-y-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase">
              Facility detail
            </p>
            <button onClick={() => setSelected(null)} aria-label="Close">
              <i className="ti ti-x text-[#8a8a80]" aria-hidden="true" />
            </button>
          </div>

          <h2 className="font-serif text-xl font-bold text-[#1a2e2e] mb-2">{selected.name}</h2>
          <div className="flex gap-2 mb-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#d9f0ea] text-teal-800">
              {typeLabel(selected.facility_type)}
            </span>
          </div>

          <div className="space-y-4">
            {selected.address && (
              <div>
                <p className="text-xs text-[#8a8a80] flex items-center gap-1.5">
                  <i className="ti ti-map-pin" aria-hidden="true" />
                  Address
                </p>
                <p className="text-sm text-[#1a2e2e] mt-0.5">{selected.address}</p>
              </div>
            )}
            {selected.phone && (
              <div>
                <p className="text-xs text-[#8a8a80] flex items-center gap-1.5">
                  <i className="ti ti-phone" aria-hidden="true" />
                  Phone
                </p>
                <p className="text-sm text-[#1a2e2e] mt-0.5">{selected.phone}</p>
              </div>
            )}
            {selected.opening_hours && (
              <div>
                <p className="text-xs text-[#8a8a80] flex items-center gap-1.5">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Hours
                </p>
                <p className="text-sm text-[#1a2e2e] mt-0.5">{selected.opening_hours}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-[#8a8a80] flex items-center gap-1.5">
                <i className="ti ti-map-pin" aria-hidden="true" />
                Distance
              </p>
              <p className="text-sm text-[#1a2e2e] mt-0.5">{selected.distance_km} km</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1a4d4a] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-[#153f3c] transition-colors"
            >
              <i className="ti ti-navigation text-base" aria-hidden="true" />
              Get Directions
            </a>
            {selected.phone && (
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center justify-center gap-2 border border-[#d8d5cb] rounded-lg px-4 py-2.5 text-sm font-medium text-[#4a4a44] hover:bg-[#f1efe6] transition-colors"
              >
                <i className="ti ti-phone text-base" aria-hidden="true" />
                Call {selected.phone}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}