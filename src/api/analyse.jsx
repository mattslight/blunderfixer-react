const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generic helper to POST data
async function post(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error POST ${endpoint}:`, error);
    throw error;
  }
}

// Specific API call for analysing FEN
export async function analyseFEN(fen, top_n = 1) {
  return post("/analyse-fen", { fen, top_n });
}

// Later you can easily add more like:
// export async function analysePGN(pgn) { return post("/api/analyse-pgn", { pgn }); }
// export async function getProfile(username) { return get(`/api/profile/${username}`); } (if you want GET too)
