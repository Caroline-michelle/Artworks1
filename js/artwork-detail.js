import { getArtworkById } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const loading = document.getElementById("loading");
  const error = document.getElementById("error-message");
  const section = document.getElementById("artwork-detail");

  if (!id) {
    error.textContent = "Ingen kunst-ID i URL.";
    loading.style.display = "none";
    return;
  }

  try {
    const artwork = await getArtworkById(id);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");
    const apiKey = "c389096e-c355-4b68-b9f1-8b1dd2a17ce0";

    console.log("Bruker:", user);
    console.log("Forfatter av kunstverk:", artwork.author);

    document.getElementById("artwork-image").src = artwork.imageUrl;
    document.getElementById("artwork-image").alt = artwork.altText;
    document.getElementById("artwork-title").textContent =
      artwork.title || "Uten tittel";
    document.getElementById("artwork-artist").textContent =
      artwork.artist || "Ukjent";
    document.getElementById("artwork-year").textContent =
      artwork.year || "Ukjent";
    document.getElementById("artwork-medium").textContent =
      artwork.medium || "Ukjent";
    document.getElementById("artwork-description").textContent =
      artwork.description || "Ingen beskrivelse.";
    document.getElementById("artwork-location").textContent =
      artwork.location || "Ukjent";

    if (user && user.name === artwork.author?.name) {
      const buttonWrapper = document.createElement("div");
      buttonWrapper.style.marginTop = "1.5rem";
      buttonWrapper.style.display = "flex";
      buttonWrapper.style.gap = "1rem";

      const editLink = document.createElement("a");
      editLink.href = `../artworks/edit.html?id=${artwork.id}`;
      editLink.textContent = " Rediger";
      editLink.classList.add("edit-button");

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = " Slett";
      deleteBtn.classList.add("danger-button");

      deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Er du sikker på at du vil slette dette kunstverket?"
        );
        if (!confirmDelete) return;

        try {
          const response = await fetch(
            `https://v2.api.noroff.dev/artworks/${artwork.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
              },
            }
          );

          if (!response.ok) throw new Error("Sletting feilet.");
          alert("Kunstverket ble slettet.");
          window.location.href = "../index.html";
        } catch (err) {
          alert("Kunne ikke slette kunstverket.");
          console.error(err);
        }
      });

      buttonWrapper.appendChild(editLink);
      buttonWrapper.appendChild(deleteBtn);
      document.querySelector(".artwork-info").appendChild(buttonWrapper);
    }

    section.classList.remove("hidden");
  } catch (err) {
    console.error("Feil ved lasting av kunstverk:", err);
    error.textContent = "Kunne ikke hente kunstverket.";
  } finally {
    loading.style.display = "none";
  }
});
