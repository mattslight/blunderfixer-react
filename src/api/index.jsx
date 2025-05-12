const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generic helper to POST data
async function post(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  return post('/analyse-fen', { fen, top_n });
}

export async function extractFeatures(fen) {
  return post('/extract-features', { fen });
}

// ————————————————
// NEW: API call for analysing a full PGN
export async function analysePGN(pgn, depth = 12) {
  return post('/analyse-pgn', { pgn, depth });
}

export async function getProfile(username) {
  const res = await fetch(`${BASE_URL}/profile/${username}`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function getRecentGames(username, limit = 20) {
  const res = await fetch(
    `${BASE_URL}/public/players/${username}/recent-games?limit=${limit}`
  );
  if (!res.ok) throw new Error('Failed to fetch recent games');
  return res.json();
}
