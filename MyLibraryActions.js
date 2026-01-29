const API_BASE = "https://library-api-7br2.onrender.com";

const pdfInput = document.getElementById("pdfInput");
const uploadStatus = document.getElementById("uploadStatus");

async function uploadPdf(file){
    const form = new FormData();
    form.append("pdf",file);

    const res = await fetch(`${API_BASE}/api/books`,{
        method: "POST",
        body: form,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return await res.json();
}
pdfInput.addEventListener("change", async (e)=>{
    const file = e.target.files[0];
    if (!file) return;

    try{
        if (uploadStatus) uploadStatus.textContent = "Uploading...";

        const saved = await uploadPdf(file);

        if (uploadStatus) uploadStatus.textContent = `Uploaded: ${saved.originalName}`;

        const pdfUrl = `${API_BASE}/api/books/${saved.id}/file`;

         const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const canvas = document.getElementById("BookOne");
    await renderCover(pdf, canvas);
        
    } catch (err) {
    console.error(err);
    if (uploadStatus) uploadStatus.textContent = "Upload failed (check console).";
    }
});


const url = "./pdfs/_OceanofPDF.com_Modern_Operating_Systems_5th_Edition_-_Andrew_S_Tanenbaum.pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc ='https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.js';

async function renderCover(pdf, canvas){
    
    const page = await pdf.getPage(1);

    const desiredWidth = canvas.clientWidth;
    const unscaled = page.getViewport({ scale: 1 });
    const scale = desiredWidth / unscaled.width;

    const viewport = page.getViewport({ scale });

    const outputScale = window.devicePixelRatio || 1;
    const context = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = "20%";
    canvas.style.height = "auto";

    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    await page.render({canvasContext: context, transform, viewport}).promise;    
    
}
async function main(){
    const loadingTask= pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;

    const firstBook = document.getElementById("BookOne");
    await renderCover(pdf, firstBook);

    firstBook.addEventListener("click", () =>{
        window.location.href = "InsertPdf.html";
    })
}
main().catch((e) => console.error(e));