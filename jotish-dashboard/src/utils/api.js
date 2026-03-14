export async function fetchEmployees() {
  const response = await fetch("https://backend.jotish.in/backend_dev/gettabledata.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: "test",
      password: "123456"
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch employees via API");
  }
  
  if (data.TABLE_DATA && data.TABLE_DATA.data) {
    // API returns array of arrays, convert to objects
    return data.TABLE_DATA.data.map((row, index) => ({
      id: String(row[3] || index), // unique identifier
      name: row[0],
      position: row[1],
      city: row[2],
      startDate: row[4],
      salary: Number(row[5].replace(/[^0-9.-]+/g, "")) // parse "$320,800"
    }));
  }

  return Array.isArray(data) ? data : (data.data || Object.values(data));
}
