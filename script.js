document.getElementById("teacherForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
  
    try {
      const response = await fetch("http://localhost:3000/api/inscription", {
        method: "POST",
        body: formData
      });
  
      const result = await response.json();
  
      document.getElementById("message").innerHTML = `
        <p>${result.message}</p>
        <ul>
          <li>Orange Money : 07 12 34 56 78</li>
          <li>MTN Money : 05 98 76 54 32</li>
          <li>WAVE : 01 22 33 44 55</li>
        </ul>
      `;
    } catch (error) {
      document.getElementById("message").innerText = "Erreur lors de l'inscription.";
      console.error(error);
    }
  });
  