import './style.css';
import {dragElement} from "./utils/drag.utils";
import {GraphicEditor} from "./app/editor";

window.addEventListener("load", main);

function main() {
    setUpPanels();
    const editor = new GraphicEditor('canvas');


    document.getElementById("load")!.addEventListener("click", () => {
        document.getElementById("file-input")!.click();
    });

    document.getElementById("save")!.addEventListener("click", () => {
        editor.saveData();
    })

    document.getElementById("export")!.addEventListener("click", () => {
        editor.saveImage();
    })

    document.getElementById("file-input")!.addEventListener("change", (event) => {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files![0];
        const reader = new FileReader();

        reader.onload = (readerEvent) => {
            const jsonData = readerEvent.target!.result as string;
            editor.loadData(jsonData);
        };

        reader.readAsText(file);
    });

}

function setUpPanels() {
    dragElement(document.getElementById("panel-container")!);
    dragElement(document.getElementById("draw-panel-container")!);
    document.getElementById("draw-panel-container")!.style.top = "547px";
}
