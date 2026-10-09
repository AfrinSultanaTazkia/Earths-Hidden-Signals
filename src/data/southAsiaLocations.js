// ============================================================
// South Asia Cities & Locations Database
// All coordinates verified — covers BD, India, Nepal, Pakistan, Sri Lanka
// ============================================================

export const SOUTH_ASIA_LOCATIONS = [
  // ─── BANGLADESH ───────────────────────────────────────────
  {
    id: 'dhaka', country: 'bangladesh', flag: '🇧🇩', name: 'Dhaka',
    label: 'Capital City', lat: 23.8103, lng: 90.4125,
    disaster: 'River Flood', disasterIcon: '🌊', color: '#06B6D4',
    division: 'Dhaka Division', population: '22M', elevation: '4m'
  },
  {
    id: 'chittagong', country: 'bangladesh', flag: '🇧🇩', name: 'Chittagong',
    label: 'Port City', lat: 22.3569, lng: 91.7832,
    disaster: 'Cyclone / Flood', disasterIcon: '🌀', color: '#06B6D4',
    division: 'Chattogram Division', population: '8M', elevation: '9m'
  },
  {
    id: 'sylhet', country: 'bangladesh', flag: '🇧🇩', name: 'Sylhet',
    label: 'Tea Region', lat: 24.8949, lng: 91.8687,
    disaster: 'Flash Flood', disasterIcon: '🌊', color: '#06B6D4',
    division: 'Sylhet Division', population: '3.4M', elevation: '36m'
  },
  {
    id: 'rajshahi', country: 'bangladesh', flag: '🇧🇩', name: 'Rajshahi',
    label: 'Silk City', lat: 24.3745, lng: 88.6042,
    disaster: 'Drought / Flood', disasterIcon: '💧', color: '#06B6D4',
    division: 'Rajshahi Division', population: '2.4M', elevation: '20m'
  },
  {
    id: 'khulna', country: 'bangladesh', flag: '🇧🇩', name: 'Khulna',
    label: 'Coastal City', lat: 22.8456, lng: 89.5403,
    disaster: 'Cyclone / Salinity', disasterIcon: '🌀', color: '#06B6D4',
    division: 'Khulna Division', population: '2.3M', elevation: '3m'
  },
  {
    id: 'barishal', country: 'bangladesh', flag: '🇧🇩', name: 'Barishal',
    label: 'River Delta', lat: 22.7010, lng: 90.3535,
    disaster: 'Delta Flood', disasterIcon: '🌊', color: '#06B6D4',
    division: 'Barishal Division', population: '1.5M', elevation: '1m'
  },
  {
    id: 'mymensingh', country: 'bangladesh', flag: '🇧🇩', name: 'Mymensingh',
    label: 'Agricultural Hub', lat: 24.7471, lng: 90.4203,
    disaster: 'River Flood', disasterIcon: '🌊', color: '#06B6D4',
    division: 'Mymensingh Division', population: '1.2M', elevation: '18m'
  },
  {
    id: 'rangpur', country: 'bangladesh', flag: '🇧🇩', name: 'Rangpur',
    label: 'Northern City', lat: 25.7439, lng: 89.2752,
    disaster: 'Flood / Erosion', disasterIcon: '🌊', color: '#06B6D4',
    division: 'Rangpur Division', population: '1M', elevation: '34m'
  },
  {
    id: 'coxsbazar', country: 'bangladesh', flag: '🇧🇩', name: "Cox's Bazar",
    label: 'Longest Beach', lat: 21.4272, lng: 92.0058,
    disaster: 'Cyclone / Erosion', disasterIcon: '🌀', color: '#06B6D4',
    division: 'Chattogram Division', population: '0.7M', elevation: '5m'
  },
  {
    id: 'comilla', country: 'bangladesh', flag: '🇧🇩', name: 'Comilla',
    label: 'Eastern City', lat: 23.4607, lng: 91.1809,
    disaster: 'Flash Flood', disasterIcon: '🌊', color: '#06B6D4',
    division: 'Chattogram Division', population: '1.1M', elevation: '12m'
  },

  // ─── INDIA ────────────────────────────────────────────────
  {
    id: 'delhi', country: 'india', flag: '🇮🇳', name: 'New Delhi',
    label: 'Capital City', lat: 28.6139, lng: 77.2090,
    disaster: 'Heat Wave', disasterIcon: '🔥', color: '#F59E0B',
    division: 'NCT Delhi', population: '32M', elevation: '216m'
  },
  {
    id: 'mumbai', country: 'india', flag: '🇮🇳', name: 'Mumbai',
    label: 'Financial Hub', lat: 19.0760, lng: 72.8777,
    disaster: 'Urban Flood', disasterIcon: '🌊', color: '#F59E0B',
    division: 'Maharashtra', population: '20M', elevation: '14m'
  },
  {
    id: 'kolkata', country: 'india', flag: '🇮🇳', name: 'Kolkata',
    label: 'Eastern Hub', lat: 22.5726, lng: 88.3639,
    disaster: 'Cyclone / Flood', disasterIcon: '🌀', color: '#F59E0B',
    division: 'West Bengal', population: '15M', elevation: '6m'
  },
  {
    id: 'chennai', country: 'india', flag: '🇮🇳', name: 'Chennai',
    label: 'Coastal City', lat: 13.0827, lng: 80.2707,
    disaster: 'Cyclone / Drought', disasterIcon: '🌀', color: '#F59E0B',
    division: 'Tamil Nadu', population: '11M', elevation: '6m'
  },
  {
    id: 'bangalore', country: 'india', flag: '🇮🇳', name: 'Bengaluru',
    label: 'Tech City', lat: 12.9716, lng: 77.5946,
    disaster: 'Urban Flood', disasterIcon: '🌊', color: '#F59E0B',
    division: 'Karnataka', population: '13M', elevation: '920m'
  },
  {
    id: 'hyderabad_in', country: 'india', flag: '🇮🇳', name: 'Hyderabad',
    label: 'Pearl City', lat: 17.3850, lng: 78.4867,
    disaster: 'Flash Flood / Heat', disasterIcon: '🔥', color: '#F59E0B',
    division: 'Telangana', population: '10M', elevation: '536m'
  },
  {
    id: 'jaipur', country: 'india', flag: '🇮🇳', name: 'Jaipur',
    label: 'Pink City', lat: 26.9124, lng: 75.7873,
    disaster: 'Drought / Heat', disasterIcon: '🔥', color: '#F59E0B',
    division: 'Rajasthan', population: '3.7M', elevation: '431m'
  },
  {
    id: 'ahmedabad', country: 'india', flag: '🇮🇳', name: 'Ahmedabad',
    label: 'Industrial City', lat: 23.0225, lng: 72.5714,
    disaster: 'Heat Wave / Flood', disasterIcon: '🔥', color: '#F59E0B',
    division: 'Gujarat', population: '8M', elevation: '53m'
  },
  {
    id: 'pune', country: 'india', flag: '🇮🇳', name: 'Pune',
    label: 'Education Hub', lat: 18.5204, lng: 73.8567,
    disaster: 'Flash Flood', disasterIcon: '🌊', color: '#F59E0B',
    division: 'Maharashtra', population: '7.2M', elevation: '559m'
  },
  {
    id: 'lucknow', country: 'india', flag: '🇮🇳', name: 'Lucknow',
    label: 'Cultural City', lat: 26.8467, lng: 80.9462,
    disaster: 'Flood / Heat', disasterIcon: '🌊', color: '#F59E0B',
    division: 'Uttar Pradesh', population: '3.6M', elevation: '123m'
  },
  {
    id: 'bhopal', country: 'india', flag: '🇮🇳', name: 'Bhopal',
    label: 'Lake City', lat: 23.2599, lng: 77.4126,
    disaster: 'Wildfire / Drought', disasterIcon: '🔥', color: '#F59E0B',
    division: 'Madhya Pradesh', population: '2.4M', elevation: '527m'
  },
  {
    id: 'patna', country: 'india', flag: '🇮🇳', name: 'Patna',
    label: 'Ganges Plains', lat: 25.5941, lng: 85.1376,
    disaster: 'River Flood', disasterIcon: '🌊', color: '#F59E0B',
    division: 'Bihar', population: '2.3M', elevation: '53m'
  },
  {
    id: 'guwahati', country: 'india', flag: '🇮🇳', name: 'Guwahati',
    label: 'Northeast Gateway', lat: 26.1445, lng: 91.7362,
    disaster: 'Brahmaputra Flood', disasterIcon: '🌊', color: '#F59E0B',
    division: 'Assam', population: '1.3M', elevation: '55m'
  },
  {
    id: 'srinagar', country: 'india', flag: '🇮🇳', name: 'Srinagar',
    label: 'Valley City', lat: 34.0837, lng: 74.7973,
    disaster: 'Flash Flood / Snow', disasterIcon: '❄️', color: '#F59E0B',
    division: 'J&K', population: '1.3M', elevation: '1585m'
  },
  {
    id: 'kochi', country: 'india', flag: '🇮🇳', name: 'Kochi',
    label: 'Coastal Kerala', lat: 9.9312, lng: 76.2673,
    disaster: 'Coastal Flood', disasterIcon: '🌊', color: '#F59E0B',
    division: 'Kerala', population: '2.1M', elevation: '0m'
  },

  // ─── NEPAL ─────────────────────────────────────────────────
  {
    id: 'kathmandu', country: 'nepal', flag: '🇳🇵', name: 'Kathmandu',
    label: 'Capital City', lat: 27.7172, lng: 85.3240,
    disaster: 'Landslide / Flood', disasterIcon: '⛰️', color: '#10B981',
    division: 'Bagmati Province', population: '1.4M', elevation: '1400m'
  },
  {
    id: 'pokhara', country: 'nepal', flag: '🇳🇵', name: 'Pokhara',
    label: 'Lake City', lat: 28.2096, lng: 83.9856,
    disaster: 'Landslide / Flood', disasterIcon: '⛰️', color: '#10B981',
    division: 'Gandaki Province', population: '0.5M', elevation: '827m'
  },
  {
    id: 'biratnagar', country: 'nepal', flag: '🇳🇵', name: 'Biratnagar',
    label: 'Industrial City', lat: 26.4655, lng: 87.2716,
    disaster: 'Flood / Landslide', disasterIcon: '🌊', color: '#10B981',
    division: 'Province 1', population: '0.24M', elevation: '72m'
  },
  {
    id: 'bharatpur', country: 'nepal', flag: '🇳🇵', name: 'Bharatpur',
    label: 'Terai Region', lat: 27.6831, lng: 84.4324,
    disaster: 'Flood', disasterIcon: '🌊', color: '#10B981',
    division: 'Bagmati Province', population: '0.28M', elevation: '200m'
  },
  {
    id: 'lalitpur', country: 'nepal', flag: '🇳🇵', name: 'Lalitpur (Patan)',
    label: 'Heritage City', lat: 27.6588, lng: 85.3247,
    disaster: 'Earthquake / Flood', disasterIcon: '⛰️', color: '#10B981',
    division: 'Bagmati Province', population: '0.31M', elevation: '1341m'
  },

  // ─── PAKISTAN ──────────────────────────────────────────────
  {
    id: 'karachi', country: 'pakistan', flag: '🇵🇰', name: 'Karachi',
    label: 'Largest City', lat: 24.8607, lng: 67.0011,
    disaster: 'Urban Flood / Heat', disasterIcon: '⚡', color: '#6366F1',
    division: 'Sindh', population: '16M', elevation: '8m'
  },
  {
    id: 'lahore', country: 'pakistan', flag: '🇵🇰', name: 'Lahore',
    label: 'Cultural Hub', lat: 31.5204, lng: 74.3587,
    disaster: 'Monsoon Flood / Smog', disasterIcon: '⚡', color: '#6366F1',
    division: 'Punjab', population: '14M', elevation: '217m'
  },
  {
    id: 'islamabad', country: 'pakistan', flag: '🇵🇰', name: 'Islamabad',
    label: 'Capital City', lat: 33.6844, lng: 73.0479,
    disaster: 'Flash Flood', disasterIcon: '⚡', color: '#6366F1',
    division: 'ICT', population: '2.2M', elevation: '540m'
  },
  {
    id: 'rawalpindi', country: 'pakistan', flag: '🇵🇰', name: 'Rawalpindi',
    label: 'Twin City', lat: 33.5651, lng: 73.0169,
    disaster: 'Flash Flood', disasterIcon: '⚡', color: '#6366F1',
    division: 'Punjab', population: '2.3M', elevation: '507m'
  },
  {
    id: 'faisalabad', country: 'pakistan', flag: '🇵🇰', name: 'Faisalabad',
    label: 'Textile Hub', lat: 31.4154, lng: 73.0290,
    disaster: 'Heat Wave / Flood', disasterIcon: '🔥', color: '#6366F1',
    division: 'Punjab', population: '3.8M', elevation: '185m'
  },
  {
    id: 'quetta', country: 'pakistan', flag: '🇵🇰', name: 'Quetta',
    label: 'Mountain City', lat: 30.1798, lng: 66.9750,
    disaster: 'Drought / Earthquake', disasterIcon: '⛰️', color: '#6366F1',
    division: 'Balochistan', population: '1.2M', elevation: '1680m'
  },
  {
    id: 'peshawar', country: 'pakistan', flag: '🇵🇰', name: 'Peshawar',
    label: 'Gateway to KPK', lat: 34.0150, lng: 71.5249,
    disaster: 'Flash Flood', disasterIcon: '⚡', color: '#6366F1',
    division: 'KPK', population: '2.1M', elevation: '327m'
  },
  {
    id: 'multan', country: 'pakistan', flag: '🇵🇰', name: 'Multan',
    label: 'City of Saints', lat: 30.1575, lng: 71.5249,
    disaster: 'Heat Wave / Monsoon', disasterIcon: '🔥', color: '#6366F1',
    division: 'Punjab', population: '2M', elevation: '122m'
  },
  {
    id: 'hyderabad_pk', country: 'pakistan', flag: '🇵🇰', name: 'Hyderabad (PK)',
    label: 'Sindh City', lat: 25.3960, lng: 68.3578,
    disaster: 'Monsoon Flood', disasterIcon: '⚡', color: '#6366F1',
    division: 'Sindh', population: '1.7M', elevation: '28m'
  },

  // ─── SRI LANKA ──────────────────────────────────────────────
  {
    id: 'colombo', country: 'srilanka', flag: '🇱🇰', name: 'Colombo',
    label: 'Commercial Capital', lat: 6.9271, lng: 79.8612,
    disaster: 'Monsoon Flood', disasterIcon: '🌊', color: '#EC4899',
    division: 'Western Province', population: '5.6M', elevation: '7m'
  },
  {
    id: 'kandy', country: 'srilanka', flag: '🇱🇰', name: 'Kandy',
    label: 'Hill Capital', lat: 7.2906, lng: 80.6337,
    disaster: 'Landslide / Flood', disasterIcon: '⛰️', color: '#EC4899',
    division: 'Central Province', population: '0.6M', elevation: '474m'
  },

  // ─── BHUTAN ─────────────────────────────────────────────────
  {
    id: 'thimphu', country: 'bhutan', flag: '🇧🇹', name: 'Thimphu',
    label: 'Capital City', lat: 27.4728, lng: 89.6393,
    disaster: 'Glacial Flood (GLOF)', disasterIcon: '❄️', color: '#F472B6',
    division: 'Thimphu District', population: '0.13M', elevation: '2334m'
  },

  // ─── MYANMAR ────────────────────────────────────────────────
  {
    id: 'yangon', country: 'myanmar', flag: '🇲🇲', name: 'Yangon',
    label: 'Largest City', lat: 16.8661, lng: 96.1951,
    disaster: 'Cyclone / Flood', disasterIcon: '🌀', color: '#A78BFA',
    division: 'Yangon Region', population: '7.4M', elevation: '18m'
  },
  {
    id: 'mandalay', country: 'myanmar', flag: '🇲🇲', name: 'Mandalay',
    label: 'Cultural Capital', lat: 21.9588, lng: 96.0891,
    disaster: 'Drought / Flood', disasterIcon: '💧', color: '#A78BFA',
    division: 'Mandalay Region', population: '1.4M', elevation: '76m'
  }
];

// Country-level groupings
export const COUNTRY_GROUPS = {
  bangladesh: { name: 'Bangladesh', flag: '🇧🇩', color: '#06B6D4', lat: 23.6850, lng: 90.3563, zoom: 8 },
  india:      { name: 'India', flag: '🇮🇳', color: '#F59E0B', lat: 20.5937, lng: 78.9629, zoom: 5 },
  nepal:      { name: 'Nepal', flag: '🇳🇵', color: '#10B981', lat: 28.3949, lng: 84.1240, zoom: 7 },
  pakistan:   { name: 'Pakistan', flag: '🇵🇰', color: '#6366F1', lat: 30.3753, lng: 69.3451, zoom: 6 },
  srilanka:   { name: 'Sri Lanka', flag: '🇱🇰', color: '#EC4899', lat: 7.8731, lng: 80.7718, zoom: 7 },
  bhutan:     { name: 'Bhutan', flag: '🇧🇹', color: '#F472B6', lat: 27.5142, lng: 90.4336, zoom: 9 },
  myanmar:    { name: 'Myanmar', flag: '🇲🇲', color: '#A78BFA', lat: 19.1633, lng: 96.0785, zoom: 6 }
};
