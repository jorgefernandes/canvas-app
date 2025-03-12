import PinchZoom from 'pinch-zoom-js/src/pinch-zoom.js'
import { setSpinner } from './useSpinner.js';
import {removeNodeChildren} from "./removeNodeChildren.js";
function init(pdfData, pdfDataWrapper) {
    setSpinner(true);
    
    pdfjsLib.getDocument({ data: atob(pdfData.split(",")[1])}).promise.then(function(pdf) {
        var container = document.getElementById(pdfDataWrapper);

        removeNodeChildren(container);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(function(page) {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                var viewport = page.getViewport({ scale: .50 });

                var scaleFactor = window.devicePixelRatio || 2;
                var highQualityViewport = page.getViewport({ scale: 0.55 * scaleFactor });

                canvas.width = highQualityViewport.width;
                canvas.height = highQualityViewport.height;

                canvas.style.width = viewport.width + "px";
                canvas.style.height = viewport.height + "px";

                var renderContext = { canvasContext: context, viewport: highQualityViewport };
                page.render(renderContext);
                container.appendChild(canvas);
            });
        }

        setTimeout(() => {
            setSpinner(false);
            new PinchZoom(document.getElementById(pdfDataWrapper), {
                useMouseWheel: true
            });
        }, 100)
    });
}

export default  {
    init: init
}
