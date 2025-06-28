const form = document.getElementById("register-form");
const message = document.getElementById("register-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || "Registrering feilet.");
    }

    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("userName", result.data.name);

    window.location.href = "../index.html";
  } catch (error) {
    console.error("⛔", error);
    message.textContent = error.message;
  }
});
