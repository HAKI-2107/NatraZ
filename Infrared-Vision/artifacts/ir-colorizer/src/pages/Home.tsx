import { useState, useEffect, useRef, useCallback } from "react";
import {
  Satellite, Search, Moon, Sun, Info, Map as MapIcon, Activity, Camera,
  Maximize, SlidersHorizontal, Layers, Target, SplitSquareHorizontal,
  Crosshair, Navigation, MapPin, X, Loader2, Sparkles, ChevronDown, ChevronRight,
  ChevronLeft, CalendarDays, Globe, Radio,
  AlertTriangle, CheckCircle2, CircleDashed, Wand2, RotateCcw,
  Upload, Download, ImagePlus, Trash2, Settings2, RefreshCw, Phone,
  Send, ShieldCheck, WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";

// ── Constants ──────────────────────────────────────────────────────────────────

const MODES = [
  { id: "rgb",      label: "Natural Color",     icon: Camera,    desc: "Standard RGB composite",                   filter: { grayscale: 0,   contrast: 1.0, brightness: 1.0,  saturate: 1.0, hueRotate: 0,   invert: 0, sepia: 0 } },
  { id: "ir_gray",  label: "IR Grayscale",      icon: MapIcon,   desc: "Raw infrared sensor output",               filter: { grayscale: 100, contrast: 1.4, brightness: 0.85, saturate: 1.0, hueRotate: 0,   invert: 0, sepia: 0 } },
  { id: "fc_veg",   label: "False Color (Veg)", icon: Layers,    desc: "NIR-R-G composite for vegetation mapping", filter: { grayscale: 0,   contrast: 1.3, brightness: 1.0,  saturate: 2.0, hueRotate: 120, invert: 0, sepia: 0 } },
  { id: "swir",     label: "SWIR Composite",    icon: Maximize,  desc: "Short-wave infrared",                      filter: { grayscale: 0,   contrast: 1.5, brightness: 1.1,  saturate: 1.8, hueRotate: 200, invert: 0, sepia: 0 } },
  { id: "thermal",  label: "Thermal IR",        icon: Target,    desc: "Simulated thermal signature",              filter: { grayscale: 100, contrast: 1.6, brightness: 1.0,  saturate: 3.0, hueRotate: 50,  invert: 1, sepia: 1 } },
  { id: "ai_color", label: "AI-Enhanced",       icon: Activity,  desc: "ML-based colorization — click Analyze Scene for AI object identification", filter: { grayscale: 0, contrast: 1.2, brightness: 1.05, saturate: 1.8, hueRotate: 0, invert: 0, sepia: 0 } },
];

const PALETTES = [
  { id: "none",    label: "None",    offset: 0   },
  { id: "viridis", label: "Viridis", offset: 45  },
  { id: "inferno", label: "Inferno", offset: -20 },
  { id: "plasma",  label: "Plasma",  offset: -45 },
  { id: "magma",   label: "Magma",   offset: -80 },
  { id: "jet",     label: "Jet",     offset: 180 },
];

// ── NASA GIBS Live Satellite layers ────────────────────────────────────────────

const GIBS_LAYERS = [
  { id: "modis_terra_true", label: "Terra · True Color",  satellite: "Terra (MODIS)",    layer: "MODIS_Terra_CorrectedReflectance_TrueColor",   maxZoom: 9, ext: "jpg" },
  { id: "modis_aqua_true",  label: "Aqua · True Color",   satellite: "Aqua (MODIS)",     layer: "MODIS_Aqua_CorrectedReflectance_TrueColor",    maxZoom: 9, ext: "jpg" },
  { id: "modis_terra_fc",   label: "Terra · False Color", satellite: "Terra (MODIS)",    layer: "MODIS_Terra_CorrectedReflectance_Bands721",    maxZoom: 9, ext: "jpg" },
  { id: "viirs_true",       label: "VIIRS · True Color",  satellite: "Suomi-NPP (VIIRS)",layer: "VIIRS_SNPP_CorrectedReflectance_TrueColor",    maxZoom: 8, ext: "jpg" },
  { id: "viirs_day_night",  label: "VIIRS · Day/Night",   satellite: "Suomi-NPP (VIIRS)",layer: "VIIRS_Black_Marble",                           maxZoom: 8, ext: "jpg" },
];

const MAP_PROVIDERS = [
  { id: "esri", label: "Esri", description: "World Imagery" },
  { id: "osm", label: "OpenStreetMap", description: "Street map" },
  { id: "google", label: "Google Maps", description: "Requires a configured key" },
] as const;

const GOOGLE_LAYERS = [
  { id: "roadmap", label: "Roadmap" },
  { id: "satellite", label: "Satellite" },
  { id: "hybrid", label: "Hybrid" },
] as const;

const gibsUrl = (layer: typeof GIBS_LAYERS[0], date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer.layer}/default/${y}-${m}-${d}/GoogleMapsCompatible_Level${layer.maxZoom}/{z}/{y}/{x}.${layer.ext}`;
};

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

const fmtDateShort = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d; };

const CATEGORY_COLORS: Record<string, string> = {
  vehicle:        "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  building:       "bg-blue-500/20 text-blue-300 border-blue-500/40",
  road:           "bg-gray-500/20 text-gray-300 border-gray-500/40",
  water:          "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  vegetation:     "bg-green-500/20 text-green-300 border-green-500/40",
  infrastructure: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  terrain:        "bg-amber-500/20 text-amber-300 border-amber-500/40",
  unknown:        "bg-purple-500/20 text-purple-300 border-purple-500/40",
};

const generateHistogram = () =>
  Array.from({ length: 20 }, (_, i) => ({ name: i, value: Math.floor(Math.random() * 100) }));

const fmt = (v: number, d = 5) => v.toFixed(d);

// ── Types ──────────────────────────────────────────────────────────────────────

interface DetectedObject {
  label: string;
  category: string;
  count: number | null;
  confidence: "high" | "medium" | "low";
  notes: string;
}

interface LandCover {
  type: string;
  estimatedPercent: number;
  notes: string;
}

interface SceneAnalysis {
  summary: string;
  confidence: "high" | "medium" | "low";
  objects: DetectedObject[];
  landCover: LandCover[];
  spectralNotes: string;
  recommendations: string;
  terrainClassification?: { type: string; confidence: number };
  urbanDensity?: { classification: "low" | "medium" | "high"; confidence: number };
  infrastructure?: Array<{ type: string; description: string; confidence: number }>;
  waterBodies?: Array<{ type: string; description: string; confidence: number }>;
  vegetation?: { classification: string; confidence: number };
  thermalAnomalies?: Array<{ description: string; severity: "low" | "medium" | "high"; confidence: number }>;
  detectedTags?: string[];
  limitations?: string[];
  metadata?: {
    center: { lat: number; lng: number };
    zoom: number;
    band: string;
    composite: string;
    mapProvider: string;
    viewport: { width?: number; height?: number } | null;
    analyzedAt: string;
    source: string;
  };
}

interface IntegrationStatus {
  provider: string;
  connected: boolean;
  configured: boolean;
  status: "connected" | "configured" | "not_configured" | "error";
  reason?: string;
}

interface Diagnostics {
  railway: IntegrationStatus;
  cloudflare: IntegrationStatus;
  openai: IntegrationStatus;
  googleMaps: IntegrationStatus;
  agentPhone: IntegrationStatus;
  timestamp: string;
}

interface AgentPhoneVerification {
  connected: boolean;
  authenticated: boolean;
  configured: boolean;
  provider: string;
  phoneNumbers: Array<{ number: string }>;
  reason?: string;
  timestamp: string;
}

// ── Map sub-components ─────────────────────────────────────────────────────────

function FilterApplier({ filterString, paneClass = ".leaflet-tile-pane" }: { filterString: string; paneClass?: string }) {
  const map = useMap();
  useEffect(() => {
    const pane = map.getContainer().querySelector(paneClass) as HTMLElement | null;
    if (pane) pane.style.filter = filterString;
  }, [map, filterString, paneClass]);
  return null;
}

function CoordTracker({
  onCenter,
  onCursor,
}: {
  onCenter: (lat: number, lng: number, zoom: number) => void;
  onCursor: (lat: number | null, lng: number | null) => void;
}) {
  const map = useMapEvents({
    move() { const c = map.getCenter(); onCenter(c.lat, c.lng, map.getZoom()); },
    zoom() { const c = map.getCenter(); onCenter(c.lat, c.lng, map.getZoom()); },
    mousemove(e) { onCursor(e.latlng.lat, e.latlng.lng); },
    mouseout() { onCursor(null, null); },
  });
  useEffect(() => { const c = map.getCenter(); onCenter(c.lat, c.lng, map.getZoom()); }, []);
  return null;
}

function FlyTo({ target }: { target: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap();
  const prev = useRef<typeof target>(null);
  useEffect(() => {
    if (!target) return;
    if (prev.current?.lat === target.lat && prev.current?.lng === target.lng) return;
    prev.current = target;
    map.flyTo([target.lat, target.lng], target.zoom ?? map.getZoom(), { duration: 1.4 });
  }, [target, map]);
  return null;
}

function BlendOverlayLayer({ filterString, opacity }: { filterString: string; opacity: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map.getPane("blendPane")) {
      const pane = map.createPane("blendPane");
      pane.style.zIndex = "350";
    }
  }, [map]);
  useEffect(() => {
    const pane = map.getPane("blendPane");
    if (pane) {
      pane.style.opacity = String(opacity);
      pane.style.filter = filterString;
    }
  }, [map, opacity, filterString]);
  return (
    <TileLayer
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      pane="blendPane"
    />
  );
}

// ── Geocoding ──────────────────────────────────────────────────────────────────

interface NominatimResult { lat: string; lon: string; display_name: string; }

async function geocode(query: string): Promise<NominatimResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error("Geocoding failed");
  return res.json() as Promise<NominatimResult[]>;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error("Reverse geocoding failed");
  const data = await res.json() as { display_name?: string };
  return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

interface IdentifiedObject {
  label: string;
  category: string;
  bbox: [number, number, number, number];
  confidence: "high" | "medium" | "low";
  notes: string;
}

const BBOX_STYLE: Record<string, { border: string; bg: string; chip: string }> = {
  water:          { border: "#22d3ee", bg: "rgba(34,211,238,0.14)",  chip: "bg-cyan-500" },
  vegetation:     { border: "#4ade80", bg: "rgba(74,222,128,0.14)",  chip: "bg-green-500" },
  vehicle:        { border: "#fbbf24", bg: "rgba(251,191,36,0.14)",  chip: "bg-amber-400 text-black" },
  building:       { border: "#60a5fa", bg: "rgba(96,165,250,0.14)",  chip: "bg-blue-500" },
  road:           { border: "#a1a1aa", bg: "rgba(161,161,170,0.14)", chip: "bg-zinc-500" },
  terrain:        { border: "#fb923c", bg: "rgba(251,146,60,0.14)",  chip: "bg-orange-400 text-black" },
  infrastructure: { border: "#f97316", bg: "rgba(249,115,22,0.14)",  chip: "bg-orange-500" },
  unknown:        { border: "#a78bfa", bg: "rgba(167,139,250,0.14)", chip: "bg-purple-500" },
};

// ── BBox Highlights overlay ────────────────────────────────────────────────────

function BBoxHighlights({ objects, imgW, imgH }: { objects: IdentifiedObject[]; imgW: number; imgH: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cSize, setCSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setCSize({ w: r.width, h: r.height });
    });
    obs.observe(el);
    setCSize({ w: el.clientWidth, h: el.clientHeight });
    return () => obs.disconnect();
  }, []);

  const computeBox = (bbox: [number, number, number, number]) => {
    if (!cSize.w || !cSize.h || !imgW || !imgH) return null;
    const cAspect = cSize.w / cSize.h;
    const iAspect = imgW / imgH;
    let rW: number, rH: number, oX: number, oY: number;
    if (iAspect > cAspect) {
      rW = cSize.w; rH = cSize.w / iAspect; oX = 0; oY = (cSize.h - rH) / 2;
    } else {
      rH = cSize.h; rW = cSize.h * iAspect; oX = (cSize.w - rW) / 2; oY = 0;
    }
    const [bx, by, bw, bh] = bbox;
    return {
      left: ((oX + bx * rW) / cSize.w) * 100,
      top: ((oY + by * rH) / cSize.h) * 100,
      width: (bw * rW / cSize.w) * 100,
      height: (bh * rH / cSize.h) * 100,
    };
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20">
      {objects.map((obj, i) => {
        const box = computeBox(obj.bbox);
        if (!box) return null;
        const style = BBOX_STYLE[obj.category] ?? BBOX_STYLE.unknown;
        return (
          <div key={i} className="absolute" style={{ left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%` }}>
            <div className="w-full h-full rounded-sm" style={{ border: `2px solid ${style.border}`, backgroundColor: style.bg }}>
              <div
                className={`absolute -top-5 left-0 whitespace-nowrap text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-white leading-none ${style.chip}`}
                style={{ borderLeft: `3px solid ${style.border}` }}
              >
                {obj.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Confidence badge ───────────────────────────────────────────────────────────

function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  if (level === "high") return <span className="flex items-center gap-0.5 text-green-400 text-[10px]"><CheckCircle2 className="h-3 w-3" />High</span>;
  if (level === "medium") return <span className="flex items-center gap-0.5 text-yellow-400 text-[10px]"><CircleDashed className="h-3 w-3" />Medium</span>;
  return <span className="flex items-center gap-0.5 text-red-400 text-[10px]"><AlertTriangle className="h-3 w-3" />Low</span>;
}

function Score({ value }: { value: number }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return <span className={`font-mono text-[10px] ${percent >= 75 ? "text-green-400" : percent >= 45 ? "text-yellow-400" : "text-red-400"}`}>{percent}%</span>;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Home() {
  const { toast } = useToast();
  const [theme, setTheme] = useState("dark");
  const [mode, setMode] = useState(MODES[1]);
  const [palette, setPalette] = useState(PALETTES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancements, setEnhancements] = useState({ contrast: 1.0, brightness: 1.0, saturation: 1.0 });

  const [objects, setObjects] = useState({ vehicles: 47, buildings: 312, roads: 8.4, vegetation: 34, water: 6 });
  const [detecting, setDetecting] = useState(false);
  const [histogram, setHistogram] = useState(generateHistogram());
  const [compareMode, setCompareMode] = useState(false);
  const [splitPos, setSplitPos] = useState(50);

  // Coordinate state
  const [mapCenter, setMapCenter] = useState({ lat: 17.36213, lng: 78.77866, zoom: 10 });
  const [cursor, setCursor] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [mapProvider, setMapProvider] = useState<"esri" | "osm" | "google">("esri");
  const [googleLayer, setGoogleLayer] = useState<"roadmap" | "satellite" | "hybrid">("roadmap");
  const mapViewportRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Geolocation
  const [geoLoading, setGeoLoading] = useState(false);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  // Tab
  const [activeTab, setActiveTab] = useState<"map" | "enhance">("map");

  // Upload & Enhance state
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [enhanceMode, setEnhanceMode] = useState(MODES[5]);
  const [enhanceEnhance, setEnhanceEnhance] = useState({ contrast: 1.0, brightness: 1.0, saturation: 1.0 });
  const [enhancePalette, setEnhancePalette] = useState(PALETTES[0]);
  const uploadImgRef = useRef<HTMLImageElement>(null);
  const uploadCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Object identification state
  const [identifyLoading, setIdentifyLoading] = useState(false);
  const [identifiedObjects, setIdentifiedObjects] = useState<IdentifiedObject[]>([]);
  const [sceneDesc, setSceneDesc] = useState<string>("");
  const [showHighlights, setShowHighlights] = useState(true);
  const [identifyError, setIdentifyError] = useState<string | null>(null);

  // Live satellite (NASA GIBS) state
  const [liveMode, setLiveMode] = useState(false);
  const [liveDate, setLiveDate] = useState<Date>(yesterday);
  const [liveLayer, setLiveLayer] = useState(GIBS_LAYERS[0]);
  const stepDate = (days: number) => {
    setLiveDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      const today = new Date(); today.setHours(23, 59, 59, 999);
      return d > today ? prev : d;
    });
  };

  // Blend state (IR → AI-Enhanced overlay)
  const [blendActive, setBlendActive] = useState(false);
  const [blendValue, setBlendValue] = useState(0);

  // AI Analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [sceneAnalysis, setSceneAnalysis] = useState<SceneAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(true);
  const [objectsOpen, setObjectsOpen] = useState(true);
  const [landCoverOpen, setLandCoverOpen] = useState(false);

  // Optional integration status and manual alert testing
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [agentPhoneOpen, setAgentPhoneOpen] = useState(false);
  const [agentPhoneVerification, setAgentPhoneVerification] = useState<AgentPhoneVerification | null>(null);
  const [agentPhoneLoading, setAgentPhoneLoading] = useState(false);
  const [agentPhoneSending, setAgentPhoneSending] = useState(false);
  const [agentPhoneResult, setAgentPhoneResult] = useState<string | null>(null);
  const [agentPhoneError, setAgentPhoneError] = useState<string | null>(null);
  const [alertPhoneNumber, setAlertPhoneNumber] = useState("");
  const [alertMessage, setAlertMessage] = useState("IrisMap test alert: review the selected scene.");
  const [alertChannel, setAlertChannel] = useState<"sms" | "voice">("sms");

  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);
  useEffect(() => { setHistogram(generateHistogram()); }, [mode]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleModeChange = (newModeId: string) => {
    const newMode = MODES.find((m) => m.id === newModeId) || MODES[1];
    setIsProcessing(true);
    setTimeout(() => { setMode(newMode); setIsProcessing(false); }, 800);
  };

  const handleRunDetection = () => {
    setDetecting(true);
    setTimeout(() => {
      setObjects({
        vehicles: Math.floor(47 * (0.9 + Math.random() * 0.2)),
        buildings: Math.floor(312 * (0.9 + Math.random() * 0.2)),
        roads: Number((8.4 * (0.9 + Math.random() * 0.2)).toFixed(1)),
        vegetation: Math.floor(34 * (0.9 + Math.random() * 0.2)),
        water: Math.floor(6 * (0.9 + Math.random() * 0.2)),
      });
      setDetecting(false);
    }, 1500);
  };

  const computeEnhanceFilter = useCallback((applyPalette = true) => {
    const { filter } = enhanceMode;
    const cont = filter.contrast * enhanceEnhance.contrast;
    const bright = filter.brightness * enhanceEnhance.brightness;
    const sat = filter.saturate * enhanceEnhance.saturation;
    const hue = filter.hueRotate + (applyPalette ? enhancePalette.offset : 0);
    let str = "";
    if (filter.grayscale) str += `grayscale(${filter.grayscale}%) `;
    if (filter.invert) str += `invert(${filter.invert}) `;
    if (filter.sepia) str += `sepia(${filter.sepia}) `;
    str += `hue-rotate(${hue}deg) saturate(${sat}) contrast(${cont}) brightness(${bright})`;
    return str.trim();
  }, [enhanceMode, enhanceEnhance, enhancePalette]);

  const renderEnhancedCanvas = useCallback(() => {
    const img = uploadImgRef.current;
    const canvas = uploadCanvasRef.current;
    if (!img || !canvas || !img.complete || img.naturalWidth === 0) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = computeEnhanceFilter();
    ctx.drawImage(img, 0, 0);
  }, [computeEnhanceFilter]);

  useEffect(() => { renderEnhancedCanvas(); }, [renderEnhancedCanvas]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Not an image", description: "Please upload a JPEG, PNG, TIFF or WEBP file.", variant: "destructive" });
      return;
    }
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    const url = URL.createObjectURL(file);
    setUploadedUrl(url);
    setUploadedName(file.name);
    setUploadedFile(file);
    setIdentifiedObjects([]);
    setSceneDesc("");
    setIdentifyError(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDownloadEnhanced = () => {
    const canvas = uploadCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = uploadedName.replace(/\.[^.]+$/, "") + `_${enhanceMode.id}_enhanced.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const clearUpload = () => {
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    setUploadedUrl(null);
    setUploadedName("");
    setUploadedFile(null);
    setIdentifiedObjects([]);
    setSceneDesc("");
    setIdentifyError(null);
    setImgNaturalSize({ w: 0, h: 0 });
  };

  const handleIdentifyObjects = async () => {
    if (!uploadedFile) return;
    setIdentifyLoading(true);
    setIdentifyError(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(uploadedFile);
      });
      const res = await fetch("/api/identify-objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: uploadedFile.type }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? `Server error ${res.status}`);
      }
      const data = await res.json() as { objects?: IdentifiedObject[]; sceneDescription?: string };
      setIdentifiedObjects(data.objects ?? []);
      setSceneDesc(data.sceneDescription ?? "");
      setShowHighlights(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Identification failed";
      setIdentifyError(msg);
      toast({ title: "Identification failed", description: msg, variant: "destructive" });
    } finally {
      setIdentifyLoading(false);
    }
  };

  const computeFilter = (baseMode: typeof MODES[0], applyPalette = true) => {
    const { filter } = baseMode;
    const cont = filter.contrast * enhancements.contrast;
    const bright = filter.brightness * enhancements.brightness;
    const sat = filter.saturate * enhancements.saturation;
    const hue = filter.hueRotate + (applyPalette ? palette.offset : 0);
    let str = "";
    if (filter.grayscale) str += `grayscale(${filter.grayscale}%) `;
    if (filter.invert) str += `invert(${filter.invert}) `;
    if (filter.sepia) str += `sepia(${filter.sepia}) `;
    str += `hue-rotate(${hue}deg) saturate(${sat}) contrast(${cont}) brightness(${bright})`;
    return str.trim();
  };

  // ── AI Scene Analysis ──────────────────────────────────────────────────────
  const handleAnalyzeScene = async () => {
    setAnalyzing(true);
    setSceneAnalysis(null);
    setAnalysisError(null);
    try {
      const viewportImage = await captureMapViewport();
      const res = await fetch("/api/analyze-scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: viewportImage,
          center: { lat: mapCenter.lat, lng: mapCenter.lng },
          zoom: mapCenter.zoom,
          band: mode.id,
          composite: mode.label,
          filterDescription: mode.desc,
          mapProvider: liveMode ? `nasa-gibs:${liveLayer.id}` : mapProvider,
          viewport: mapViewportRef.current
            ? { width: mapViewportRef.current.clientWidth, height: mapViewportRef.current.clientHeight }
            : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: { message?: string } | string };
        const message = typeof err.error === "string" ? err.error : err.error?.message;
        throw new Error(message ?? `Server error ${res.status}`);
      }
      const data = await res.json() as { result: SceneAnalysis };
      setSceneAnalysis(data.result);
      setAnalysisOpen(true);
      setObjectsOpen(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI analysis failed. Try again or use another scene.";
      setAnalysisError(msg);
      toast({ title: "AI Analysis failed", description: msg, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Search handlers ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setShowResults(true);
    try {
      const coordMatch = searchQuery.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        setFlyTarget({ lat, lng, zoom: 14 });
        setShowResults(false);
        setLocationLabel(`${fmt(lat, 4)}, ${fmt(lng, 4)}`);
        toast({ title: "Navigating to coordinates", description: `${fmt(lat, 4)}°N, ${fmt(lng, 4)}°E` });
      } else {
        const results = await geocode(searchQuery);
        setSearchResults(results);
        if (results.length === 0) toast({ title: "No results found", variant: "destructive" });
      }
    } catch {
      toast({ title: "Geocoding failed", variant: "destructive" });
    } finally {
      setSearchLoading(false);
    }
  };

  const selectResult = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setFlyTarget({ lat, lng, zoom: 14 });
    setLocationLabel(result.display_name.split(",").slice(0, 2).join(", "));
    setShowResults(false);
    setSearchQuery(result.display_name.split(",").slice(0, 2).join(", "));
  };

  const handleGeolocate = () => {
    if (!("geolocation" in navigator)) {
      toast({ title: "Geolocation unavailable", variant: "destructive" });
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setFlyTarget({ lat, lng, zoom: 14 });
        try {
          const label = await reverseGeocode(lat, lng);
          setLocationLabel(label.split(",").slice(0, 2).join(", "));
          toast({ title: "Located", description: label.split(",").slice(0, 2).join(", ") });
        } catch {
          setLocationLabel(`${fmt(lat, 4)}, ${fmt(lng, 4)}`);
        }
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        toast({ title: err.code === 1 ? "Location access denied" : "Could not determine location", variant: "destructive" });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const copyCoords = () => {
    const text = `${fmt(mapCenter.lat, 6)}, ${fmt(mapCenter.lng, 6)}`;
    navigator.clipboard.writeText(text).then(() => toast({ title: "Copied", description: text }));
  };

  const handleProviderChange = (provider: "esri" | "osm" | "google") => {
    setMapProvider(provider);
    if (provider === "google") {
      const googleStatus = diagnostics?.googleMaps;
      if (googleStatus && !googleStatus.configured) {
        toast({
          title: "Google Maps unavailable",
          description: "Add GOOGLE_MAPS_API_KEY to enable this provider. Esri and OpenStreetMap remain available.",
          variant: "destructive",
        });
      }
    }
  };

  const captureMapViewport = async (): Promise<string | undefined> => {
    const element = mapViewportRef.current;
    if (!element) return undefined;
    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#05070c",
        logging: false,
        ignoreElements: (node) =>
          node.classList.contains("leaflet-control") ||
          node.classList.contains("leaflet-control-container") ||
          node.getAttribute("data-iris-ui") === "true",
      });
      return canvas.toDataURL("image/jpeg", 0.82);
    } catch {
      return undefined;
    }
  };

  const fetchDiagnostics = async () => {
    setDiagnosticsLoading(true);
    try {
      const res = await fetch("/api/mcp/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`Diagnostics unavailable (${res.status})`);
      const data = await res.json() as Diagnostics;
      setDiagnostics(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Diagnostics unavailable";
      toast({ title: "Diagnostics unavailable", description: message, variant: "destructive" });
      return null;
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  const openDiagnostics = async () => {
    setDiagnosticsOpen(true);
    if (!diagnostics) await fetchDiagnostics();
  };

  const verifyAgentPhone = async () => {
    setAgentPhoneLoading(true);
    setAgentPhoneError(null);
    try {
      const res = await fetch("/api/agentphone/verify", { cache: "no-store" });
      const data = await res.json() as AgentPhoneVerification;
      if (!res.ok) throw new Error("AgentPhone verification failed");
      setAgentPhoneVerification(data);
    } catch (err) {
      setAgentPhoneError(err instanceof Error ? err.message : "AgentPhone verification failed");
    } finally {
      setAgentPhoneLoading(false);
    }
  };

  const openAgentPhone = async () => {
    setAgentPhoneOpen(true);
    setAgentPhoneResult(null);
    await verifyAgentPhone();
  };

  const sendAgentPhoneAlert = async () => {
    if (!window.confirm("Send this test alert to the entered number?")) return;
    setAgentPhoneSending(true);
    setAgentPhoneResult(null);
    setAgentPhoneError(null);
    try {
      const res = await fetch("/api/agentphone/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: alertPhoneNumber,
          message: alertMessage,
          channel: alertChannel,
        }),
      });
      const data = await res.json() as { result?: { timestamp?: string; providerStatus?: string }; error?: { message?: string } };
      if (!res.ok) throw new Error(data.error?.message ?? "Alert dispatch failed");
      setAgentPhoneResult(`Dispatch accepted at ${data.result?.timestamp ?? new Date().toISOString()}.`);
    } catch (err) {
      setAgentPhoneError(err instanceof Error ? err.message : "Alert dispatch failed");
    } finally {
      setAgentPhoneSending(false);
    }
  };

  const handleSplitDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startPos = splitPos;
    const mapEl = (e.currentTarget as HTMLElement).closest("main") as HTMLElement;
    const mapWidth = mapEl?.offsetWidth ?? window.innerWidth;
    const onMove = (ev: MouseEvent) => {
      const delta = ((ev.clientX - startX) / mapWidth) * 100;
      setSplitPos(Math.min(Math.max(startPos + delta, 5), 95));
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* ── Top Bar ── */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-50 relative shadow-sm">
        <div className="flex items-center space-x-3 shrink-0">
          <Satellite className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-primary">IrisMap</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">PROTO-v0.9</span>
        </div>

        <div className="flex-1 max-w-lg mx-4" ref={searchRef}>
          <div className="relative">
            {searchLoading
              ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
              : <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            }
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location or paste lat, lng…"
              className="pl-9 pr-8 bg-background/50 border-border font-mono text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); if (e.key === "Escape") setShowResults(false); }}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
            />
            {searchQuery && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => { setSearchQuery(""); setSearchResults([]); setShowResults(false); }}>
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-[9999] max-h-60 overflow-y-auto">
                {searchResults.map((r, i) => (
                  <button key={i} className="w-full text-left px-3 py-2.5 text-sm hover:bg-secondary border-b border-border/50 last:border-0 flex items-start gap-2" onClick={() => selectResult(r)}>
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="font-mono text-xs leading-relaxed">{r.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Tab toggle */}
          <div className="flex items-center bg-background border border-border rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === "map" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <MapIcon className="h-3.5 w-3.5" /> Map
            </button>
            <button
              onClick={() => setActiveTab("enhance")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === "enhance" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ImagePlus className="h-3.5 w-3.5" /> Enhance
            </button>
          </div>

          {activeTab === "map" && (
            <>
              {/* Live Satellite toggle */}
              <button
                onClick={() => setLiveMode(!liveMode)}
                className={`flex items-center gap-1.5 px-3 h-9 rounded-lg border text-xs font-medium transition-all ${liveMode ? "bg-red-500/15 border-red-400/60 text-red-300 shadow-sm shadow-red-500/20" : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                <Radio className={`h-3.5 w-3.5 ${liveMode ? "text-red-400 animate-pulse" : ""}`} />
                {liveMode ? "LIVE" : "Live Sat"}
              </button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleGeolocate} disabled={geoLoading}>
                    {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Go to my location</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setCompareMode(!compareMode)} className={compareMode ? "bg-primary/20 text-primary" : ""}>
                    <SplitSquareHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Split comparison</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={openDiagnostics}>
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Integration diagnostics</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={openAgentPhone}>
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Test AgentPhone alert</TooltipContent>
              </Tooltip>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon"><Info className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About IrisMap</DialogTitle>
                <DialogDescription>
                  Interactive IR Satellite Image Colorization & Enhancement prototype. Switch to AI-Enhanced mode and click "Analyze Scene" to identify objects using GPT-4o Vision. Search any location or paste lat/lng to navigate.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden">

      {/* ══ Upload & Enhance Tab ══ */}
      {activeTab === "enhance" && (
        <div className="flex flex-1 overflow-hidden">
          {/* Controls sidebar */}
          <aside className="w-72 bg-card border-r border-border shrink-0 flex flex-col overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Colorization Mode</h2>
                <div className="grid grid-cols-2 gap-2">
                  {MODES.map((m) => {
                    const Icon = m.icon;
                    const isActive = enhanceMode.id === m.id;
                    return (
                      <button key={m.id} onClick={() => setEnhanceMode(m)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${isActive ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:bg-secondary"}`}>
                        <Icon className="h-4 w-4 mb-1.5" />
                        <span className="text-[11px] font-medium leading-tight">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 font-mono bg-background p-2 rounded border border-border">{enhanceMode.desc}</p>
              </div>

              <div className="space-y-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Adjustments</h2>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span>Contrast</span><span className="font-mono text-muted-foreground">{enhanceEnhance.contrast.toFixed(2)}×</span></div>
                  <Slider value={[enhanceEnhance.contrast]} min={0.5} max={2.5} step={0.05} onValueChange={(v) => setEnhanceEnhance(p => ({ ...p, contrast: v[0] }))} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span>Brightness</span><span className="font-mono text-muted-foreground">{enhanceEnhance.brightness.toFixed(2)}×</span></div>
                  <Slider value={[enhanceEnhance.brightness]} min={0.5} max={2.0} step={0.05} onValueChange={(v) => setEnhanceEnhance(p => ({ ...p, brightness: v[0] }))} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span>Saturation</span><span className="font-mono text-muted-foreground">{enhanceEnhance.saturation.toFixed(2)}×</span></div>
                  <Slider value={[enhanceEnhance.saturation]} min={0} max={3.0} step={0.05} onValueChange={(v) => setEnhanceEnhance(p => ({ ...p, saturation: v[0] }))} />
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 w-full" onClick={() => setEnhanceEnhance({ contrast: 1, brightness: 1, saturation: 1 })}>Reset Adjustments</Button>
              </div>

              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">LUT Palette</h2>
                <div className="flex flex-wrap gap-1.5">
                  {PALETTES.map((p) => (
                    <button key={p.id} onClick={() => setEnhancePalette(p)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${enhancePalette.id === p.id ? "bg-primary/20 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:bg-secondary"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {uploadedUrl && (
                <div className="space-y-2 pt-1">
                  <Button className="w-full gap-2" onClick={handleDownloadEnhanced}>
                    <Download className="h-4 w-4" /> Download Enhanced PNG
                  </Button>
                  {!identifiedObjects.length && (
                    <Button
                      variant="default"
                      className="w-full gap-2 bg-primary/80 hover:bg-primary"
                      onClick={handleIdentifyObjects}
                      disabled={identifyLoading}
                    >
                      {identifyLoading
                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning…</>
                        : <><Target className="h-4 w-4" /> Identify Objects</>}
                    </Button>
                  )}
                  <Button variant="outline" className="w-full gap-2 text-muted-foreground" onClick={clearUpload}>
                    <Trash2 className="h-3.5 w-3.5" /> Remove Image
                  </Button>
                </div>
              )}

              {/* Identified Objects Legend */}
              {identifiedObjects.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detected Objects</h2>
                    <button
                      onClick={() => setShowHighlights(!showHighlights)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${showHighlights ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground"}`}
                    >
                      {showHighlights ? "Highlights ON" : "Highlights OFF"}
                    </button>
                  </div>
                  {sceneDesc && (
                    <p className="text-[10px] text-muted-foreground bg-black/30 p-2 rounded border border-border leading-relaxed">{sceneDesc}</p>
                  )}
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
                    {identifiedObjects.map((obj, i) => {
                      const style = BBOX_STYLE[obj.category] ?? BBOX_STYLE.unknown;
                      return (
                        <div key={i} className="rounded-lg border p-2 text-xs space-y-0.5" style={{ borderColor: style.border, backgroundColor: style.bg }}>
                          <div className="flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: style.border }} />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground leading-tight">{obj.label}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`text-[9px] font-mono px-1.5 py-0 rounded text-white ${style.chip}`}>{obj.category}</span>
                                <span className={`text-[9px] font-mono ${obj.confidence === "high" ? "text-green-400" : obj.confidence === "medium" ? "text-yellow-400" : "text-orange-400"}`}>{obj.confidence}</span>
                              </div>
                              {obj.notes && <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{obj.notes}</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-6 text-[10px] gap-1 text-primary/70 hover:text-primary"
                    onClick={handleIdentifyObjects}
                    disabled={identifyLoading}
                  >
                    {identifyLoading ? <><Loader2 className="h-3 w-3 animate-spin" /> Rescanning…</> : <><RotateCcw className="h-3 w-3" /> Rescan</>}
                  </Button>
                </div>
              )}

              {identifyError && (
                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded p-2 flex gap-2 items-start">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{identifyError}</span>
                </div>
              )}
            </div>
          </aside>

          {/* Image area */}
          <main className="flex-1 bg-black overflow-auto flex flex-col">
            {!uploadedUrl ? (
              /* Drop zone */
              <div className="flex-1 flex items-center justify-center p-8">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all select-none ${isDragOver ? "border-primary bg-primary/10 scale-[1.02]" : "border-border bg-card/30 hover:border-primary/60 hover:bg-card/50"}`}
                >
                  <div className={`p-5 rounded-full transition-colors ${isDragOver ? "bg-primary/20" : "bg-primary/10"}`}>
                    <Upload className={`h-10 w-10 transition-colors ${isDragOver ? "text-primary" : "text-primary/60"}`} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-base font-semibold text-foreground">Drop an IR satellite image here</p>
                    <p className="text-sm text-muted-foreground">or click to browse — JPEG, PNG, TIFF, WEBP</p>
                  </div>
                  <span className="text-xs text-muted-foreground/60 font-mono">The image is processed entirely in your browser</span>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                </div>
              </div>
            ) : (
              /* Before / After view */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-black/60 backdrop-blur-sm flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground truncate max-w-[160px]">{uploadedName}</span>
                  <span className="text-primary/40 text-xs">·</span>
                  <span className="font-mono text-xs text-primary/70">{enhanceMode.label}</span>
                  <div className="flex-1" />
                  <Button
                    size="sm"
                    variant={identifyLoading ? "ghost" : "default"}
                    className="h-7 gap-1.5 text-xs bg-primary/90 hover:bg-primary"
                    onClick={handleIdentifyObjects}
                    disabled={identifyLoading}
                  >
                    {identifyLoading
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Scanning…</>
                      : <><Target className="h-3.5 w-3.5" /> Identify Objects</>}
                  </Button>
                  {identifiedObjects.length > 0 && (
                    <button
                      onClick={() => setShowHighlights(!showHighlights)}
                      className={`h-7 px-3 text-xs font-medium rounded border transition-colors ${showHighlights ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}
                    >
                      {showHighlights ? "Hide" : "Show"} Highlights
                    </button>
                  )}
                  <Button size="sm" className="h-7 gap-1.5 text-xs" variant="outline" onClick={handleDownloadEnhanced}>
                    <Download className="h-3.5 w-3.5" /> PNG
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs text-muted-foreground" onClick={clearUpload}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Scanning overlay */}
                {identifyLoading && (
                  <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 pointer-events-none">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping" />
                      <div className="absolute inset-2 border-2 border-primary/50 rounded-full animate-ping" style={{ animationDelay: "0.3s" }} />
                      <div className="absolute inset-4 border-2 border-primary rounded-full animate-ping" style={{ animationDelay: "0.6s" }} />
                      <Target className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                    </div>
                    <p className="font-mono text-sm text-primary tracking-widest uppercase animate-pulse">GPT-4o Scanning…</p>
                  </div>
                )}

                {/* Images */}
                <div className="flex-1 overflow-hidden grid grid-cols-2 gap-0 divide-x divide-white/10">
                  {/* Original with highlights */}
                  <div className="relative overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-white font-mono text-xs px-3 py-1 rounded-full border border-white/20">ORIGINAL</div>
                    <img
                      ref={uploadImgRef}
                      src={uploadedUrl ?? ""}
                      alt="Original"
                      onLoad={() => {
                        const img = uploadImgRef.current;
                        if (img) setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
                        renderEnhancedCanvas();
                      }}
                      className="w-full h-full object-contain bg-black"
                    />
                    {showHighlights && identifiedObjects.length > 0 && (
                      <BBoxHighlights objects={identifiedObjects} imgW={imgNaturalSize.w} imgH={imgNaturalSize.h} />
                    )}
                  </div>

                  {/* Enhanced with highlights */}
                  <div className="relative overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 bg-primary/80 backdrop-blur-sm text-white font-mono text-xs px-3 py-1 rounded-full border border-primary/60 flex items-center gap-1.5">
                      <Wand2 className="h-3 w-3" /> {enhanceMode.label.toUpperCase()}
                    </div>
                    {identifiedObjects.length > 0 && (
                      <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-primary font-mono text-xs px-2 py-1 rounded border border-primary/30">
                        {identifiedObjects.length} objects
                      </div>
                    )}
                    <canvas
                      ref={uploadCanvasRef}
                      className="w-full h-full object-contain bg-black"
                    />
                    {showHighlights && identifiedObjects.length > 0 && (
                      <BBoxHighlights objects={identifiedObjects} imgW={imgNaturalSize.w} imgH={imgNaturalSize.h} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

        {/* Map */}
        {activeTab === "map" && <main className="flex-1 relative border-r border-border ring-1 ring-primary/20 ring-inset overflow-hidden">
          {isProcessing && (
            <div className="absolute inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-primary font-mono text-lg tracking-widest uppercase">Processing Band Data…</p>
              </div>
            </div>
          )}

          <div ref={mapViewportRef} className="absolute inset-0 z-0 bg-black" data-iris-map-viewport="true">
            <MapContainer center={[17.36213, 78.77866]} zoom={10} style={{ height: "100%", width: "100%" }} zoomControl={false} attributionControl={false}>
              {liveMode ? (
                <TileLayer
                  key={`gibs-${liveLayer.id}-${fmtDateShort(liveDate)}`}
                  url={gibsUrl(liveLayer, liveDate)}
                  maxNativeZoom={liveLayer.maxZoom}
                  maxZoom={18}
                />
              ) : mapProvider === "osm" || mapProvider === "google" ? (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  subdomains={["a", "b", "c"]}
                  crossOrigin="anonymous"
                />
              ) : (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  crossOrigin="anonymous"
                />
              )}
              <FilterApplier filterString={blendActive ? computeFilter(MODES[1]) : computeFilter(mode)} />
              {blendActive && (
                <BlendOverlayLayer
                  filterString={computeFilter(MODES[5], true)}
                  opacity={blendValue / 100}
                />
              )}
              <CoordTracker onCenter={(lat, lng, zoom) => setMapCenter({ lat, lng, zoom })} onCursor={(lat, lng) => setCursor({ lat, lng })} />
              <FlyTo target={flyTarget} />
            </MapContainer>
            {mapProvider === "google" && !liveMode && (
              <div className="absolute inset-x-0 top-3 z-[500] flex justify-center pointer-events-none">
                <div className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-black/80 px-3 py-1.5 text-[10px] font-mono text-amber-200 shadow-lg backdrop-blur-sm">
                  <WifiOff className="h-3.5 w-3.5" />
                  Google {googleLayer} unavailable — showing OpenStreetMap fallback
                </div>
              </div>
            )}
          </div>

          {/* Blend mode HUD badge */}
          {blendActive && (
            <div className="absolute top-3 left-3 z-[500] pointer-events-none flex items-center gap-2">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-primary/40 rounded-full px-3 py-1.5">
                <Wand2 className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-[11px] text-primary/80">IR</span>
                <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-white/40 to-primary rounded-full transition-all" style={{ width: `${blendValue}%` }} />
                </div>
                <span className="font-mono text-[11px] text-primary">AI {blendValue}%</span>
              </div>
            </div>
          )}

          {compareMode && (
            <>
              <div className="absolute inset-0 z-10 pointer-events-none" style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}>
                <MapContainer center={[17.36213, 78.77866]} zoom={10} style={{ height: "100%", width: "100%" }} zoomControl={false} attributionControl={false}>
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  <FilterApplier filterString={computeFilter(MODES[1], false)} />
                  <FlyTo target={flyTarget} />
                </MapContainer>
                <div className="absolute top-4 left-4 z-[999] bg-black/60 text-white px-3 py-1 font-mono text-sm border border-white/20 rounded">RAW IR (GRAYSCALE)</div>
              </div>
              <div className="absolute top-4 right-4 z-[999] bg-primary/20 text-primary px-3 py-1 font-mono text-sm border border-primary/40 rounded backdrop-blur-sm pointer-events-none">{mode.label.toUpperCase()}</div>
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize z-20 flex items-center justify-center hover:bg-primary/80 transition-colors"
                style={{ left: `${splitPos}%`, transform: "translateX(-50%)" }}
                onMouseDown={handleSplitDrag}
              >
                <div className="h-16 w-4 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-black/50 border border-primary-foreground/20">
                  <div className="w-0.5 h-8 bg-black/50" />
                </div>
              </div>
            </>
          )}

          {/* Live Satellite Date Navigation Bar */}
          {liveMode && (
            <div className="absolute bottom-8 left-0 right-0 z-[501] flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1 bg-black/85 backdrop-blur-md border border-red-400/40 rounded-2xl px-3 py-2 shadow-2xl shadow-black/60">
                {/* Sat badge */}
                <div className="flex items-center gap-1.5 pr-3 border-r border-white/10">
                  <Radio className="h-3 w-3 text-red-400 animate-pulse shrink-0" />
                  <span className="font-mono text-[10px] text-red-300 whitespace-nowrap">{liveLayer.satellite}</span>
                </div>
                {/* Previous day */}
                <button onClick={() => stepDate(-1)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {/* Date display + native date picker */}
                <div className="relative">
                  <input
                    type="date"
                    value={fmtDateShort(liveDate)}
                    max={fmtDateShort(new Date())}
                    min="2002-01-01"
                    onChange={(e) => { if (e.target.value) setLiveDate(new Date(e.target.value + "T12:00:00")); }}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
                    <CalendarDays className="h-3.5 w-3.5 text-red-300 shrink-0" />
                    <span className="font-mono text-xs text-white whitespace-nowrap">{fmtDate(liveDate)}</span>
                  </div>
                </div>
                {/* Next day */}
                <button onClick={() => stepDate(1)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors" disabled={fmtDateShort(liveDate) >= fmtDateShort(new Date())}>
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Today button */}
                <button onClick={() => setLiveDate(yesterday())} className="ml-1 h-7 px-2.5 text-[10px] font-mono font-medium rounded-lg bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/30 transition-colors whitespace-nowrap">
                  Latest
                </button>
                {/* Step size buttons */}
                <div className="flex items-center gap-0.5 ml-2 pl-2 border-l border-white/10">
                  {[-7, -30].map((d) => (
                    <button key={d} onClick={() => stepDate(d)} className="h-7 px-2 text-[10px] font-mono text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">{d}d</button>
                  ))}
                  {[7, 30].map((d) => (
                    <button key={d} onClick={() => stepDate(d)} className="h-7 px-2 text-[10px] font-mono text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">+{d}d</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Coordinate HUD */}
          <div className="absolute bottom-0 left-0 right-0 z-[500] flex items-stretch pointer-events-none">
            <button className="pointer-events-auto flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white border-t border-r border-white/10 px-3 py-1.5 font-mono text-xs hover:bg-black/80 transition-colors" onClick={copyCoords} title="Click to copy">
              <Crosshair className="h-3 w-3 text-primary shrink-0" />
              <span className="text-primary/80">CTR</span>
              <span>{fmt(mapCenter.lat, 5)}°</span>
              <span className="text-muted-foreground">,</span>
              <span>{fmt(mapCenter.lng, 5)}°</span>
              <span className="text-muted-foreground ml-1">Z{mapCenter.zoom}</span>
            </button>
            <div className="pointer-events-none flex items-center gap-2 bg-black/55 backdrop-blur-sm text-white border-t border-r border-white/10 px-3 py-1.5 font-mono text-xs">
              <span className="text-muted-foreground">CUR</span>
              {cursor.lat !== null && cursor.lng !== null
                ? <><span>{fmt(cursor.lat, 5)}°</span><span className="text-muted-foreground">,</span><span>{fmt(cursor.lng, 5)}°</span></>
                : <span className="text-muted-foreground">—</span>
              }
            </div>
            {locationLabel && (
              <div className="pointer-events-none flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white border-t border-r border-white/10 px-3 py-1.5 font-mono text-xs max-w-xs truncate">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate text-primary/80">{locationLabel}</span>
              </div>
            )}
            <div className="flex-1 bg-black/30 border-t border-white/10" />
            <div className="pointer-events-none flex items-center bg-black/55 backdrop-blur-sm text-white border-t border-white/10 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
              {liveMode ? <>NASA GIBS · {liveLayer.satellite} · Geocoding © OpenStreetMap</> : <>Tiles © Esri · Geocoding © OpenStreetMap</>}
            </div>
          </div>
        </main>}

        {activeTab === "map" && <aside className="w-96 bg-card shrink-0 flex flex-col h-full overflow-y-auto overflow-x-hidden border-l border-border z-10">
          <div className="p-4 space-y-5">

            {/* Coordinates */}
            <section className="bg-background rounded-lg p-3 border border-border">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <Crosshair className="h-3 w-3" /> Coordinates
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase block mb-0.5">Latitude</label>
                  <div className="font-mono text-sm bg-card border border-border rounded px-2 py-1 text-foreground select-all cursor-text">{fmt(mapCenter.lat, 6)}°</div>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase block mb-0.5">Longitude</label>
                  <div className="font-mono text-sm bg-card border border-border rounded px-2 py-1 text-foreground select-all cursor-text">{fmt(mapCenter.lng, 6)}°</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={copyCoords}>Copy Coords</Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={handleGeolocate} disabled={geoLoading}>
                  {geoLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Navigation className="h-3 w-3 mr-1" />}
                  My Location
                </Button>
              </div>
            </section>

            {/* Live Satellite Section */}
            {liveMode && (
              <section className="rounded-lg border border-red-400/40 overflow-hidden bg-red-500/5">
                <div className="px-3 py-2.5 border-b border-red-400/20 bg-red-500/10 flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-red-300">
                    <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Satellite Feed
                  </h2>
                  <span className="text-[9px] font-mono text-red-400/70">NASA GIBS</span>
                </div>
                <div className="p-3 space-y-3">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Daily global imagery from NASA's Earth Observing System. Click the date bar on the map to navigate day-by-day or jump to any date since 2002.
                  </p>

                  {/* Current date display */}
                  <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-red-400/20">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-red-300" />
                      <span className="font-mono text-xs text-white">{fmtDate(liveDate)}</span>
                    </div>
                    <div className="flex gap-0.5">
                      <button onClick={() => stepDate(-1)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/10 text-white/70 transition-colors">
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => stepDate(1)} disabled={fmtDateShort(liveDate) >= fmtDateShort(new Date())} className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/10 text-white/70 transition-colors disabled:opacity-30">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Layer selector */}
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Satellite / Layer</p>
                    <div className="space-y-1">
                      {GIBS_LAYERS.map((gl) => (
                        <button
                          key={gl.id}
                          onClick={() => setLiveLayer(gl)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${liveLayer.id === gl.id ? "bg-red-500/20 border border-red-400/50 text-red-200" : "bg-black/20 border border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                        >
                          <span className="font-medium">{gl.label}</span>
                          <span className="text-[9px] font-mono opacity-60">{gl.satellite.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick date jumps */}
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Jump to event</p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: "Today−1", date: yesterday() },
                        { label: "1 wk ago", date: new Date(Date.now() - 7 * 86400000) },
                        { label: "1 mo ago", date: new Date(Date.now() - 30 * 86400000) },
                        { label: "1 yr ago", date: new Date(Date.now() - 365 * 86400000) },
                      ].map(({ label, date }) => (
                        <button key={label} onClick={() => setLiveDate(date)} className="text-[10px] font-mono px-2 py-1 rounded bg-black/30 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors">{label}</button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[9px] text-muted-foreground/50 leading-relaxed">
                    Imagery: NASA/GSFC, MODIS Rapid Response. Zoom is limited to the native tile resolution — use band modes to enhance.
                  </p>
                </div>
              </section>
            )}

            {/* Map Provider */}
            <section className="rounded-lg border border-border overflow-hidden bg-background">
              <div className="px-3 py-2.5 border-b border-border bg-card/50 flex items-center justify-between">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary" /> Map Provider
                </h2>
                <span className="text-[9px] font-mono text-primary/70 uppercase">
                  {liveMode ? "nasa gibs" : mapProvider}
                </span>
              </div>
              <div className="p-3 space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {MAP_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderChange(provider.id)}
                      className={`rounded-lg border px-2 py-2 text-[10px] transition-colors ${mapProvider === provider.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                    >
                      <span className="block font-semibold">{provider.label}</span>
                      <span className="mt-0.5 block truncate opacity-70">{provider.description}</span>
                    </button>
                  ))}
                </div>
                {mapProvider === "google" && (
                  <div className="flex items-center gap-1.5 rounded border border-amber-400/30 bg-amber-500/5 px-2 py-1.5 text-[10px] text-amber-200">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    Google Maps is optional. Diagnostics shows whether its key is configured; the safe OSM fallback stays active.
                  </div>
                )}
                {mapProvider === "google" && (
                  <div>
                    <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Google layer</p>
                    <div className="grid grid-cols-3 gap-1">
                      {GOOGLE_LAYERS.map((layer) => (
                        <button
                          key={layer.id}
                          onClick={() => setGoogleLayer(layer.id)}
                          className={`rounded border px-1.5 py-1 text-[10px] ${googleLayer === layer.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                        >
                          {layer.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Band Mode */}
            <section>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Band / Composite Mode</h2>
              <div className="grid grid-cols-2 gap-2">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const isActive = mode.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleModeChange(m.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-200 ${isActive ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:bg-secondary hover:border-muted-foreground/50"}`}
                    >
                      <Icon className="h-5 w-5 mb-2" />
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono bg-background p-2 rounded border border-border">{mode.desc}</p>
            </section>

            {/* Quick Actions */}
            <section className="flex gap-2">
              <Button variant={mode.id === "ir_gray" ? "default" : "outline"} className="flex-1 text-xs" onClick={() => handleModeChange("ir_gray")}>Raw IR</Button>
              <Button variant={mode.id === "ai_color" ? "default" : "outline"} className="flex-1 text-xs" onClick={() => handleModeChange("ai_color")}>AI-Enhanced</Button>
            </section>

            {/* ── IR → AI Enhance Blend ── */}
            <section className="rounded-lg border border-border overflow-hidden bg-background">
              <div className="px-3 py-2.5 border-b border-border bg-card/50 flex items-center justify-between">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Wand2 className="h-3.5 w-3.5 text-primary" /> Enhance Blend
                </h2>
                <div className="flex items-center gap-2">
                  {blendActive && (
                    <button
                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
                      onClick={() => setBlendValue(0)}
                      title="Reset to IR"
                    >
                      <RotateCcw className="h-2.5 w-2.5" /> Reset
                    </button>
                  )}
                  <button
                    onClick={() => { setBlendActive(!blendActive); if (!blendActive) setBlendValue(0); }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${blendActive ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${blendActive ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-3">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {blendActive
                    ? "Drag to blend IR Grayscale into AI-Enhanced colorization in real time."
                    : "Enable to blend between raw IR Grayscale and AI-Enhanced colorization."}
                </p>

                {blendActive && (
                  <>
                    {/* Labels */}
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                      <span className="flex items-center gap-1"><MapIcon className="h-2.5 w-2.5" /> IR Grayscale</span>
                      <span className="font-semibold text-primary">{blendValue}%</span>
                      <span className="flex items-center gap-1"><Activity className="h-2.5 w-2.5" /> AI-Enhanced</span>
                    </div>

                    {/* Gradient track behind slider */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                        <div className="w-full h-2 rounded-full bg-gradient-to-r from-white/20 via-primary/30 to-primary/80" />
                      </div>
                      <Slider
                        value={[blendValue]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(v) => setBlendValue(v[0])}
                        className="relative z-10"
                      />
                    </div>

                    {/* Preset buttons */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0, 25, 50, 75, 100].map((v) => (
                        <button
                          key={v}
                          onClick={() => setBlendValue(v)}
                          className={`text-[10px] font-mono py-1 rounded border transition-colors ${blendValue === v ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                        >
                          {v === 0 ? "IR" : v === 100 ? "AI" : `${v}%`}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ── AI Scene Analysis ── */}
            <section className="rounded-lg border border-primary/30 overflow-hidden bg-background">
              <div className="px-3 py-2.5 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
                <h2 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> AI Scene Analysis
                </h2>
                <Button
                  size="sm"
                  variant={analyzing ? "ghost" : "default"}
                  className="h-7 text-[11px] px-3 gap-1.5"
                  onClick={handleAnalyzeScene}
                  disabled={analyzing}
                >
                  {analyzing ? <><Loader2 className="h-3 w-3 animate-spin" /> Analyzing…</> : <><Sparkles className="h-3 w-3" /> Analyze Scene</>}
                </Button>
              </div>

              {/* Idle state */}
              {!analyzing && !sceneAnalysis && !analysisError && (
                <div className="p-4 text-center">
                  <Sparkles className="h-8 w-8 text-primary/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    GPT-4o Vision will analyze the current map view to identify objects, land cover types, and scene characteristics.
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5">Pan to any location, then click Analyze Scene</p>
                </div>
              )}

              {/* Loading skeleton */}
              {analyzing && (
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-primary/10 rounded animate-pulse w-full" />
                  <div className="h-3 bg-primary/10 rounded animate-pulse w-4/5" />
                  <div className="h-3 bg-primary/10 rounded animate-pulse w-3/5" />
                  <div className="mt-3 text-xs text-muted-foreground text-center font-mono animate-pulse">
                    Sending tile to GPT-4o Vision…
                  </div>
                </div>
              )}

              {/* Error */}
              {analysisError && !analyzing && (
                <div className="p-3 flex items-start gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-xs">{analysisError}</p>
                </div>
              )}

              {/* Results */}
              {sceneAnalysis && !analyzing && (
                <div className="divide-y divide-border/50">
                  {/* Summary */}
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Scene Summary</span>
                      <ConfidenceBadge level={sceneAnalysis.confidence} />
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{sceneAnalysis.summary}</p>
                  </div>

                   {/* Structured assessment */}
                   <div className="p-3 space-y-2">
                     <div className="grid grid-cols-2 gap-2">
                       <div className="rounded border border-border/60 bg-card/50 p-2">
                         <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Terrain</p>
                         <p className="mt-0.5 truncate text-xs">{sceneAnalysis.terrainClassification?.type ?? "—"}</p>
                         <Score value={sceneAnalysis.terrainClassification?.confidence ?? 0} />
                       </div>
                       <div className="rounded border border-border/60 bg-card/50 p-2">
                         <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Urban density</p>
                         <p className="mt-0.5 text-xs capitalize">{sceneAnalysis.urbanDensity?.classification ?? "—"}</p>
                         <Score value={sceneAnalysis.urbanDensity?.confidence ?? 0} />
                       </div>
                       <div className="rounded border border-border/60 bg-card/50 p-2">
                         <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Vegetation</p>
                         <p className="mt-0.5 truncate text-xs">{sceneAnalysis.vegetation?.classification ?? "—"}</p>
                         <Score value={sceneAnalysis.vegetation?.confidence ?? 0} />
                       </div>
                       <div className="rounded border border-border/60 bg-card/50 p-2">
                         <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Thermal anomalies</p>
                         <p className="mt-0.5 text-xs">{sceneAnalysis.thermalAnomalies?.length ?? 0} regions</p>
                         <span className="text-[10px] text-muted-foreground">Band: {sceneAnalysis.metadata?.band ?? mode.id}</span>
                       </div>
                     </div>
                     {sceneAnalysis.metadata && (
                       <div className="rounded border border-primary/20 bg-primary/5 p-2 text-[10px] text-muted-foreground">
                         <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono">
                           <span>{sceneAnalysis.metadata.center.lat.toFixed(4)}, {sceneAnalysis.metadata.center.lng.toFixed(4)}</span>
                           <span>Z{sceneAnalysis.metadata.zoom}</span>
                           <span>{sceneAnalysis.metadata.mapProvider}</span>
                           <span>{sceneAnalysis.metadata.source === "viewport" ? "viewport capture" : "tile fallback"}</span>
                         </div>
                       </div>
                     )}
                     {sceneAnalysis.detectedTags && sceneAnalysis.detectedTags.length > 0 && (
                       <div className="flex flex-wrap gap-1">
                         {sceneAnalysis.detectedTags.map((tag) => (
                           <span key={tag} className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{tag}</span>
                         ))}
                       </div>
                     )}
                   </div>

                   {sceneAnalysis.thermalAnomalies && sceneAnalysis.thermalAnomalies.length > 0 && (
                     <div className="p-3 space-y-1.5 bg-amber-500/5">
                       <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">Thermal anomalies</span>
                       {sceneAnalysis.thermalAnomalies.map((item, i) => (
                         <div key={i} className="flex items-start justify-between gap-2 text-xs">
                           <span className="text-muted-foreground">{item.description}</span>
                           <span className="shrink-0 capitalize text-amber-300">{item.severity} · {Math.round(item.confidence * 100)}%</span>
                         </div>
                       ))}
                     </div>
                   )}

                  {/* Detected Objects */}
                  <div>
                    <button
                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                      onClick={() => setObjectsOpen(!objectsOpen)}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Detected Objects ({sceneAnalysis.objects?.length ?? 0})
                      </span>
                      {objectsOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                    </button>
                    {objectsOpen && sceneAnalysis.objects && (
                      <div className="px-3 pb-3 space-y-2">
                        {sceneAnalysis.objects.map((obj, i) => (
                          <div key={i} className="rounded border border-border/60 bg-card/50 p-2 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                <span className="text-xs font-medium text-foreground truncate">{obj.label}</span>
                                {obj.count !== null && obj.count !== undefined && (
                                  <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">×{obj.count}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wide ${CATEGORY_COLORS[obj.category] ?? CATEGORY_COLORS.unknown}`}>
                                  {obj.category}
                                </span>
                                <ConfidenceBadge level={obj.confidence} />
                              </div>
                            </div>
                            {obj.notes && <p className="text-[10px] text-muted-foreground leading-relaxed">{obj.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Land Cover */}
                  {sceneAnalysis.landCover && sceneAnalysis.landCover.length > 0 && (
                    <div>
                      <button
                        className="w-full px-3 py-2 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                        onClick={() => setLandCoverOpen(!landCoverOpen)}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Land Cover</span>
                        {landCoverOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                      </button>
                      {landCoverOpen && (
                        <div className="px-3 pb-3 space-y-2">
                          {sceneAnalysis.landCover.map((lc, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{lc.type}</span>
                                <span className="font-mono text-muted-foreground">{lc.estimatedPercent}%</span>
                              </div>
                              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary/70 rounded-full" style={{ width: `${Math.min(lc.estimatedPercent, 100)}%` }} />
                              </div>
                              {lc.notes && <p className="text-[10px] text-muted-foreground">{lc.notes}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Spectral Notes */}
                  {sceneAnalysis.spectralNotes && (
                    <div className="p-3 space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Spectral Notes</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{sceneAnalysis.spectralNotes}</p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {sceneAnalysis.recommendations && (
                    <div className="p-3 space-y-1 bg-primary/5">
                      <span className="text-[10px] uppercase tracking-wider text-primary/70 font-semibold">Recommendations</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{sceneAnalysis.recommendations}</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Image Enhancements */}
            <section className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                  <SlidersHorizontal className="h-3 w-3 mr-1" /> Image Enhancements
                </h2>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => setEnhancements({ contrast: 1, brightness: 1, saturation: 1 })}>
                  RESET
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span>Contrast</span><span className="font-mono text-muted-foreground">{enhancements.contrast.toFixed(2)}x</span></div>
                  <Slider value={[enhancements.contrast]} min={0.5} max={2.5} step={0.1} onValueChange={(v) => setEnhancements((p) => ({ ...p, contrast: v[0] }))} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span>Brightness</span><span className="font-mono text-muted-foreground">{enhancements.brightness.toFixed(2)}x</span></div>
                  <Slider value={[enhancements.brightness]} min={0.5} max={2.0} step={0.1} onValueChange={(v) => setEnhancements((p) => ({ ...p, brightness: v[0] }))} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span>Saturation</span><span className="font-mono text-muted-foreground">{enhancements.saturation.toFixed(2)}x</span></div>
                  <Slider value={[enhancements.saturation]} min={0} max={3.0} step={0.1} onValueChange={(v) => setEnhancements((p) => ({ ...p, saturation: v[0] }))} />
                </div>
              </div>
            </section>

            {/* LUT Palette */}
            <section>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">LUT Palette</h2>
              <div className="flex flex-wrap gap-2">
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPalette(p)}
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${palette.id === p.id ? "bg-primary/20 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:bg-secondary"}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Object Detection */}
            <section className="bg-background rounded-lg border border-border overflow-hidden">
              <div className="p-3 border-b border-border flex justify-between items-center bg-card/50">
                <h2 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center">
                  <Target className="h-3 w-3 mr-1" /> Detection Results
                </h2>
                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 border-primary/30 text-primary hover:bg-primary/10" onClick={handleRunDetection} disabled={detecting}>
                  {detecting ? "SCANNING…" : "RUN SCAN"}
                </Button>
              </div>
              <div className="p-3 grid grid-cols-2 gap-3 relative">
                {detecting && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="w-full max-w-[80%] h-1 bg-secondary rounded overflow-hidden">
                      <div className="h-full bg-primary animate-pulse w-full" />
                    </div>
                  </div>
                )}
                <div className="bg-card border border-border rounded p-2 flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase">Vehicles</span>
                  <span className="text-lg font-mono text-foreground font-semibold">{objects.vehicles}</span>
                </div>
                <div className="bg-card border border-border rounded p-2 flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase">Buildings</span>
                  <span className="text-lg font-mono text-foreground font-semibold">{objects.buildings}</span>
                </div>
                <div className="bg-card border border-border rounded p-2 flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase">Roads</span>
                  <span className="text-lg font-mono text-foreground font-semibold">{objects.roads} km</span>
                </div>
                <div className="bg-card border border-border rounded p-2 flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase">Vegetation</span>
                  <span className="text-lg font-mono text-foreground font-semibold">{objects.vegetation}%</span>
                </div>
              </div>
            </section>

            {/* Pixel Distribution */}
            <section>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pixel Distribution</h2>
              <div className="h-32 bg-background border border-border rounded-lg p-2 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogram}>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

          </div>
        </aside>}
      </div>

      {/* Integration diagnostics */}
      <Dialog open={diagnosticsOpen} onOpenChange={setDiagnosticsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-primary" /> Integration diagnostics</DialogTitle>
            <DialogDescription>Safe service status only. Credentials and authorization headers are never displayed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {diagnostics && ([
                ["Railway", diagnostics.railway],
                ["Cloudflare", diagnostics.cloudflare],
                ["OpenAI", diagnostics.openai],
                ["Google Maps", diagnostics.googleMaps],
                ["AgentPhone", diagnostics.agentPhone],
              ] as Array<[string, IntegrationStatus]>).map(([label, status]) => {
                const isGood = status.connected || status.configured;
                return (
                  <div key={label} className="rounded-lg border border-border bg-background p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium">{label}</span>
                      {isGood
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                        : <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                    <p className={`mt-1 text-[10px] font-mono ${isGood ? "text-green-300" : "text-muted-foreground"}`}>
                      {status.status === "configured" ? "Configured / not tested" : status.status === "connected" ? "Connected" : "Not configured"}
                    </p>
                    {status.reason && <p className="mt-1 text-[10px] text-muted-foreground">{status.reason.replaceAll("_", " ")}</p>}
                  </div>
                );
              })}
            </div>
            {!diagnostics && !diagnosticsLoading && (
              <div className="rounded-lg border border-border bg-background p-4 text-center text-xs text-muted-foreground">No diagnostic result yet.</div>
            )}
            {diagnosticsLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Refreshing diagnostics…</div>
            )}
            {diagnostics && <p className="text-[10px] font-mono text-muted-foreground">Last checked {new Date(diagnostics.timestamp).toLocaleString()}</p>}
            <Button variant="outline" className="w-full gap-2" onClick={fetchDiagnostics} disabled={diagnosticsLoading}>
              <RefreshCw className={`h-3.5 w-3.5 ${diagnosticsLoading ? "animate-spin" : ""}`} /> Refresh Diagnostics
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AgentPhone test alert */}
      <Dialog open={agentPhoneOpen} onOpenChange={setAgentPhoneOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> AgentPhone alert test</DialogTitle>
            <DialogDescription>Connectivity testing and actual dispatch are separate. Nothing is sent automatically from detection results.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Connection status</span>
                {agentPhoneLoading
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  : agentPhoneVerification?.configured
                    ? <span className="flex items-center gap-1 text-[10px] text-amber-300"><ShieldCheck className="h-3.5 w-3.5" /> Configured</span>
                    : <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><WifiOff className="h-3.5 w-3.5" /> Not configured</span>}
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {agentPhoneVerification?.reason?.replaceAll("_", " ") ?? "Run a connectivity test before dispatching."}
              </p>
              <Button variant="outline" size="sm" className="mt-3 h-7 gap-1.5 text-[11px]" onClick={verifyAgentPhone} disabled={agentPhoneLoading}>
                <RefreshCw className={`h-3 w-3 ${agentPhoneLoading ? "animate-spin" : ""}`} /> Test Connection
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Phone number (E.164)</label>
                <Input value={alertPhoneNumber} onChange={(e) => setAlertPhoneNumber(e.target.value)} placeholder="+14155550123" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Message</label>
                <textarea
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  maxLength={480}
                  rows={3}
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-right text-[10px] text-muted-foreground">{alertMessage.length}/480</p>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["sms", "voice"] as const).map((channel) => (
                    <button
                      key={channel}
                      onClick={() => setAlertChannel(channel)}
                      className={`rounded border px-3 py-2 text-xs capitalize ${alertChannel === channel ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {agentPhoneError && <div className="rounded border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">{agentPhoneError}</div>}
            {agentPhoneResult && <div className="rounded border border-green-500/40 bg-green-500/10 p-2 text-xs text-green-300">{agentPhoneResult}</div>}
            <Button
              className="w-full gap-2"
              onClick={sendAgentPhoneAlert}
              disabled={agentPhoneSending || !alertPhoneNumber.trim() || !alertMessage.trim()}
            >
              {agentPhoneSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              {agentPhoneSending ? "Sending…" : "Send Test Alert"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
