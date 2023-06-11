import {ObjectData, ObjectType} from "../core/types/object";
import {isColor} from "../core/types/color";
import {Renderer} from "../core/render/renderer";
import {HitUtil} from "../utils/hit.util";

export class PropertiesPanel {
    protected objects: ObjectData[];
    protected selectedObject: ObjectData | null;
    protected renderer: Renderer;
    protected parametersList: HTMLDivElement;
    protected panelTitle: HTMLDivElement;
    protected static parametersList = [
        "x1",
        "y1",
        "x2",
        "y2",
        "lineWidth",
        "pathColor",
        "fillColor"
    ];

    constructor(objects: ObjectData[], renderer: Renderer) {
        this.objects = objects;
        this.renderer = renderer;
        this.selectedObject = null;
        this.parametersList = document.getElementById('parameters-list')! as HTMLDivElement;
        this.panelTitle = document.getElementById('panel-title')! as HTMLDivElement;
    }

    handleSelect(event: MouseEvent) {
        event.preventDefault();

        const { offsetX, offsetY } = event;
        this.selectedObject = this.getTopmostObject(offsetX, offsetY)!;

        if (this.selectedObject) {
            this.showProperties();
        }
    }

    protected showProperties() {
        if (this.selectedObject === null) { return; }

        this.panelTitle.innerText = `${ObjectType[this.selectedObject.type]}`;
        this.parametersList.innerHTML = '';
        PropertiesPanel.parametersList.forEach((p) => this.addProperty(p));
        this.addDeleteButton();
    }

    protected addProperty(key: string) {
        if (key === 'type') { return; }

        const parameterContainer = document.createElement('div');
        parameterContainer.className = 'parameter';

        const parameterName = document.createElement('span');
        parameterName.className = 'parameter-name';
        parameterName.innerText = this.getParameterName(key);

        const parameterValue = document.createElement('input');
        parameterValue.type = this.getParameterType(key);
        parameterValue.min = "0";
        parameterValue.className = 'parameter-value';
        parameterValue.value = (this.selectedObject as any)[key].toString();
        parameterValue.addEventListener('input', (e) => this.updateParameter(e, key));

        parameterContainer.appendChild(parameterName);
        parameterContainer.appendChild(parameterValue);
        this.parametersList.appendChild(parameterContainer);
    }

    protected addDeleteButton() {
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', this.deleteObject.bind(this));
        this.parametersList.appendChild(deleteButton);
    }

    protected deleteObject() {
        if (this.selectedObject === null) { return; }

        const index = this.objects.indexOf(this.selectedObject);
        if (index > -1) {
            this.objects.splice(index, 1);
            this.renderer.redraw(this.objects);
            this.parametersList.innerHTML = "";
            this.panelTitle.innerText = "OBJECT";
        }
    }

    protected getTopmostObject(x: number, y: number): ObjectData | null {
        for(let i = this.objects.length - 1; i >= 0; i--) {
            const object = this.objects[i];
            if (i === 0) continue;

            if(HitUtil.isPointInsideObject(x, y, object)) {
                return object;
            }
        }
        return null;
    }

    protected getParameterName(param: string): string {
        switch (param) {
            case "x1":
                return "X1";
            case "x2":
                return "X2";
            case "y1":
                return "Y1";
            case "y2":
                return "Y2";
            case "lineWidth":
                return "Line Width";
            case "pathColor":
                return "Path Color";
            case "fillColor":
                return "Fill Color";
            default:
                return param;
        }
    }

    protected getParameterType(param: string): string {
        let type = "string";

        if (typeof (this.selectedObject as any)[param] === "number") {
            type = "number";
        }

        if (isColor((this.selectedObject as any)[param])) {
            type = "color";
        }

        return type;
    }

    protected updateParameter(event: Event, key: string) {
        (this.selectedObject as any)[key] = (event.target as HTMLInputElement).value;
        this.renderer.redraw(this.objects);
    }
}
