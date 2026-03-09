


fetch("https://library-api-7br2.onrender.com/books")
  .then(res => res.json())





const API_BASE = "https://library-api-7br2.onrender.com";



async function uploadPdf() {

    const pdfInput = document.getElementById("pdfInput");
    const uploadStatus = document.getElementById("uploadStatus");

    const file = pdfInput.files[0];
    if (!file) {
        uploadStatus.textContent = "Select a PDF first";
        return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {

        uploadStatus.textContent = "Uploading...";

        const res = await fetch(`${API_BASE}/upload`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        uploadStatus.textContent = "Upload successful";

        console.log(data);

    } catch (err) {

        console.error(err);
        uploadStatus.textContent = "Upload failed";

    }
}

document.addEventListener("DOMContentLoaded", () => {

    let b = document.getElementById("books");

    let titleCard = document.createElement("div");
    titleCard.classList.add("col");
    titleCard.classList.add("title-card");

    titleCard.innerHTML = `
        <h1>Library</h1>
        <img class="img1" src="./images/title-img2.jpg"> </img>
    `;

    b.appendChild(titleCard);

});

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.js";

fetch("https://library-api-7br2.onrender.com/files")
  .then((res) => res.json())
  .then(async (files) => {
    for (const file of files) {
      let b = document.getElementById("books");
      // 1) create a canvas per file (so you don't overwrite BookOne)
      const canvas = document.createElement("canvas");
      canvas.classList.add("col");
      const l = document.createElement("a");
      l.href = "./PdfRender.html?pdf="+ encodeURIComponent(file.url);
      canvas.style.display = "block";
      canvas.style.marginBottom = "8px";
      l.appendChild(canvas);
      

      // 2) create a link
      const link = document.createElement("a");
      link.href = file.url;
      link.textContent = file.key;
      link.target = "_blank";
        


      b.appendChild(l);


    const pdf = await pdfjsLib.getDocument(file.url).promise;
    await renderCover(pdf, canvas);


     
    }
    let b = document.getElementById("books");
    let fileinput = document.createElement('div');
    fileinput.classList.add('col');
    fileinput.classList.add('fileinput-content');
    fileinput.innerHTML=`
      <div class="upload-content">

        <p id="uploadStatus">Upload Status</p>
        <input id="pdfInput" type="file" accept="application/pdf" />
        <button onclick="uploadPdf()">Upload</button>

      </div>
    `
    b.appendChild(fileinput);
  }
    
  )
  .catch((err) => console.error("Failed to load files:", err));

 
  

async function renderCover(pdf, canvas) {
  const page = await pdf.getPage(1);

  // fallback width if canvas isn't styled yet
  const desiredWidth = canvas.clientWidth || 300;

  const unscaled = page.getViewport({ scale: 1 });
  const scale = desiredWidth / unscaled.width;
  const viewport = page.getViewport({ scale });

  const outputScale = window.devicePixelRatio || 1;
  const context = canvas.getContext("2d");

  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = `${Math.floor(viewport.width)}px`;
  canvas.style.height = "auto";

  const transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

  await page.render({ canvasContext: context, transform, viewport }).promise;
}


















/*



*/
