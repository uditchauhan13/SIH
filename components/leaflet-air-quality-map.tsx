"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Share2, Play, Pause, Layers, MapPin, Building2, Search, X } from "lucide-react"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.MapContainer })), {
  ssr: false,
})
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.TileLayer })), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.Marker })), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.Popup })), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.Circle })), { ssr: false })

interface MonitoringStation {
  id: string
  name: string
  position: [number, number]
  aqi: number
  pollutants: {
    pm25: number
    pm10: number
    no2: number
    o3: number
  }
  lastUpdated: string
  type: "government" | "industrial" | "residential" | "traffic"
  city: string
}

interface HeatmapPoint {
  position: [number, number]
  aqi: number
  intensity: number
}

interface LeafletAirQualityMapProps {
  center?: [number, number]
  zoom?: number
  className?: string
}

export function LeafletAirQualityMap({
  center = [20.5937, 78.9629], // India center for better overview
  zoom = 6,
  className = "",
}: LeafletAirQualityMapProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [selectedPollutant, setSelectedPollutant] = useState<string>("pm25")
  const [mapLayer, setMapLayer] = useState<string>("satellite")
  const [timeHour, setTimeHour] = useState<number>(12)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof majorCities>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string>("India Overview")
  const [mapCenter, setMapCenter] = useState<[number, number]>(center)
  const [mapZoom, setMapZoom] = useState<number>(zoom)
  const intervalRef = useRef<NodeJS.Timeout>()

  const majorCities = [
    { name: "India Overview", center: [20.5937, 78.9629], zoom: 6 },
    // Major Metro Cities
    { name: "Mumbai", center: [19.076, 72.8777], zoom: 11, state: "Maharashtra" },
    { name: "Delhi", center: [28.6315, 77.2167], zoom: 11, state: "Delhi" },
    { name: "Bangalore", center: [12.9716, 77.5946], zoom: 11, state: "Karnataka" },
    { name: "Chennai", center: [13.0827, 80.2707], zoom: 11, state: "Tamil Nadu" },
    { name: "Kolkata", center: [22.5726, 88.3639], zoom: 11, state: "West Bengal" },
    { name: "Pune", center: [18.5204, 73.8567], zoom: 11, state: "Maharashtra" },
    { name: "Hyderabad", center: [17.385, 78.4867], zoom: 11, state: "Telangana" },
    { name: "Ahmedabad", center: [23.0225, 72.5714], zoom: 11, state: "Gujarat" },

    // Tier-1 Cities
    { name: "Jaipur", center: [26.9124, 75.7873], zoom: 11, state: "Rajasthan" },
    { name: "Surat", center: [21.1702, 72.8311], zoom: 11, state: "Gujarat" },
    { name: "Lucknow", center: [26.8467, 80.9462], zoom: 11, state: "Uttar Pradesh" },
    { name: "Kanpur", center: [26.4499, 80.3319], zoom: 11, state: "Uttar Pradesh" },
    { name: "Nagpur", center: [21.1458, 79.0882], zoom: 11, state: "Maharashtra" },
    { name: "Indore", center: [22.7196, 75.8577], zoom: 11, state: "Madhya Pradesh" },
    { name: "Patna", center: [25.5941, 85.1376], zoom: 11, state: "Bihar" },
    { name: "Bhopal", center: [23.2599, 77.4126], zoom: 11, state: "Madhya Pradesh" },
    { name: "Visakhapatnam", center: [17.6868, 83.2185], zoom: 11, state: "Andhra Pradesh" },
    { name: "Coimbatore", center: [11.0168, 76.9558], zoom: 11, state: "Tamil Nadu" },

    // Tier-2 Cities
    { name: "Kochi", center: [9.9312, 76.2673], zoom: 11, state: "Kerala" },
    { name: "Thiruvananthapuram", center: [8.5241, 76.9366], zoom: 11, state: "Kerala" },
    { name: "Kozhikode", center: [11.2588, 75.7804], zoom: 11, state: "Kerala" },
    { name: "Thrissur", center: [10.5276, 76.2144], zoom: 11, state: "Kerala" },
    { name: "Madurai", center: [9.9252, 78.1198], zoom: 11, state: "Tamil Nadu" },
    { name: "Tiruchirappalli", center: [10.7905, 78.7047], zoom: 11, state: "Tamil Nadu" },
    { name: "Salem", center: [11.664, 78.146], zoom: 11, state: "Tamil Nadu" },
    { name: "Tirunelveli", center: [8.7139, 77.7567], zoom: 11, state: "Tamil Nadu" },
    { name: "Erode", center: [11.341, 77.7172], zoom: 11, state: "Tamil Nadu" },
    { name: "Vellore", center: [12.9165, 79.1325], zoom: 11, state: "Tamil Nadu" },

    // Karnataka Cities
    { name: "Mysore", center: [12.2958, 76.6394], zoom: 11, state: "Karnataka" },
    { name: "Hubli", center: [15.3647, 75.124], zoom: 11, state: "Karnataka" },
    { name: "Mangalore", center: [12.9141, 74.856], zoom: 11, state: "Karnataka" },
    { name: "Belgaum", center: [15.8497, 74.4977], zoom: 11, state: "Karnataka" },
    { name: "Gulbarga", center: [17.3297, 76.8343], zoom: 11, state: "Karnataka" },
    { name: "Davangere", center: [14.4644, 75.9218], zoom: 11, state: "Karnataka" },
    { name: "Bellary", center: [15.1394, 76.9214], zoom: 11, state: "Karnataka" },

    // Andhra Pradesh & Telangana
    { name: "Vijayawada", center: [16.5062, 80.648], zoom: 11, state: "Andhra Pradesh" },
    { name: "Guntur", center: [16.3067, 80.4365], zoom: 11, state: "Andhra Pradesh" },
    { name: "Warangal", center: [17.9689, 79.5941], zoom: 11, state: "Telangana" },
    { name: "Nizamabad", center: [18.6725, 78.0941], zoom: 11, state: "Telangana" },
    { name: "Karimnagar", center: [18.4386, 79.1288], zoom: 11, state: "Telangana" },
    { name: "Rajahmundry", center: [17.0005, 81.804], zoom: 11, state: "Andhra Pradesh" },
    { name: "Tirupati", center: [13.6288, 79.4192], zoom: 11, state: "Andhra Pradesh" },
    { name: "Nellore", center: [14.4426, 79.9865], zoom: 11, state: "Andhra Pradesh" },
    { name: "Kurnool", center: [15.8281, 78.0373], zoom: 11, state: "Andhra Pradesh" },
    { name: "Kadapa", center: [14.4673, 78.8242], zoom: 11, state: "Andhra Pradesh" },

    // Maharashtra Cities
    { name: "Nashik", center: [19.9975, 73.7898], zoom: 11, state: "Maharashtra" },
    { name: "Aurangabad", center: [19.8762, 75.3433], zoom: 11, state: "Maharashtra" },
    { name: "Solapur", center: [17.6599, 75.9064], zoom: 11, state: "Maharashtra" },
    { name: "Kolhapur", center: [16.705, 74.2433], zoom: 11, state: "Maharashtra" },
    { name: "Sangli", center: [16.8524, 74.5815], zoom: 11, state: "Maharashtra" },
    { name: "Amravati", center: [20.9374, 77.7796], zoom: 11, state: "Maharashtra" },
    { name: "Akola", center: [20.7002, 77.0082], zoom: 11, state: "Maharashtra" },
    { name: "Latur", center: [18.4088, 76.5604], zoom: 11, state: "Maharashtra" },
    { name: "Dhule", center: [20.9042, 74.7749], zoom: 11, state: "Maharashtra" },
    { name: "Ahmednagar", center: [19.0948, 74.748], zoom: 11, state: "Maharashtra" },

    // Gujarat Cities
    { name: "Vadodara", center: [22.3072, 73.1812], zoom: 11, state: "Gujarat" },
    { name: "Rajkot", center: [22.3039, 70.8022], zoom: 11, state: "Gujarat" },
    { name: "Bhavnagar", center: [21.7645, 72.1519], zoom: 11, state: "Gujarat" },
    { name: "Jamnagar", center: [22.4707, 70.0577], zoom: 11, state: "Gujarat" },
    { name: "Junagadh", center: [21.5222, 70.4579], zoom: 11, state: "Gujarat" },
    { name: "Gandhinagar", center: [23.2156, 72.6369], zoom: 11, state: "Gujarat" },
    { name: "Anand", center: [22.5645, 72.9289], zoom: 11, state: "Gujarat" },
    { name: "Morbi", center: [22.8173, 70.8322], zoom: 11, state: "Gujarat" },
    { name: "Nadiad", center: [22.6939, 72.8618], zoom: 11, state: "Gujarat" },
    { name: "Surendranagar", center: [22.7196, 71.6369], zoom: 11, state: "Gujarat" },

    // Rajasthan Cities
    { name: "Jodhpur", center: [26.2389, 73.0243], zoom: 11, state: "Rajasthan" },
    { name: "Kota", center: [25.2138, 75.8648], zoom: 11, state: "Rajasthan" },
    { name: "Bikaner", center: [28.0229, 73.3119], zoom: 11, state: "Rajasthan" },
    { name: "Udaipur", center: [24.5854, 73.7125], zoom: 11, state: "Rajasthan" },
    { name: "Ajmer", center: [26.4499, 74.6399], zoom: 11, state: "Rajasthan" },
    { name: "Bhilwara", center: [25.3407, 74.6269], zoom: 11, state: "Rajasthan" },
    { name: "Alwar", center: [27.553, 76.6346], zoom: 11, state: "Rajasthan" },
    { name: "Bharatpur", center: [27.2152, 77.4977], zoom: 11, state: "Rajasthan" },
    { name: "Sikar", center: [27.6094, 75.1399], zoom: 11, state: "Rajasthan" },
    { name: "Pali", center: [25.7711, 73.3234], zoom: 11, state: "Rajasthan" },

    // Uttar Pradesh Cities
    { name: "Agra", center: [27.1767, 78.0081], zoom: 11, state: "Uttar Pradesh" },
    { name: "Varanasi", center: [25.3176, 82.9739], zoom: 11, state: "Uttar Pradesh" },
    { name: "Meerut", center: [28.9845, 77.7064], zoom: 11, state: "Uttar Pradesh" },
    { name: "Allahabad", center: [25.4358, 81.8463], zoom: 11, state: "Uttar Pradesh" },
    { name: "Bareilly", center: [28.367, 79.4304], zoom: 11, state: "Uttar Pradesh" },
    { name: "Aligarh", center: [27.8974, 78.088], zoom: 11, state: "Uttar Pradesh" },
    { name: "Moradabad", center: [28.8386, 78.7733], zoom: 11, state: "Uttar Pradesh" },
    { name: "Saharanpur", center: [29.968, 77.5552], zoom: 11, state: "Uttar Pradesh" },
    { name: "Gorakhpur", center: [26.7606, 83.3732], zoom: 11, state: "Uttar Pradesh" },
    { name: "Firozabad", center: [27.1592, 78.3957], zoom: 11, state: "Uttar Pradesh" },
    { name: "Jhansi", center: [25.4484, 78.5685], zoom: 11, state: "Uttar Pradesh" },
    { name: "Muzaffarnagar", center: [29.4727, 77.7085], zoom: 11, state: "Uttar Pradesh" },
    { name: "Mathura", center: [27.4924, 77.6737], zoom: 11, state: "Uttar Pradesh" },
    { name: "Rampur", center: [28.8152, 79.0257], zoom: 11, state: "Uttar Pradesh" },
    { name: "Shahjahanpur", center: [27.8831, 79.9077], zoom: 11, state: "Uttar Pradesh" },

    // Madhya Pradesh Cities
    { name: "Gwalior", center: [26.2183, 78.1828], zoom: 11, state: "Madhya Pradesh" },
    { name: "Jabalpur", center: [23.1815, 79.9864], zoom: 11, state: "Madhya Pradesh" },
    { name: "Ujjain", center: [23.1765, 75.7885], zoom: 11, state: "Madhya Pradesh" },
    { name: "Sagar", center: [23.8388, 78.7378], zoom: 11, state: "Madhya Pradesh" },
    { name: "Dewas", center: [22.9676, 76.0534], zoom: 11, state: "Madhya Pradesh" },
    { name: "Satna", center: [24.6005, 80.8322], zoom: 11, state: "Madhya Pradesh" },
    { name: "Ratlam", center: [23.3315, 75.0367], zoom: 11, state: "Madhya Pradesh" },
    { name: "Rewa", center: [24.5364, 81.2961], zoom: 11, state: "Madhya Pradesh" },
    { name: "Singrauli", center: [24.1997, 82.6739], zoom: 11, state: "Madhya Pradesh" },
    { name: "Burhanpur", center: [21.3009, 76.2291], zoom: 11, state: "Madhya Pradesh" },

    // West Bengal Cities
    { name: "Howrah", center: [22.5958, 88.2636], zoom: 11, state: "West Bengal" },
    { name: "Durgapur", center: [23.4805, 87.3119], zoom: 11, state: "West Bengal" },
    { name: "Asansol", center: [23.6739, 86.9524], zoom: 11, state: "West Bengal" },
    { name: "Siliguri", center: [26.7271, 88.3953], zoom: 11, state: "West Bengal" },
    { name: "Malda", center: [25.0961, 88.1435], zoom: 11, state: "West Bengal" },
    { name: "Baharampur", center: [24.1024, 88.2518], zoom: 11, state: "West Bengal" },
    { name: "Habra", center: [22.8333, 88.6333], zoom: 11, state: "West Bengal" },
    { name: "Kharagpur", center: [22.346, 87.232], zoom: 11, state: "West Bengal" },
    { name: "Shantipur", center: [23.25, 88.4333], zoom: 11, state: "West Bengal" },
    { name: "Darjeeling", center: [27.036, 88.2627], zoom: 11, state: "West Bengal" },

    // Bihar Cities
    { name: "Gaya", center: [24.7914, 85.0002], zoom: 11, state: "Bihar" },
    { name: "Bhagalpur", center: [25.2425, 86.9842], zoom: 11, state: "Bihar" },
    { name: "Muzaffarpur", center: [26.1209, 85.3647], zoom: 11, state: "Bihar" },
    { name: "Purnia", center: [25.7771, 87.4753], zoom: 11, state: "Bihar" },
    { name: "Darbhanga", center: [26.1542, 85.8918], zoom: 11, state: "Bihar" },
    { name: "Bihar Sharif", center: [25.1979, 85.5226], zoom: 11, state: "Bihar" },
    { name: "Arrah", center: [25.5557, 84.6632], zoom: 11, state: "Bihar" },
    { name: "Begusarai", center: [25.4182, 86.1272], zoom: 11, state: "Bihar" },
    { name: "Katihar", center: [25.5394, 87.5751], zoom: 11, state: "Bihar" },
    { name: "Munger", center: [25.3764, 86.4737], zoom: 11, state: "Bihar" },

    // Odisha Cities
    { name: "Bhubaneswar", center: [20.2961, 85.8245], zoom: 11, state: "Odisha" },
    { name: "Cuttack", center: [20.4625, 85.8828], zoom: 11, state: "Odisha" },
    { name: "Rourkela", center: [22.2604, 84.8536], zoom: 11, state: "Odisha" },
    { name: "Berhampur", center: [19.3149, 84.7941], zoom: 11, state: "Odisha" },
    { name: "Sambalpur", center: [21.4669, 83.9812], zoom: 11, state: "Odisha" },
    { name: "Puri", center: [19.8135, 85.8312], zoom: 11, state: "Odisha" },
    { name: "Balasore", center: [21.4942, 86.9017], zoom: 11, state: "Odisha" },
    { name: "Bhadrak", center: [21.0545, 86.5118], zoom: 11, state: "Odisha" },
    { name: "Baripada", center: [21.9347, 86.735], zoom: 11, state: "Odisha" },

    // Jharkhand Cities
    { name: "Ranchi", center: [23.3441, 85.3096], zoom: 11, state: "Jharkhand" },
    { name: "Jamshedpur", center: [22.8046, 86.2029], zoom: 11, state: "Jharkhand" },
    { name: "Dhanbad", center: [23.7957, 86.4304], zoom: 11, state: "Jharkhand" },
    { name: "Bokaro", center: [23.6693, 86.1511], zoom: 11, state: "Jharkhand" },
    { name: "Deoghar", center: [24.4823, 86.6961], zoom: 11, state: "Jharkhand" },
    { name: "Phusro", center: [23.7939, 86.0369], zoom: 11, state: "Jharkhand" },
    { name: "Hazaribagh", center: [23.9981, 85.3615], zoom: 11, state: "Jharkhand" },
    { name: "Giridih", center: [24.1854, 86.3009], zoom: 11, state: "Jharkhand" },

    // Chhattisgarh Cities
    { name: "Raipur", center: [21.2514, 81.6296], zoom: 11, state: "Chhattisgarh" },
    { name: "Bhilai", center: [21.1938, 81.3509], zoom: 11, state: "Chhattisgarh" },
    { name: "Korba", center: [22.3595, 82.7501], zoom: 11, state: "Chhattisgarh" },
    { name: "Bilaspur", center: [22.0797, 82.1391], zoom: 11, state: "Chhattisgarh" },
    { name: "Durg", center: [21.1901, 81.2849], zoom: 11, state: "Chhattisgarh" },
    { name: "Rajnandgaon", center: [21.0974, 81.0379], zoom: 11, state: "Chhattisgarh" },

    // Assam Cities
    { name: "Guwahati", center: [26.1445, 91.7362], zoom: 11, state: "Assam" },
    { name: "Silchar", center: [24.8333, 92.7789], zoom: 11, state: "Assam" },
    { name: "Dibrugarh", center: [27.4728, 94.912], zoom: 11, state: "Assam" },
    { name: "Jorhat", center: [26.7509, 94.2037], zoom: 11, state: "Assam" },
    { name: "Nagaon", center: [26.3479, 92.6839], zoom: 11, state: "Assam" },
    { name: "Tinsukia", center: [27.4898, 95.3613], zoom: 11, state: "Assam" },
    { name: "Tezpur", center: [26.6335, 92.7983], zoom: 11, state: "Assam" },

    // Punjab Cities
    { name: "Ludhiana", center: [30.901, 75.8573], zoom: 11, state: "Punjab" },
    { name: "Amritsar", center: [31.634, 74.8723], zoom: 11, state: "Punjab" },
    { name: "Jalandhar", center: [31.326, 75.5762], zoom: 11, state: "Punjab" },
    { name: "Patiala", center: [30.3398, 76.3869], zoom: 11, state: "Punjab" },
    { name: "Bathinda", center: [30.211, 74.9455], zoom: 11, state: "Punjab" },
    { name: "Mohali", center: [30.7046, 76.7179], zoom: 11, state: "Punjab" },
    { name: "Firozpur", center: [30.9293, 74.615], zoom: 11, state: "Punjab" },
    { name: "Pathankot", center: [32.2746, 75.6521], zoom: 11, state: "Punjab" },
    { name: "Moga", center: [30.8176, 75.1711], zoom: 11, state: "Punjab" },
    { name: "Abohar", center: [30.1204, 74.1995], zoom: 11, state: "Punjab" },

    // Haryana Cities
    { name: "Faridabad", center: [28.4089, 77.3178], zoom: 11, state: "Haryana" },
    { name: "Gurgaon", center: [28.4595, 77.0266], zoom: 11, state: "Haryana" },
    { name: "Panipat", center: [29.3909, 76.9635], zoom: 11, state: "Haryana" },
    { name: "Ambala", center: [30.3782, 76.7767], zoom: 11, state: "Haryana" },
    { name: "Yamunanagar", center: [30.129, 77.2674], zoom: 11, state: "Haryana" },
    { name: "Rohtak", center: [28.8955, 76.6066], zoom: 11, state: "Haryana" },
    { name: "Hisar", center: [29.1492, 75.7217], zoom: 11, state: "Haryana" },
    { name: "Karnal", center: [29.6857, 76.9905], zoom: 11, state: "Haryana" },
    { name: "Sonipat", center: [28.9931, 77.0151], zoom: 11, state: "Haryana" },
    { name: "Panchkula", center: [30.6942, 76.8606], zoom: 11, state: "Haryana" },

    // Himachal Pradesh Cities
    { name: "Shimla", center: [31.1048, 77.1734], zoom: 11, state: "Himachal Pradesh" },
    { name: "Dharamshala", center: [32.219, 76.3234], zoom: 11, state: "Himachal Pradesh" },
    { name: "Solan", center: [30.9045, 77.0967], zoom: 11, state: "Himachal Pradesh" },
    { name: "Mandi", center: [31.7084, 76.9319], zoom: 11, state: "Himachal Pradesh" },
    { name: "Palampur", center: [32.1343, 76.537], zoom: 11, state: "Himachal Pradesh" },
    { name: "Kullu", center: [31.9578, 77.1092], zoom: 11, state: "Himachal Pradesh" },
    { name: "Hamirpur", center: [31.6839, 76.5225], zoom: 11, state: "Himachal Pradesh" },
    { name: "Una", center: [31.4649, 76.2708], zoom: 11, state: "Himachal Pradesh" },

    // Uttarakhand Cities
    { name: "Dehradun", center: [30.3165, 78.0322], zoom: 11, state: "Uttarakhand" },
    { name: "Haridwar", center: [29.9457, 78.1642], zoom: 11, state: "Uttarakhand" },
    { name: "Roorkee", center: [29.8543, 77.888], zoom: 11, state: "Uttarakhand" },
    { name: "Haldwani", center: [29.2183, 79.513], zoom: 11, state: "Uttarakhand" },
    { name: "Rudrapur", center: [28.9845, 79.4304], zoom: 11, state: "Uttarakhand" },
    { name: "Kashipur", center: [29.2155, 78.9618], zoom: 11, state: "Uttarakhand" },
    { name: "Rishikesh", center: [30.0869, 78.2676], zoom: 11, state: "Uttarakhand" },
    { name: "Kotdwar", center: [29.746, 78.5281], zoom: 11, state: "Uttarakhand" },

    // Jammu & Kashmir Cities
    { name: "Srinagar", center: [34.0837, 74.7973], zoom: 11, state: "Jammu & Kashmir" },
    { name: "Jammu", center: [32.7266, 74.857], zoom: 11, state: "Jammu & Kashmir" },
    { name: "Anantnag", center: [33.7311, 75.148], zoom: 11, state: "Jammu & Kashmir" },
    { name: "Baramulla", center: [34.2097, 74.3436], zoom: 11, state: "Jammu & Kashmir" },
    { name: "Sopore", center: [34.303, 74.4669], zoom: 11, state: "Jammu & Kashmir" },
    { name: "Kathua", center: [32.3708, 75.5216], zoom: 11, state: "Jammu & Kashmir" },
    { name: "Udhampur", center: [32.915, 75.142], zoom: 11, state: "Jammu & Kashmir" },

    // Goa Cities
    { name: "Panaji", center: [15.4909, 73.8278], zoom: 11, state: "Goa" },
    { name: "Margao", center: [15.2993, 73.9626], zoom: 11, state: "Goa" },
    { name: "Vasco da Gama", center: [15.3955, 73.8313], zoom: 11, state: "Goa" },
    { name: "Mapusa", center: [15.5909, 73.8278], zoom: 11, state: "Goa" },
    { name: "Ponda", center: [15.4013, 74.0071], zoom: 11, state: "Goa" },

    // Northeast Cities
    { name: "Imphal", center: [24.817, 93.9368], zoom: 11, state: "Manipur" },
    { name: "Aizawl", center: [23.7271, 92.7176], zoom: 11, state: "Mizoram" },
    { name: "Shillong", center: [25.5788, 91.8933], zoom: 11, state: "Meghalaya" },
    { name: "Agartala", center: [23.8315, 91.2868], zoom: 11, state: "Tripura" },
    { name: "Kohima", center: [25.6751, 94.1086], zoom: 11, state: "Nagaland" },
    { name: "Itanagar", center: [27.0844, 93.6053], zoom: 11, state: "Arunachal Pradesh" },
    { name: "Gangtok", center: [27.3389, 88.6065], zoom: 11, state: "Sikkim" },

    // Union Territory Cities
    { name: "Chandigarh", center: [30.7333, 76.7794], zoom: 11, state: "Chandigarh" },
    { name: "Puducherry", center: [11.9416, 79.8083], zoom: 11, state: "Puducherry" },
    { name: "Port Blair", center: [11.6234, 92.7265], zoom: 11, state: "Andaman & Nicobar Islands" },
    { name: "Kavaratti", center: [10.5669, 72.642], zoom: 11, state: "Lakshadweep" },
    { name: "Daman", center: [20.3974, 72.8328], zoom: 11, state: "Daman & Diu" },
    { name: "Silvassa", center: [20.2738, 73.014], zoom: 11, state: "Dadra & Nagar Haveli" },
  ]

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      try {
        // Load CSS first
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          link.crossOrigin = ""
          document.head.appendChild(link)
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          script.crossOrigin = ""

          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        if (window.L) {
          delete (window.L.Icon.Default.prototype as any)._getIconUrl
          window.L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          })
        }

        setLeafletLoaded(true)
        setTimeout(() => setMapReady(true), 100)
      } catch (error) {
        console.error("[v0] Failed to load Leaflet:", error)
      }
    }

    loadLeaflet()
  }, [])

  const monitoringStations: MonitoringStation[] = [
    // Mumbai Region
    {
      id: "mumbai-1",
      name: "Mumbai Central Air Quality Station",
      position: [19.076, 72.8777],
      aqi: 156,
      pollutants: { pm25: 68, pm10: 89, no2: 45, o3: 78 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "government",
      city: "Mumbai",
    },
    {
      id: "mumbai-2",
      name: "Bandra-Kurla Complex Industrial Monitor",
      position: [19.0596, 72.8656],
      aqi: 142,
      pollutants: { pm25: 62, pm10: 82, no2: 38, o3: 71 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "industrial",
      city: "Mumbai",
    },
    // Delhi Region
    {
      id: "delhi-1",
      name: "Connaught Place Central Station",
      position: [28.6315, 77.2167],
      aqi: 287,
      pollutants: { pm25: 142, pm10: 198, no2: 78, o3: 45 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "government",
      city: "Delhi",
    },
    // Add more stations as needed...
  ]

  const searchCities = (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const filtered = majorCities
      .filter(
        (city) =>
          city.name.toLowerCase().includes(term.toLowerCase()) ||
          city.state?.toLowerCase().includes(term.toLowerCase()),
      )
      .slice(0, 10)

    setSearchResults(filtered)
    setShowSearchResults(true)
  }

  const handleSearchSelect = (city: (typeof majorCities)[0]) => {
    setSelectedCity(city.name)
    setMapCenter([city.center[0], city.center[1]])
    setMapZoom(city.zoom)
    setSearchTerm(city.name)
    setShowSearchResults(false)
  }

  const generateHeatmapData = () => {
    const points: Array<{ position: [number, number]; aqi: number; intensity: number }> = []
    const baseTime = timeHour

    const regionalHotspots = [
      { center: [19.076, 72.8777], intensity: 0.8, name: "Mumbai Metro", radius: 0.5 },
      { center: [28.6315, 77.2167], intensity: 1.0, name: "Delhi NCR", radius: 0.6 },
      { center: [12.9716, 77.5946], intensity: 0.6, name: "Bangalore Metro", radius: 0.4 },
      // Add more hotspots...
    ]

    regionalHotspots.forEach((hotspot) => {
      const pointsPerHotspot = Math.floor(hotspot.radius * 50)

      for (let i = 0; i < pointsPerHotspot; i++) {
        const lat = hotspot.center[0] + (Math.random() - 0.5) * hotspot.radius
        const lng = hotspot.center[1] + (Math.random() - 0.5) * hotspot.radius

        const rushHourMultiplier = (baseTime >= 7 && baseTime <= 10) || (baseTime >= 17 && baseTime <= 20) ? 1.4 : 1.0
        const nightReduction = baseTime >= 22 || baseTime <= 5 ? 0.7 : 1.0
        const seasonalFactor = Math.random() * 0.3 + 0.85
        const baseAQI = (Math.random() * 120 + 30) * hotspot.intensity
        const aqi = Math.max(0, Math.min(500, baseAQI * rushHourMultiplier * nightReduction * seasonalFactor))

        points.push({
          position: [lat, lng],
          aqi,
          intensity: aqi / 500,
        })
      }
    })

    return points
  }

  const heatmapData = generateHeatmapData()

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#10b981"
    if (aqi <= 100) return "#f59e0b"
    if (aqi <= 150) return "#f97316"
    if (aqi <= 200) return "#ef4444"
    if (aqi <= 300) return "#8b5cf6"
    return "#7c2d12"
  }

  const getStationIcon = (type: string) => {
    switch (type) {
      case "government":
        return "🏛️"
      case "industrial":
        return "🏭"
      case "residential":
        return "🏠"
      case "traffic":
        return "🚗"
      default:
        return "📍"
    }
  }

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimeHour((prev) => (prev + 1) % 24)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  const exportScreenshot = () => {
    console.log("[v0] Exporting map screenshot...")
    alert("Screenshot export functionality would be implemented here")
  }

  const shareLocation = () => {
    console.log("[v0] Sharing location...")
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/dashboard?lat=${mapCenter[0]}&lng=${mapCenter[1]}`
      navigator.clipboard.writeText(url)
      alert("Location link copied to clipboard!")
    }
  }

  if (!leafletLoaded || !mapReady) {
    return (
      <div
        className={`relative w-full h-full min-h-[500px] bg-slate-800 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-white">Loading map...</div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Search Interface */}
      <div className="absolute top-4 left-4 z-[1000] w-80">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cities (e.g., Mumbai, Delhi, Bangalore...)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                searchCities(e.target.value)
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setShowSearchResults(false)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[1001]">
              {searchResults.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSelect(city)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center justify-between border-b border-gray-700 last:border-b-0"
                >
                  <div>
                    <div className="font-medium">{city.name}</div>
                    {city.state && <div className="text-sm text-gray-400">{city.state}</div>}
                  </div>
                  <MapPin className="h-4 w-4 text-blue-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-full min-h-[500px] bg-slate-800 rounded-lg overflow-hidden">
        {leafletLoaded && mapReady && (
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-container"
          >
            <TileLayer
              url={
                mapLayer === "satellite"
                  ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution={
                mapLayer === "satellite"
                  ? '&copy; <a href="https://www.esri.com/">Esri</a>'
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              }
            />

            {/* Heatmap Circles */}
            {heatmapData.map((point, index) => (
              <Circle
                key={`heatmap-${index}-${timeHour}`}
                center={point.position}
                radius={Math.max(800, point.intensity * 2500)}
                fillColor={getAQIColor(point.aqi)}
                fillOpacity={Math.max(0.2, point.intensity * 0.4)}
                stroke={true}
                color={getAQIColor(point.aqi)}
                weight={1}
                opacity={0.7}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">AQI: {Math.round(point.aqi)}</div>
                    <div className="text-xs text-gray-600">
                      {point.aqi <= 50
                        ? "Good"
                        : point.aqi <= 100
                          ? "Moderate"
                          : point.aqi <= 150
                            ? "Unhealthy for Sensitive"
                            : point.aqi <= 200
                              ? "Unhealthy"
                              : point.aqi <= 300
                                ? "Very Unhealthy"
                                : "Hazardous"}
                    </div>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Monitoring Stations */}
            {monitoringStations.map((station) => (
              <Marker
                key={station.id}
                position={station.position}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getStationIcon(station.type)}</span>
                      <div>
                        <div className="font-semibold">{station.name}</div>
                        <div className="text-xs text-gray-600">{station.city}</div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">AQI: </span>
                      <span className="font-bold" style={{ color: getAQIColor(station.aqi) }}>
                        {station.aqi}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <Card className="p-3 bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  const city = majorCities.find((c) => c.name === value)
                  if (city) {
                    setSelectedCity(city.name)
                    setMapCenter(city.center)
                    setMapZoom(city.zoom)
                  }
                }}
              >
                <SelectTrigger className="w-48 h-8 bg-slate-800 border-slate-600 text-xs text-white">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 max-h-60 overflow-y-auto z-[1002]">
                  {majorCities.map((city) => (
                    <SelectItem
                      key={city.name}
                      value={city.name}
                      className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{city.name}</span>
                        {city.state && <span className="text-xs text-slate-400">{city.state}</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <Select value={mapLayer} onValueChange={setMapLayer}>
                <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="street">Street Map</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{timeHour}:00</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-6 w-6 p-0 bg-slate-800 border-slate-600"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
              </div>
              <Slider
                value={[timeHour]}
                onValueChange={(value) => setTimeHour(value[0])}
                max={23}
                min={0}
                step={1}
                className="w-40"
              />
            </div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={exportScreenshot}
            className="bg-slate-900/90 border-slate-700 hover:bg-slate-800"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={shareLocation}
            className="bg-slate-900/90 border-slate-700 hover:bg-slate-800"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] max-w-xs">
        <Card className="p-3 bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            AQI Legend
          </h4>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">0-50 Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">51-100 Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">101-150 Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">151-200 Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">201-300 Very Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-900 flex-shrink-0" />
              <span className="text-slate-300 truncate">300+ Hazardous</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
