const API_URL = "http://localhost:8000";

export async function fetchChatHistory(token) {
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Error fetching history:", res.status);
      return [];
    }

    const data = await res.json();
    console.log("Fetched chat history:", data);
    return data;
  } catch (error) {
    console.error("Network error fetching history:", error);
    return [];
  }
}