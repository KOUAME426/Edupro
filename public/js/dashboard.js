window.addEventListener('DOMContentLoaded', () => {
    const enseignant = JSON.parse(localStorage.getItem('enseignant'));
  
    if (!enseignant) {
      // Redirige si pas connecté
      window.location.href = '/connexion.html';
      return;
    }
  
    // Remplir les champs du dashboard
    document.getElementById('nom').textContent = enseignant.nom;
    document.getElementById('email').textContent = enseignant.email;
    document.getElementById('telephone').textContent = enseignant.telephone;
    document.getElementById('specialite').textContent = enseignant.specialite || 'Non précisée';
    document.getElementById('qualification').textContent = enseignant.qualification || 'Non précisée';
    document.getElementById('disponibilite').textContent = enseignant.disponibilite || 'Non précisée';
    document.getElementById("ville").textContent = data.ville || '';
    document.getElementById("commune").textContent = data.commune || '';

    if (enseignant.cv) {
      document.getElementById('cv').href = `/uploads/cv/${enseignant.cv}`;
      document.getElementById('cv').textContent = 'Voir le CV';
    }
  
    if (enseignant.photo) {
      document.getElementById('photo').src = `/uploads/photos/${enseignant.photo}`;
      document.getElementById('photo').alt = 'Photo de profil';
    }
  });
  