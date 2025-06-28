const nav = document.querySelector(".main-nav");
const nameContainer = document.getElementById("user-name");
const token = localStorage.getItem("accessToken");
const user = JSON.parse(localStorage.getItem("user")); // Lagrer hele brukerobjektet

// Bruk rotbaserte stier for alle lenker (starter med /)
if (nav) {
  if (token && user) {
    nav.innerHTML = `
      <a href="/artworks/create.html">Opprett innlegg</a>
      <a href="#" id="logout-link">Logg ut</a>
    `;

    // Vis brukernavn hvis innlogget
    if (nameContainer && user.name) {
      nameContainer.textContent = `Innlogget bruker: ${user.name}`;
    }
  } else {
    nav.innerHTML = `
      <a href="/account/login.html">Logg inn</a>
      <a href="/account/register.html">Registrer</a>
    `;
  }
}

// Logg ut-funksjon
document.addEventListener("click", (e) => {
  if (e.target.id === "logout-link") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/index.html";
  }
});
