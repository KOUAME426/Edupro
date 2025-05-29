document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
  
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone })
      });
  
      const result = await response.json();
  
      const messageDiv = document.getElementById("loginMessage");
      if (result.success) {
        messageDiv.innerHTML = `<p style="color: green">${result.message}</p>`;
        // Redirection ou stockage localStorage si besoin
        // localStorage.setItem("enseignantId", result.enseignantId);
        // window.location.href = "/dashboard.html";
      } else {
        messageDiv.innerHTML = `<p style="color: red">${result.message}</p>`;
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  });
  