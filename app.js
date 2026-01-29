const url = "./pdfs/_OceanofPDF.com_Modern_Operating_Systems_5th_Edition_-_Andrew_S_Tanenbaum.pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc ='https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.js';

async function renderPage(pdf, pageNum, canvas){
    
    const page = await pdf.getPage(pageNum);

    const desiredWidth = canvas.clientWidth;
    const unscaled = page.getViewport({ scale: 1 });
    const scale = desiredWidth / unscaled.width;

    const viewport = page.getViewport({ scale });

    const outputScale = window.devicePixelRatio || 1;
    const context = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = "50%";
    canvas.style.height = "auto";

    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    await page.render({canvasContext: context, transform, viewport}).promise;    
    
}

async function main(){
     const loadingTask= pdfjsLib.getDocument(url);
     const pdf = await loadingTask.promise;

     const left = document.getElementById("canvasLeft");
     const right = document.getElementById("canvasRight");

     await renderPage(pdf, 1, left);
     await renderPage(pdf, 2, right);  

     let currentLeft = 1;
     let currentRight = 2;

     const PageStatus = document.getElementById("pageNumber");
     PageStatus.textContent = `Pages ${currentLeft} & ${currentRight} of ${pdf.numPages} Pages`;

     document.getElementById("previous").addEventListener("click", async()=>{
        if (currentLeft > 1) {
            currentRight = currentLeft;
            currentLeft -=1;
            PageStatus.textContent = `Pages ${currentLeft} & ${currentRight} of ${pdf.numPages} Pages`;
            await renderPage(pdf, currentLeft, left);
            await renderPage(pdf, currentRight, right);
        }
     });

     document.getElementById("next").addEventListener("click", async()=>{
        if (currentRight < pdf.numPages){
            currentLeft = currentRight;
            currentRight +=1;
            PageStatus.textContent = `Pages ${currentLeft} & ${currentRight} of ${pdf.numPages} Pages`;
            await renderPage(pdf, currentLeft, left);
            await renderPage(pdf, currentRight, right);
        }
     })

     const InputPageNum = document.getElementById("InputPageNumber");
     

     InputPageNum.addEventListener("keydown", (event)=>{
        const page = InputPageNum.valueAsNumber;
        if (event.key==="Enter"){
            if (page === 1){
                currentLeft=1;
                currentRight=2;
                PageStatus.textContent = `Pages ${currentLeft} & ${currentRight} of ${pdf.numPages} Pages`;
                renderPage(pdf, currentLeft, left);
                renderPage(pdf, currentRight, right);
            } else if (page > 1 && page < pdf.numPages) {
                currentLeft = page;
                currentRight = page+1;
                PageStatus.textContent = `Pages ${currentLeft} & ${currentRight} of ${pdf.numPages} Pages`;
                renderPage(pdf, currentLeft, left);
                renderPage(pdf, currentRight, right);
            }else if (page === pdf.numPages){
                currentRight = pdf.numPages;
                currentLeft = pdf.numPages - 1;
                PageStatus.textContent = `Pages ${currentLeft} & ${currentRight} of ${pdf.numPages} Pages`;
                renderPage(pdf, currentLeft, left);
                renderPage(pdf, currentRight, right);
            }
        }
     });
}
main().catch((e) => console.error(e));
