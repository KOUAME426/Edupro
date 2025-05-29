window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/enseignant-connecte');
    const data = await response.json();

    document.getElementById('fullname').value = data.fullname || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('telephone').value = data.telephone || '';
    document.getElementById('specialite').value = data.specialite || '';
    document.getElementById('qualification').value = data.qualification || '';
    document.getElementById('disponibilite').value = data.disponibilite || '';
    document.getElementById('ville').value = data.ville || '';
    document.getElementById('commune').value = data.commune || '';
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    alert('Erreur de chargement. Veuillez vous reconnecter.');
    window.location.href = 'connexion.html';
  }
});

document.getElementById('modifierForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(document.getElementById('modifierForm'));

  try {
    const response = await fetch('/api/modifier-enseignant', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      alert('Mise à jour réussie.');
      window.location.href = 'dashboard.html';
    } else {
      alert('Erreur lors de la mise à jour.');
    }
  } catch (error) {
    console.error('Erreur de mise à jour :', error);
    alert('Une erreur est survenue.');
  }
});
