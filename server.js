const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 3000;

// ============================= //
// Configuração do Multer (upload de arquivos)
// ============================= //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Diretório onde os vídeos serão armazenados
    const videosDir = path.join(__dirname, "public", "videos");

    // Se o diretório não existir, cria automaticamente
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    // Passa a pasta para o Multer
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    // Adiciona timestamp para garantir que o nome do arquivo seja único
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =============================
// Helpers (funções auxiliares)
// =============================
const DATA_FILE = path.join(__dirname, "videos.json");

// Garante que o arquivo videos.json exista
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

// Função para carregar os vídeos
function loadVideos() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Função para salvar os vídeos no JSON
function saveVideos(videos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2));
}

// =============================
// Middlewares (Configurações Express)
// =============================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// =============================
// Rotas (Endpoints)
// =============================

// Rota de upload de vídeo
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nenhum vídeo enviado." });

  console.log("Arquivo enviado:", req.file);

  let videos = loadVideos();

  const videoData = {
    url: `/videos/${req.file.filename}`,
    title: req.body.title || "Sem título",
    author: req.body.author || "Anônimo",
  };

  videos.push(videoData);

  saveVideos(videos);

  console.log("Vídeo armazenado:", videoData);

  res.status(201).json({
    message: "Vídeo enviado com sucesso!",
    video: videoData,
  });
});

// Rota para listar vídeos
app.get("/videos-list", (req, res) => {
  try {
    const videos = loadVideos();
    res.status(200).json(videos);
  } catch (err) {
    console.error("Erro ao carregar vídeos:", err);
    res.status(500).json({ error: "Erro ao carregar vídeos." });
  }
});

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================= //
// Iniciar servidor
// ============================= //
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
