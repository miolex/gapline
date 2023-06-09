import {ObjectType} from "../core/object";
import {Color} from "../core/color";

export interface Settings {
    type: ObjectType;
    fillColor:  string | CanvasGradient | CanvasPattern;
    pathColor:  string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    backgroundColor: Color
}

export class SettingsPanel {
    settings: Settings;
    onBackgroundColorUpdate: CallableFunction = ()=>{};

    constructor() {
        this.settings = {
            type: ObjectType.RECTANGLE,
            fillColor: "#ff0000",
            pathColor: "#000000",
            lineWidth: 5,
            backgroundColor: "#eeeeee"
        };
        this.init();
    }

    protected init() {
        const drawPanelContainer = document.getElementById("draw-panel-container");

        const parametersList = document.createElement("div");
        parametersList.classList.add("parameters-list");

        // Create shape selector
        const shapeLabel = document.createElement("label");
        shapeLabel.textContent = "Shape: ";
        const shapeSelect = document.createElement("select");
        shapeSelect.id = "shape-select";
        const optionRect = document.createElement("option");
        optionRect.value = ObjectType.RECTANGLE.toString();
        optionRect.textContent = "Rectangle";
        shapeSelect.appendChild(optionRect);
        const optionCircle = document.createElement("option");
        optionCircle.value = ObjectType.CIRCLE.toString();
        optionCircle.textContent = "Circle";
        shapeSelect.appendChild(optionCircle);
        const optionTriangle = document.createElement("option");
        optionTriangle.value = ObjectType.TRIANGLE.toString();
        optionTriangle.textContent = "Triangle";
        shapeSelect.appendChild(optionTriangle);
        const optionLine = document.createElement("option");
        optionLine.value = ObjectType.LINE.toString();
        optionLine.textContent = "Line";
        shapeSelect.appendChild(optionLine);
        parametersList.appendChild(shapeLabel);
        parametersList.appendChild(shapeSelect);


        // Create lineWidth input
        const lineWidthLabel = document.createElement("label");
        lineWidthLabel.textContent = "Line Width: ";
        const lineWidthInput = document.createElement("input");
        lineWidthInput.type = "number";
        lineWidthInput.min = "0";
        lineWidthInput.value = this.settings.lineWidth.toString();
        parametersList.appendChild(lineWidthLabel);
        parametersList.appendChild(lineWidthInput);

        // Create fill color input
        const fillColorLabel = document.createElement("label");
        fillColorLabel.textContent = "Fill Color: ";
        const fillColorInput = document.createElement("input");
        fillColorInput.type = "color";
        fillColorInput.value = this.settings.fillColor.toString();
        parametersList.appendChild(fillColorLabel);
        parametersList.appendChild(fillColorInput);

        // Create path color input
        const pathColorLabel = document.createElement("label");
        pathColorLabel.textContent = "Path Color: ";
        const pathColorInput = document.createElement("input");
        pathColorInput.type = "color";
        pathColorInput.value = this.settings.pathColor.toString();
        parametersList.appendChild(pathColorLabel);
        parametersList.appendChild(pathColorInput);
        drawPanelContainer!.appendChild(parametersList);

        // Create bg color input
        const bgColorLabel = document.createElement("label");
        bgColorLabel.textContent = "Background Color: ";
        const bgColorInput = document.createElement("input");
        bgColorInput.type = "color";
        bgColorInput.value = this.settings.backgroundColor.toString();
        parametersList.appendChild(bgColorLabel);
        parametersList.appendChild(bgColorInput);
        drawPanelContainer!.appendChild(parametersList);

        shapeSelect.addEventListener("change", (event) => {
            const selectedShape = Number((event.target as HTMLSelectElement).value);
            this.settings.type = selectedShape;
        });

        lineWidthInput.addEventListener("input", (event) => {
            const lineWidth = Number((event.target as HTMLInputElement).value);
            this.settings.lineWidth = lineWidth;
        });

        fillColorInput.addEventListener("input", (event) => {
            const fillColor = (event.target as HTMLInputElement).value;
            this.settings.fillColor = fillColor;
        });

        pathColorInput.addEventListener("input", (event) => {
            const pathColor = (event.target as HTMLInputElement).value;
            this.settings.pathColor = pathColor;
        });

        bgColorInput.addEventListener("input", (event) => {
            const bgColor = (event.target as HTMLInputElement).value;
            this.settings.backgroundColor = bgColor;
            this.onBackgroundColorUpdate();
        });
    }
}
