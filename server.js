const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 3000;

// =============================
// Config do Multer (upload)
// =============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "videos"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// =============================
// Helpers
// =============================
const DATA_FILE = path.join(__dirname, "videos.json");

// garante que videos.json existe
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

function loadVideos() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveVideos(videos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2));
}

// =============================
// Middlewares
// =============================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// =============================
// Rotas
// =============================

// upload
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).send("Nenhum vídeo enviado.");

  let videos = loadVideos();

  const videoData = {
    url: `/videos/${req.file.filename}`,
    title: req.body.title || "Sem título",
    author: req.body.author || "Anônimo"
  };

  videos.push(videoData);
  saveVideos(videos);

  res.json(videoData);
});

// listar vídeos
app.get("/videos-list", (req, res) => {
  const videos = loadVideos();
  res.json(videos);
});

// rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =============================
// Start server
// =============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
