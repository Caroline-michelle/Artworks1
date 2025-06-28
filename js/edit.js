import { getArtworkById } from "./api.js";

const form = document.getElementById("edit-form");
const message = document.getElementById("edit-message");
const deleteBtn = document.getElementById("delete-btn");
const toast = document.getElementById("toast-success");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const token = localStorage.getItem("accessToken");
const apiKey = "c389096e-c355-4b68-b9f1-8b1dd2a17ce0";

if (!id || !token) {
  message.textContent = "Ugyldig tilgang.";
  form.style.display = "none";
} else {
  loadArtwork();
}

async function loadArtwork() {
  try {
    const art = await getArtworkById(id);
    document.getElementById("title").value = art.title;
    document.getElementById("artist").value = art.artist;
    document.getElementById("year").value = art.year;
    document.getElementById("medium").value = art.medium;
    document.getElementById("location").value = art.location;
    document.getElementById("imageUrl").value = art.imageUrl;
    document.getElementById("imageAlt").value = art.altText;
    document.getElementById("description").value = art.description;
  } catch (err) {
    console.error(err);
    message.textContent = "Kunne ikke laste kunstverket.";
    form.style.display = "none";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: form.title.value,
    artist: form.artist.value,
    year: parseInt(form.year.value),
    medium: form.medium.value,
    description: form.description.value,
    location: form.location.value,
    image: {
      url: form.imageUrl.value,
      alt: form.imageAlt.value,
    },
  };

  try {
    const response = await fetch(`https://v2.api.noroff.dev/artworks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Oppdatering feilet.");

    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }, 3000);
  } catch (err) {
    console.error(err);
    message.textContent = "Kunne ikke oppdatere kunstverket.";
  }
});

deleteBtn.addEventListener("click", async () => {
  if (!confirm("Er du sikker på at du vil slette dette kunstverket?")) return;

  try {
    const res = await fetch(`https://v2.api.noroff.dev/artworks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!res.ok) throw new Error("Sletting feilet.");

    window.location.href = "../index.html";
  } catch (err) {
    console.error(err);
    message.textContent = "Kunne ikke slette kunstverket.";
  }
});
