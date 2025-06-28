const API_BASE = "https://v2.api.noroff.dev";
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQ2Fyb2xpbmVNaWNoZWxsZSIsImVtYWlsIjoiY2FybWFyMDI3MzZAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3NTA5NDgyMDF9.kUm4BJmc1qxILNnWEWmcYXL4BQfJWUn7ZQGtQQncjzA";
const apiKey = "c389096e-c355-4b68-b9f1-8b1dd2a17ce0";

// Hent alle kunstverk
export async function getArtworks({
  limit = 12,
  page = 1,
  sort = "created",
  sortOrder = "desc",
} = {}) {
  const params = new URLSearchParams({ limit, page, sort, sortOrder });

  const response = await fetch(`${API_BASE}/artworks?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const { data } = await response.json();

  return data.map((artwork) => {
    const imageUrl = artwork.image?.url?.startsWith("http")
      ? artwork.image.url
      : "https://via.placeholder.com/300x180?text=No+Image";

    const altText = artwork.image?.alt || "Kunstverk";

    return {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      imageUrl,
      altText,
    };
  });
}

// Hent ett enkelt kunstverk
export async function getArtworkById(id) {
  const response = await fetch(`${API_BASE}/artworks/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch artwork with ID ${id}`);
  }

  const { data } = await response.json();

  const imageUrl = data.image?.url?.startsWith("http")
    ? data.image.url
    : "https://via.placeholder.com/600x400?text=No+Image";

  const altText = data.image?.alt || "Kunstverk";

  return {
    id: data.id,
    title: data.title,
    artist: data.artist,
    year: data.year,
    medium: data.medium,
    description: data.description,
    location: data.location,
    imageUrl,
    altText,
    author: data.owner,
  };
}
