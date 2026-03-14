# Employee Audit Dashboard

## Tech Stack
Vite + React 18, react-router-dom v6, react-leaflet, CSS Modules.
No UI component libraries used.

## Run locally
npm install && npm run dev

## Architecture
4 routes protected by AuthContext + ProtectedRoute.
EmployeeContext holds fetched data globally — avoids re-fetching on navigation.

## Intentional Vulnerability (Bug)
Location: `src/pages/ListPage.jsx` — `useMemo` for `visibleRows`.
The memo logically depends on both the `scrollTop` offset and the `employees` array, however, `employees` is intentionally omitted from the dependency array. 
*Behavior*: When `fetchEmployees()` resolves initially and fires `setEmployees`, `scrollTop` is still `0` (unchanged). React skips recomputing the memo, causing the list to incorrectly render completely empty until the user first initiates a physical scroll event (which triggers a `scrollTop` state update and forces a recompute).
This is marked with an `eslint-disable-next-line` comment and was chosen because the symptom is a prominent, visual state-synchronization flaw that is easily identifiable during a code review context testing DOM and React rendering lifecycles.

## Custom Virtualization Math
visibleStart = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER)
visibleEnd   = Math.min(n-1, Math.floor((scrollTop+HEIGHT)/ROW_HEIGHT) + BUFFER)
Each row is absolutely positioned at absIndex * ROW_HEIGHT.
Inner container height = employees.length * ROW_HEIGHT (correct scrollbar size).

## City Coordinate Mapping
Hardcoded lookup in `src/utils/cityCoords.js` after inspecting the API response field values. 
Since a strict dependency limit was enforced for data transformations on map usage, we manually constructed an index mapping the explicit string payload of each city resulting from the custom grouping reducer logic directly to their respective latitude and longitude. Cities not present in the lookup dictionary will gracefully bypass the Leaflet Marker rendering.

## Known Limitations
- Camera API via `navigator.mediaDevices` requires an HTTPS context or localhost strictly due to modern browser security policies regarding PII mapping.
- Canvas coordinate mismatch on the signature overlay required normalization. The sigCanvas HTML width/height attributes must be set to match the native video resolution, not the CSS display size. Pointer events fire in CSS space and need scaling via `getBoundingClientRect()` otherwise drawings appear offset.
