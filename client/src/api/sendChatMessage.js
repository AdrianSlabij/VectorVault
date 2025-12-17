const API_URL = "http://localhost:8000";

export async function sendChatMessage(token, message) {
  try {
    const res = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ query: message }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to send message");
    }

    return await res.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Re-throw so the UI can handle it (e.g. show an error bubble)
  }
}