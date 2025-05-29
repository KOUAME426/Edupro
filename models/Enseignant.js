const mongoose = require('mongoose');

const enseignantSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  telephone: String,
  specialite: String,
  qualification: String,
  disponibilite: String,
  photo: String,
  cv: String
});

// ✅ Si le modèle existe déjà, on le réutilise. Sinon on le crée.
module.exports = mongoose.models.Enseignant || mongoose.model('Enseignant', enseignantSchema);
