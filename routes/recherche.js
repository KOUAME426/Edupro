const express = require('express');
const router = express.Router();
const Enseignant = require('../models/Enseignant'); // Assure-toi que le chemin est correct

router.post('/rechercher', async (req, res) => {
  const { specialite, qualification, disponibilite } = req.body;

  try {
    const query = {};

    if (specialite && specialite.trim() !== '') query.specialite = specialite;
    if (qualification && qualification.trim() !== '') query.qualification = qualification;
    if (disponibilite && disponibilite.trim() !== '') query.disponibilite = disponibilite;

    const resultats = await Enseignant.find(query);
    res.json(resultats);
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    res.status(500).json({ message: "Erreur lors de la recherche." });
  }
});

module.exports = router;
