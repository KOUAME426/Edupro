document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/enseignants-home')
    .then(res => res.json())
    .then(data => {
      const slider = document.getElementById('enseignant-slider');

      data.forEach(ens => {
        const card = document.createElement('div');
        card.className = 'teacher-card';

        // Création du lien cliquable vers enseignant.html?id=...
        card.innerHTML = `
          <a href="enseignant.html?id=${ens._id}" style="text-decoration: none; color: inherit;">
            <img src="${ens.photo}" alt="Photo de ${ens.fullname}" class="slider-photo">
            <div class="slider-info">
              <h3>${ens.fullname}</h3>
              <p><strong>Spécialité:</strong> ${ens.specialite}</p>
              <p><strong>Qualification:</strong> ${ens.qualification}</p>
              <p><strong>Ville:</strong> ${ens.ville}</p>
              <p><em>"Un(e) enseignant(e) remarquable !"</em></p>
            </div>
          </a>
        `;

        slider.appendChild(card);
      });

      // Défilement automatique (optionnel)
      setInterval(() => {
        slider.scrollBy({ left: 270, behavior: 'smooth' });
      }, 3000);
    })
    .catch(err => console.error('Erreur chargement enseignants:', err));
});
