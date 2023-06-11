import {ObjectType} from "../core/types/object";
import {Settings} from "../core/types/settings";

export class SettingsPanel {
    onBackgroundColorUpdate: CallableFunction = () => {};
    protected settings: Settings;
    protected settingsPanelContainer: HTMLDivElement;
    protected parametersList: HTMLDivElement;
    protected shapeSelect: HTMLSelectElement;
    protected lineWidthInput: HTMLInputElement;
    protected fillColorInput: HTMLInputElement;
    protected pathColorInput: HTMLInputElement;
    protected backgroundColorInput: HTMLInputElement;

    constructor(settings: Settings) {
        this.settings = settings;
        this.init();
    }

    protected init() {
        this.settingsPanelContainer = document.getElementById("settings-panel-container")! as HTMLDivElement;
        this.initParametersList();
        this.initShapeSelector();
        this.initLineWidthInput();
        this.initFillColorInput();
        this.initPathColorInput();
        this.initBackgroundColorInput();
        this.settingsPanelContainer.appendChild(this.parametersList);

        this.initListeners();
    }

    protected initParametersList() {
        this.parametersList = document.createElement("div");
        this.parametersList.classList.add("parameters-list");
    }

    protected initShapeSelector() {
        const shapeLabel = document.createElement("label");
        shapeLabel.textContent = "Shape";

        this.shapeSelect = document.createElement("select");
        this.shapeSelect.id = "shape-select";

        const optionRect = document.createElement("option");
        optionRect.value = ObjectType.RECTANGLE.toString();
        optionRect.textContent = "Rectangle";
        this.shapeSelect.appendChild(optionRect);

        const optionCircle = document.createElement("option");
        optionCircle.value = ObjectType.CIRCLE.toString();
        optionCircle.textContent = "Circle";
        this.shapeSelect.appendChild(optionCircle);

        const optionTriangle = document.createElement("option");
        optionTriangle.value = ObjectType.TRIANGLE.toString();
        optionTriangle.textContent = "Triangle";
        this.shapeSelect.appendChild(optionTriangle);

        const optionLine = document.createElement("option");
        optionLine.value = ObjectType.LINE.toString();
        optionLine.textContent = "Line";
        this.shapeSelect.appendChild(optionLine);

        this.parametersList.appendChild(shapeLabel);
        this.parametersList.appendChild(this.shapeSelect);
    }

    protected initLineWidthInput() {
        const lineWidthLabel = document.createElement("label");
        lineWidthLabel.textContent = "Line Width";

        const lineWidthValue = document.createElement("span");
        lineWidthValue.textContent = "10";
        lineWidthValue.style.fontWeight = "bold";

        this.lineWidthInput = document.createElement("input");
        this.lineWidthInput.type = "range";
        this.lineWidthInput.min = "0";
        this.lineWidthInput.max = "100";
        this.lineWidthInput.value = this.settings.lineWidth.toString();
        this.lineWidthInput.oninput = () => lineWidthValue.textContent = this.lineWidthInput.value.toString();
        lineWidthValue.textContent = this.lineWidthInput.value.toString();

        this.parametersList.appendChild(lineWidthLabel);
        this.parametersList.appendChild(this.lineWidthInput);
        this.parametersList.appendChild(lineWidthValue);
    }

    protected initFillColorInput() {
        const fillColorLabel = document.createElement("label");
        fillColorLabel.textContent = "Fill Color: ";

        this.fillColorInput = document.createElement("input");
        this.fillColorInput.type = "color";
        this.fillColorInput.value = this.settings.fillColor.toString();

        this.parametersList.appendChild(fillColorLabel);
        this.parametersList.appendChild(this.fillColorInput);
    }

    protected initPathColorInput() {
        const pathColorLabel = document.createElement("label");
        pathColorLabel.textContent = "Path Color: ";

        this.pathColorInput = document.createElement("input");
        this.pathColorInput.type = "color";
        this.pathColorInput.value = this.settings.pathColor.toString();

        this.parametersList.appendChild(pathColorLabel);
        this.parametersList.appendChild(this.pathColorInput);
    }

    protected initBackgroundColorInput() {
        const bgColorLabel = document.createElement("label");
        bgColorLabel.textContent = "Background Color: ";

        this.backgroundColorInput = document.createElement("input");
        this.backgroundColorInput.type = "color";
        this.backgroundColorInput.value = this.settings.backgroundColor.toString();

        this.parametersList.appendChild(bgColorLabel);
        this.parametersList.appendChild(this.backgroundColorInput);
    }

    protected initListeners() {
        this.shapeSelect.addEventListener("change", (event) => {
            this.settings.type = Number((event.target as HTMLSelectElement).value);
        });

        this.lineWidthInput.addEventListener("input", (event) => {
            this.settings.lineWidth = Number((event.target as HTMLInputElement).value);
        });

        this.fillColorInput.addEventListener("input", (event) => {
            this.settings.fillColor = (event.target as HTMLInputElement).value;
        });

        this.pathColorInput.addEventListener("input", (event) => {
            this.settings.pathColor = (event.target as HTMLInputElement).value;
        });

        this.backgroundColorInput.addEventListener("input", (event) => {
            this.settings.backgroundColor = (event.target as HTMLInputElement).value;
            this.onBackgroundColorUpdate();
        });
    }
}
