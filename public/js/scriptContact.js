document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const data = {
    nom: formData.get('nom'),
    email: formData.get('email'),
    message: formData.get('message')
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      alert('Votre message a été envoyé avec succès.');
      this.reset();
    } else {
      alert('Erreur lors de l’envoi du message.');
    }
  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur réseau.');
  }
});
