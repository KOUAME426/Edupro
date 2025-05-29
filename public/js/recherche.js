document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-recherche');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const specialite = document.getElementById('specialite').value;
    const qualification = document.getElementById('qualification').value;
    const disponibilite = document.getElementById('disponibilite').value;

    try {
      const response = await fetch('/api/rechercher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialite, qualification, disponibilite })
      });

      const enseignants = await response.json();
      const resultsContainer = document.getElementById('resultats');
      resultsContainer.innerHTML = '';

      if (enseignants.length === 0) {
        resultsContainer.innerHTML = '<p>Aucun enseignant trouvé.</p>';
        return;
      }

      enseignants.forEach(e => {
        const card = document.createElement('div');
        card.className = 'carte';

        // Chemin correct de la photo
        const photoUrl = e.photo ? `/uploads/photos/${e.photo}` : '/img/default-photo.jpg';

        card.innerHTML = `
          <img src="${photoUrl}" alt="Photo" width="120" style="border-radius: 10px; margin-bottom: 10px;">
          <h3>${e.fullname || 'Nom inconnu'}</h3>
          <p><strong>Email:</strong> ${e.email}</p>
          <p><strong>Téléphone:</strong> ${e.telephone}</p>
          <p><strong>Spécialité:</strong> ${e.specialite}</p>
          <p><strong>Qualification:</strong> ${e.qualification}</p>
          <p><strong>Disponibilité:</strong> ${e.disponibilite}</p>
          <button onclick="window.location.href='tel:${e.telephone}'">📞 Appeler</button>
          <button onclick="window.open('https://wa.me/225${e.telephone}')">💬 WhatsApp</button>
        `;
        resultsContainer.appendChild(card);
      });
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      alert("Une erreur est survenue lors de la recherche.");
    }
  });
});

// Fonction de réinitialisation
function reinitialiser() {
  document.getElementById('specialite').value = '';
  document.getElementById('qualification').value = '';
  document.getElementById('disponibilite').value = '';
  document.getElementById('resultats').innerHTML = '';
}
