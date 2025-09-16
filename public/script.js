// =======================
// Toggle Upload
// =======================
function toggleUpload() {
  const uploadBox = document.getElementById("uploadBox");

  // Alterna a classe "active" para mostrar/ocultar o upload
  uploadBox.classList.toggle("active");

  // Se a caixa de upload for visível, faz o scroll suave para ela
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

// Função para fazer o upload do vídeo para o servidor
function uploadVideo() {
  const fileInput = document.getElementById("videoUpload");
  const title = document.getElementById("videoTitleInput").value || "Sem título";
  const author = document.getElementById("videoAuthorInput").value || "Anônimo";

  if (fileInput.files.length === 0) {
    alert("Selecione um vídeo para enviar!");
    return;
  }

  const file = fileInput.files[0];

  // Criando o FormData para enviar o arquivo e os dados
  const formData = new FormData();
  formData.append("video", file);
  formData.append("title", title);
  formData.append("author", author);

  // Enviar o vídeo para o servidor
  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log("Vídeo enviado com sucesso:", data);
      addVideoCard(data.url, data.title, data.author);  // Atualiza o card com os dados do servidor
    })
    .catch(error => {
      console.error("Erro ao enviar vídeo:", error);
    });

  // Limpar os campos após o upload
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
    <button class="delete-btn" onclick="deletarVideo(this)">
      <img src="https://www.svgrepo.com/show/380116/trash-delete-bin.svg" class="lixeira">
    </button>
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

// Carregar a lista de vídeos ao carregar a página
function loadVideos() {
  fetch("/videos-list")
    .then(response => response.json())
    .then(videos => {
      const content = document.querySelector(".content");
      content.innerHTML = "";  // Limpa a lista de vídeos

      videos.forEach(video => {
        addVideoCard(video.url, video.title, video.author);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar vídeos:", error);
    });
}

// Chama a função para carregar os vídeos quando a página carregar
document.addEventListener("DOMContentLoaded", loadVideos);

