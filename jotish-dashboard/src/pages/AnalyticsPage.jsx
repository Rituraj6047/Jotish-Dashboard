import { useLocation } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";
import { CITY_COORDS } from "../utils/cityCoords";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import styles from "../styles/analytics.module.css";

// Fix broken default icons — run once at module level outside the component:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ 
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon, 
  shadowUrl: markerShadow 
});

export default function AnalyticsPage() {
  const location = useLocation();
  const { auditImage, employeeId } = location.state || {};
  const imgSrc = auditImage || localStorage.getItem(`audit_${employeeId}`);
  
  const { employees } = useEmployees();

  if (!employees.length) return <div className={styles.container}>Loading salary data...</div>;

  const grouped = employees.reduce((acc, emp) => {
    if (!acc[emp.city]) acc[emp.city] = { total: 0, count: 0 };
    acc[emp.city].total += Number(emp.salary);
    acc[emp.city].count += 1;
    return acc;
  }, {});

  const cityList = Object.entries(grouped)
    .map(([city, { total, count }]) => [city, count ? total / count : 0]);

  const maxSalary = Math.max(...cityList.map(([, v]) => v), 1);
  const colWidth  = 720 / Math.max(cityList.length, 1);

  return (
    <div className={styles.container}>
      <h2>Analytics & Audit</h2>
      
      {imgSrc && (
        <div className={styles.auditSection}>
          <h3>Verified Audit Document</h3>
          <img src={imgSrc} alt="Verified Audit Document" className={styles.auditImg} />
        </div>
      )}

      <div className={styles.chartSection}>
        <h3>Average Salary by City</h3>
        <svg viewBox="0 0 800 400" width="100%" style={{ maxWidth: 800, marginTop: '20px' }}>
          {cityList.map(([city, avg], i) => {
            const barW = colWidth * 0.7;
            const barH = (avg / maxSalary) * 300;
            const barX = 60 + i * colWidth;
            const barY = 320 - barH;
            return (
              <g key={city}>
                <rect x={barX} y={barY} width={barW} height={barH} fill="#3b82f6" />
                <text x={barX + barW/2} y={338} textAnchor="middle" fontSize="11">
                  {city}
                </text>
                <text x={barX + barW/2} y={barY - 5} textAnchor="middle" fontSize="10">
                  {Math.round(avg)}
                </text>
              </g>
            );
          })}
          <line x1="60" y1="20"  x2="60"  y2="320" stroke="#ccc" strokeWidth="1"/>
          <line x1="60" y1="320" x2="780" y2="320" stroke="#ccc" strokeWidth="1"/>
        </svg>
      </div>

      <div className={styles.mapSection}>
        <h3>Global Presence</h3>
        <MapContainer center={[30, 0]} zoom={2} style={{ height: 400, marginTop: '10px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {cityList.map(([city, avg]) => {
            const coords = CITY_COORDS[city];
            if (!coords) return null; // gracefully skip unmapped cities
            return (
              <Marker key={city} position={[coords.lat, coords.lng]}>
                <Popup>{city}: avg ${Math.round(avg)}</Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
