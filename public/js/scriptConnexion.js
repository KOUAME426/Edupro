document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const telephone = document.querySelector('#telephone').value;

  try {
    const response = await fetch('/api/connexion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, telephone })
    });

    const result = await response.json();

    if (response.ok) {
      // ✅ Stocke les données dans localStorage
      localStorage.setItem('enseignant', JSON.stringify(result.enseignant));
      // Redirige vers le dashboard
      window.location.href = '/dashboard.html';
    } else {
      alert(result.message || "Erreur de connexion.");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau ou serveur.");
  }
});
