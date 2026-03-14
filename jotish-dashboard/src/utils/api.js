export async function fetchEmployees() {
  console.log("fetching employees..."); // debug
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
  
  return Array.isArray(data) ? data : (data.data || Object.values(data));
}
