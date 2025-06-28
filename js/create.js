const form = document.getElementById("create-form");
const message = document.getElementById("create-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user")); // Hent brukeren
  const apiKey = "c389096e-c355-4b68-b9f1-8b1dd2a17ce0";

  if (!token || !user) {
    message.textContent = "Du må være logget inn for å publisere.";
    return;
  }

  const formData = new FormData(form);
  const data = {
    title: formData.get("title"),
    artist: formData.get("artist"),
    year: parseInt(formData.get("year")),
    medium: formData.get("medium"),
    description: formData.get("description"),
    location: formData.get("location"),
    image: {
      url: formData.get("imageUrl"),
      alt: formData.get("imageAlt"),
    },
    owner: {
      name: user.name, // Legg til forfatter
    },
  };

  try {
    const response = await fetch("https://v2.api.noroff.dev/artworks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Feil ved innsending.");
    }

    form.reset();
    message.textContent = "";

    const toast = document.getElementById("toast-success");
    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }, 4000);
  } catch (error) {
    console.error(error);
    message.textContent = "Noe gikk galt. Prøv igjen.";
  }
});
