import { getArtworks } from "./js/api.js";

const container = document.getElementById("artworks-container");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error-message");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const artworks = await getArtworks();
    loading.style.display = "none";

    if (!artworks.length) {
      container.innerHTML = "<p>Ingen kunstverk funnet.</p>";
      return;
    }

    artworks.forEach((art, index) => {
      const shapeIndex = (index % 4) + 1;
      const card = document.createElement("div");
      card.className = "artwork-card";

      card.innerHTML = `
        <div class="artwork-shape shape-${shapeIndex}">
          <a href="index.html?id=${art.id}" class="artwork-link">
          <a href="artworks/index.html?id=${art.id}" class="artwork-link">
            <img src="${art.imageUrl}" alt="${art.altText}" />
            <div class="artwork-info">
              <h3>${art.title}</h3>
              <p>${art.artist}</p>
            </div>
          </a>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    loading.style.display = "none";
    errorMsg.textContent = "Kunne ikke hente kunstverk. Prøv igjen senere.";
    console.error("Feil ved lasting:", err);
  }
});
