export default async function getAllFiles(token) {
    try {
        const res = await fetch("http://127.0.0.1:8000/files", {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!res.ok) {
            console.log("Error fetching files:", res.status)
            return [] // Return empty list on failure
        }

        // 4. Fixed double json() call
        const data = await res.json()
        console.log("getAllFiles response:", data)
        return data

    } catch (e) {
        console.error("Error getting all files:", e)
        return []
    }
}