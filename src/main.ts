import './style.css';
import {dragElement} from "./utils/drag.utils";
import {App} from "./app/app";

window.addEventListener("load", main);

function main() {
    new App();
}

function setUpPanels() {
    dragElement(document.getElementById("panel-container")!);
    dragElement(document.getElementById("settings-panel-container")!);
    document.getElementById("settings-panel-container")!.style.top = "547px";
}
