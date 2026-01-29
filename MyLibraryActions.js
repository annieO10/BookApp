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