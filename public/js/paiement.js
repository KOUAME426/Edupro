function payer() {
    const form = document.getElementById('teacherForm');
    const formData = new FormData(form);
    const montant = 1000; // à adapter
  
    CinetPay.setConfig({
      apikey: '701242060681a86de35f6f4.22006332', // à remplacer par votre clé API
      site_id: '105894344', // à remplacer par votre ID site
      notify_url: 'http://localhost:3000/api/notify',
      mode: 'PRODUCTION'
    });
  
    const transaction_id = Math.floor(Math.random() * 1000000000);
  
    CinetPay.getCheckout({
      transaction_id: transaction_id.toString(),
      amount: montant,
      currency: 'XOF',
      channels: 'ALL',
      description: 'Paiement inscription enseignant'
    });
  
    CinetPay.waitResponse(function(data) {
      if (data.status === "ACCEPTED") {
        fetch('/api/inscription', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(res => {
          document.getElementById("message").textContent = res.message;
          if (res.redirect) window.location.href = res.redirect;
        })
        .catch(() => {
          document.getElementById("message").textContent = "Erreur lors de l'inscription.";
        });
      } else {
        document.getElementById("message").textContent = "Paiement refusé.";
      }
    });
  
    CinetPay.onError(function(err) {
      console.error(err);
      document.getElementById("message").textContent = "Erreur pendant le paiement.";
    });
  }
  