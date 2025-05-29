window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/enseignant-connecte');
    if (!response.ok) {
      window.location.href = '/connexion.html';
      return;
    }

    const data = await response.json();

    document.getElementById('fullname').textContent = data.fullname;
    document.getElementById('email').textContent = data.email;
    document.getElementById('telephone').textContent = data.telephone;
    document.getElementById('specialite').textContent = data.specialite;
    document.getElementById('qualification').textContent = data.qualification;
    document.getElementById('disponibilite').textContent = data.disponibilite;
    document.getElementById('ville').textContent = data.ville || '';
    document.getElementById('commune').textContent = data.commune || '';

    document.getElementById('photo').src = data.photo.startsWith('uploads/')
      ? '/' + data.photo
      : data.photo;

    document.getElementById('cv').href = `/${data.cv}`;

    // ✅ Redirection vers la page modifier
    document.getElementById('modifierBtn').addEventListener('click', () => {
      window.location.href = `modifier.html?id=${data._id}`;
    });
  } catch (error) {
    console.error('Erreur lors du chargement du tableau de bord :', error);
  }

  // ✅ Déconnexion
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/deconnexion', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.message === 'Déconnecté') {
        window.location.href = 'connexion.html';
      } else {
        alert('Échec de la déconnexion.');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  });
});
document.getElementById('btnSupprimer').addEventListener('click', async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
    try {
      const response = await fetch('/api/supprimer-compte', {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Votre compte a été supprimé.');
        window.location.href = '/index.html';
      } else {
        alert('❌ Erreur lors de la suppression.');
      }
    } catch (err) {
      console.error('Erreur suppression compte :', err);
      alert('❌ Erreur serveur.');
    }
  }
});
