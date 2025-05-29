window.addEventListener('DOMContentLoaded', () => {
  rechercherEnseignants(); // Affiche tous les enseignants au chargement
});

async function rechercherEnseignants() {
  const specialite = document.getElementById("specialite")?.value || '';
  const qualification = document.getElementById("qualification")?.value || '';
  const disponibilite = document.getElementById("disponibilite")?.value || '';
  const ville = document.getElementById("ville")?.value || '';
  const commune = document.getElementById("commune")?.value || '';

  const params = new URLSearchParams();

  if (specialite) params.append("specialite", specialite);
  if (qualification) params.append("qualification", qualification);
  if (disponibilite) params.append("disponibilite", disponibilite);
  if (ville) params.append("ville", ville);
  if (commune) params.append("commune", commune);

  try {
    const response = await fetch(`/api/rechercher?${params.toString()}`);
    const data = await response.json();
    afficherEnseignants(data);
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
  }
}

function afficherEnseignants(enseignants) {
  const liste = document.getElementById("resultats");
  liste.innerHTML = "";

  if (!enseignants.length) {
    liste.innerHTML = "<p>Aucun enseignant trouvé.</p>";
    return;
  }

  enseignants.forEach(ens => {
    const div = document.createElement("div");
    div.className = "carte";

    div.innerHTML = `
  <img src="/${ens.photo}" alt="Photo" width="100">
  <p><strong>Nom:</strong> ${ens.fullname}</p>
  <p><strong>Email:</strong> ${ens.email}</p>
  <p><strong>Téléphone:</strong> ${ens.telephone}</p>
  <p><strong>Spécialité:</strong> ${ens.specialite}</p>
  <p><strong>Qualification:</strong> ${ens.qualification}</p>
  <p><strong>Disponibilité:</strong> ${ens.disponibilite}</p>
  <p><strong>Ville:</strong> ${ens.ville || ''}</p>
  <p><strong>Commune:</strong> ${ens.commune || ''}</p>
  <P> ${ens.cv ? `<a href="${ens.cv}" target="_blank" class="btn">Télécharger CV</a>` : `<p>CV non disponible</p>`}</P>
  <a href="tel:${ens.telephone}" class="btn">Appeler</a>
  <a href="https://wa.me/225${ens.telephone}" target="_blank" class="btn">WhatsApp</a>
`;

    liste.appendChild(div);
  });
}

function reinitialiserFiltres() {
  const champs = ["specialite", "qualification", "disponibilite", "ville", "commune"];
  champs.forEach(id => {
    const champ = document.getElementById(id);
    if (champ) champ.value = "";
  });

  rechercherEnseignants(); // Recharge tous les enseignants
}
