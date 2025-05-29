document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    alert('Aucun enseignant sélectionné');
    window.location.href = 'index.html';
    return;
  }

  fetch(`/api/enseignant/${id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('photo').src = data.photo;
      document.getElementById('fullname').textContent = data.fullname;
      document.getElementById('specialite').textContent = data.specialite;
      document.getElementById('qualification').textContent = data.qualification;
      document.getElementById('ville').textContent = data.ville;
      document.getElementById('commune').textContent = data.commune;
      document.getElementById('disponibilite').textContent = data.disponibilite;

     document.getElementById('cv').href = `/${data.cv}`;
      document.getElementById('whatsapp-button').href = `https://wa.me/${data.telephone}`;
    })
    // Ajouter le lien vers le CV
      const cvLink = document.getElementById('cv-link');
      if (enseignant.cv) {
        cvLink.href = enseignant.cv;
        cvLink.style.display = 'inline-block';
      } else {
        cvLink.style.display = 'none';
      }
    })
    .catch(err => {
      ("CV path reçu :", enseignant.cv);
      alert('Erreur lors du chargement des données.');
    });
