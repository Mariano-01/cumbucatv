// =======================
// Toggle Upload
// =======================
function toggleUpload() {
  const uploadBox = document.getElementById("uploadBox");
  uploadBox.classList.toggle("active");
  if (uploadBox.classList.contains("active")) {
    uploadBox.scrollIntoView({ behavior: "smooth" });
  }
}

// =======================
// Modal de Vídeo
// =======================
function abrirVideo(src, titulo, autor) {
  document.getElementById("videoTitle").innerText = titulo;
  document.getElementById("videoAuthor").innerText = autor;

  const video = document.getElementById("videoPlayer");
  video.src = src;

  document.getElementById("videoModal").style.display = "flex";
}

function fecharVideo() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoPlayer");

  modal.style.display = "none";
  video.pause();
  video.src = "";
}

// =======================
// Upload de Vídeos + LocalStorage
// =======================
function uploadVideo() {
  const fileInput = document.getElementById("videoUpload");
  const title = document.getElementById("videoTitleInput").value || "Sem título";
  const author = document.getElementById("videoAuthorInput").value || "Anônimo";

  if (fileInput.files.length === 0) {
    alert("Selecione um vídeo para enviar!");
    return;
  }

  const file = fileInput.files[0];
  const url = URL.createObjectURL(file);

  addVideoCard(url, title, author);

  fileInput.value = "";
  document.getElementById("videoTitleInput").value = "";
  document.getElementById("videoAuthorInput").value = "";
}

// Função para criar card
function addVideoCard(url, title, author) {
  const content = document.querySelector(".content");

  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <div class="thumb" onclick="abrirVideo('${url}', '${title}', '${author}')">
      <video src="${url}" muted></video>
      <div class="info">
        <strong>${title}</strong><br />
        <span>${author}</span>
      </div>
    </div>
    <button class="delete-btn" onclick="deletarVideo(this)">🗑️</button>
  `;

  content.prepend(card);
}

// Deletar vídeo
function deletarVideo(btn) {
  const card = btn.closest(".card");
  if (confirm("Tem certeza que deseja excluir este vídeo?")) {
    card.remove();
  }
}

// =======================
// Renderizar Vídeos
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search input");
  searchInput.addEventListener("keyup", function () {
    const termo = this.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const titulo = card.querySelector("strong").innerText.toLowerCase();
      const autor = card.querySelector("span").innerText.toLowerCase();
      if (titulo.includes(termo) || autor.includes(termo)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});
