document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulaire");
  const paiementChamp = document.getElementById("paiementEffectue");

  const lienWave = document.querySelector('a[href*="pay.wave.com"]');
  if (lienWave) {
    lienWave.addEventListener("click", () => {
      setTimeout(() => {
        alert("✅ Paiement Wave simulé avec succès !");
        paiementChamp.value = "true";
      }, 3000);
    });
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (paiementChamp.value !== "true") {
      alert("⚠️ Veuillez d'abord effectuer le paiement via Wave avant de valider votre inscription.");
      return;
    }

    const formData = new FormData(form);

    try {
      const formData = new FormData(form);

  const response = await fetch('/inscription', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const message = await response.text(); // ⚠️ réponse attendue en texte simple
    alert(message); // Affiche "✅ Inscription réussie !"
    form.reset();
    localStorage.removeItem("paiementEffectue");
  } else {
    const errorText = await response.text();
    throw new Error(errorText || "Erreur serveur");
  }
} catch (error) {
  console.error("Erreur lors de l'envoi du formulaire :", error);
  alert("❌ Une erreur s'est produite lors de l'envoi du formulaire.");
}
  });
});
document.getElementById('inscriptionForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/inscription', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      // ✅ Redirection après inscription réussie
      window.location.href = '/dashboard.html';
    } else {
      alert('❌ Une erreur s\'est produite lors de l\'inscription.');
    }
  } catch (error) {
    console.error('Erreur réseau :', error);
    alert('❌ Une erreur s\'est produite lors de l\'envoi du formulaire.');
  }
});

