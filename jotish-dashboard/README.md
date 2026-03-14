# Employee Audit Dashboard

## Tech Stack
Vite + React 18, react-router-dom v6, react-leaflet, CSS Modules.
No UI component libraries used.

## Run locally
npm install && npm run dev

## Architecture
4 routes protected by AuthContext + ProtectedRoute.
EmployeeContext holds fetched data globally — avoids re-fetching on navigation.

## Custom Virtualization Math
visibleStart = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER)
visibleEnd   = Math.min(n-1, Math.floor((scrollTop+HEIGHT)/ROW_HEIGHT) + BUFFER)
Each row is absolutely positioned at absIndex * ROW_HEIGHT.
Inner container height = employees.length * ROW_HEIGHT (correct scrollbar size).

## City Coordinate Mapping
Hardcoded lookup in cityCoords.js after inspecting the API response field values.
Cities not present in the lookup are silently skipped on the map.

## Known Limitations
- Camera requires HTTPS or localhost (browser security policy)
- City coordinate lookup is hardcoded — new cities need manual addition

## What took longer than expected
Canvas coordinate mismatch on the signature overlay. The sigCanvas HTML
width/height attributes must be set to match the native video resolution,
not the CSS display size. Pointer events fire in CSS space and need scaling
via getBoundingClientRect() otherwise drawings appear in the wrong position.
