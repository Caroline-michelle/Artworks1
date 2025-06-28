const form = document.getElementById("login-form");
const message = document.getElementById("login-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value.trim();

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Innlogging feilet. Sjekk e-post og passord.");
    }

    const { data } = await response.json(); // hent data

    // lagre token og brukernavn
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify({ name: data.name }));

    // send videre til forsiden
    window.location.href = "../index.html";
  } catch (error) {
    console.error(error);
    message.textContent = error.message;
  }
});
