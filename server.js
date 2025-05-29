const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
const app = express();
const PORT = 3000;

// Connexion MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/coursdomicile", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur MongoDB :"));
db.once("open", () => {
  console.log("✅ Connecté à MongoDB");
});


// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Session
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('public', {
  maxAge: '7d' // cache pendant 7 jours
}));

// Schéma Mongoose
const EnseignantSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  telephone: String,
  qualification: String,
  specialite: String,
  disponibilite: String,
  ville: String,            // 🔹 ajouté
  commune: String,          // 🔹 ajouté
  cv: String,
  photo: String,
});
const Enseignant = mongoose.model("Enseignant", EnseignantSchema);

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.fieldname === "cv" ? "uploads/cv" : "uploads/photos";
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// ✅ ROUTE : Inscription (avec session et redirection)
app.post('/inscription', upload.fields([{ name: 'cv' }, { name: 'photo' }]), async (req, res) => {
  const { fullname, email, telephone, qualification, specialite, disponibilite, ville, commune, paiementEffectue } = req.body;

  // Vérification du paiement Wave
  if (paiementEffectue !== 'true') {
    return res.status(400).send('❌ Paiement non effectué. Veuillez payer avant de vous inscrire.');
  }

  try {
    // 🔁 Remplacement des backslashes \ par des slashes /
    const cvPath = req.files['cv'][0].path.replace(/\\/g, '/');
    const photoPath = req.files['photo'][0].path.replace(/\\/g, '/');

    const enseignant = new Enseignant({
      fullname,
      email,
      telephone,
      qualification,
      specialite,
      disponibilite,
      ville,           // 🔹 ajouté
      commune,         // 🔹 ajouté
      cv: cvPath,
      photo: photoPath
    });

    await enseignant.save();

    req.session.user = {
      email: enseignant.email,
      telephone: enseignant.telephone
    };
    req.session.userId = enseignant._id; // ✅ Ajouté

    res.redirect('/dashboard.html');
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de l'inscription.");
  }
});

// ✅ Connexion
app.post('/api/connexion', async (req, res) => {
  const { email, telephone } = req.body;

  try {
    const enseignant = await Enseignant.findOne({ email, telephone });

    if (!enseignant) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    req.session.user = {
      email: enseignant.email,
      telephone: enseignant.telephone
    };
    req.session.userId = enseignant._id; // ✅ Ajouté
    
    res.json({ message: "Connexion réussie" });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
});

// ✅ Route pour récupérer l’enseignant connecté
app.get('/api/enseignant-connecte', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Non connecté" });
  }

  const enseignant = await Enseignant.findOne({
    email: req.session.user.email,
    telephone: req.session.user.telephone
  });

  if (!enseignant) {
    return res.status(404).json({ message: "Enseignant non trouvé" });
  }

  res.json(enseignant);
});

// ✅ Recherche
app.get('/api/rechercher', async (req, res) => {
  const { specialite, qualification, disponibilite, ville, commune } = req.query;

  const filtre = {};
  if (specialite) filtre.specialite = specialite;
  if (qualification) filtre.qualification = qualification;
  if (disponibilite) filtre.disponibilite = disponibilite;
  if (ville) filtre.ville = ville;
  if (commune) filtre.commune = commune;

  try {
    const enseignants = await Enseignant.find(filtre);
    res.json(enseignants);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la recherche" });
  }
});

app.post('/api/deconnexion', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    }
    res.json({ message: 'Déconnecté' });
  });
});

app.post('/api/supprimer-compte', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Non connecté" });
  }

  try {
    const result = await Enseignant.deleteOne({
      email: req.session.user.email,
      telephone: req.session.user.telephone
    });

    req.session.destroy(); // Déconnexion

    if (result.deletedCount === 1) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Aucun compte supprimé" });
    }
  } catch (error) {
    console.error("Erreur suppression compte :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

const Message = require('./models/Message'); // Assure-toi que le chemin est bon

app.post('/api/contact', async (req, res) => {
  const { nom, email, message } = req.body;

  try {
    await Message.create({ nom, email, message });
    console.log('Message enregistré avec succès');
    res.status(200).send('Message enregistré avec succès');
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du message:', err);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/api/enseignants-home', async (req, res) => {
  try {
    const enseignants = await Enseignant.aggregate([
      { $sample: { size: 5 } },
      {
        $project: {
          _id: 1,
          fullname: 1,
          specialite: 1,
          qualification: 1,
          ville: 1,
          photo: 1
        }
      }
    ]);
    res.json(enseignants);
  } catch (err) {
    console.error('Erreur lors du chargement des enseignants pour l’accueil:', err);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/api/enseignant/:id', async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    if (!enseignant) return res.status(404).send('Enseignant introuvable');
    res.json(enseignant);
  } catch (err) {
    console.error('Erreur API enseignant:', err);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/api/modifier-enseignant', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  try {
    const updateData = {
      fullname: req.body.fullname,
      email: req.body.email,
      telephone: req.body.telephone,
      specialite: req.body.specialite,
      qualification: req.body.qualification,
      disponibilite: req.body.disponibilite,
      ville: req.body.ville,
      commune: req.body.commune
    };

    if (req.files['photo']) {
      updateData.photo = req.files['photo'][0].path;
    }

    if (req.files['cv']) {
      updateData.cv = req.files['cv'][0].path;
    }

    await Enseignant.findByIdAndUpdate(req.session.userId, updateData);

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour :', error);
    res.status(500).json({ success: false });
  }
});


// 🔥 Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
