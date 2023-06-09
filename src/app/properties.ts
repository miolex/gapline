import {ObjectData, ObjectType} from "../core/object";
import {isColor} from "../core/color";
import {Renderer} from "../core/renderer";

export class PropertiesPanel {
    protected objects: ObjectData[];
    setObjects(objects: ObjectData[]) {
        this.objects = objects;
    }
    protected selectedObject!: ObjectData;
    protected renderer: Renderer;
    protected canvas: HTMLCanvasElement;
    protected objectToMove: ObjectData | null;

    constructor(objects: ObjectData[], renderer: Renderer) {
        this.objects = objects;
        this.renderer = renderer;
    }



    handle(event: MouseEvent) {
        event.preventDefault();

        const { offsetX, offsetY } = event;

        this.selectedObject = this.getTopmostObject(offsetX, offsetY)!;

        if (this.selectedObject) {
            this.showProperties();
        }
    }

    protected closeAllPopups() {
        document.querySelectorAll(".popup").forEach(
            p => document.body.removeChild(p)
        )
    }

    protected showProperties() {
        const objectType = ObjectType[this.selectedObject.type];
        this.closeAllPopups();

        const panelTitle = document.getElementById('panel-title')!;
        panelTitle.innerText = `${objectType}`;

        const parametersList = document.getElementById('parameters-list')!;
        parametersList.innerHTML = '';

        for (const key in this.selectedObject) {
            if (key !== 'type') {
                const parameterContainer = document.createElement('div');
                parameterContainer.className = 'parameter';

                const parameterName = document.createElement('span');
                parameterName.className = 'parameter-name';
                parameterName.innerText = key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();

                const parameterValue = document.createElement('input');
                let type = "string";
                if (typeof (this.selectedObject as any)[key] === "number") {
                    type = "number";
                }

                if (isColor((this.selectedObject as any)[key])) {
                    type = "color";
                }

                parameterValue.type = type;
                parameterValue.min = "0";
                parameterValue.className = 'parameter-value';
                parameterValue.value = (this.selectedObject as any)[key].toString();
                parameterValue.addEventListener('input', () => {
                    (this.selectedObject as any)[key] = parameterValue.type === "number" ? Number(parameterValue.value) : parameterValue.value;
                    this.renderer.redraw(this.objects);
                });

                parameterContainer!.appendChild(parameterName);
                parameterContainer!.appendChild(parameterValue);

                parametersList!.appendChild(parameterContainer);
            }
        }

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
            const index = this.objects.indexOf(this.selectedObject);
            if (index > -1) {
                this.objects.splice(index, 1);
                this.renderer.redraw(this.objects);
                this.closeAllPopups();
                parametersList.innerHTML = "";
                panelTitle.innerText = "OBJECT";
            }
        });

        parametersList!.appendChild(deleteButton);
    }

    protected getTopmostObject(x: number, y: number): ObjectData | null {
        for(let i = this.objects.length - 1; i >= 0; i--) {
            const object = this.objects[i];
            if (i === 0) continue;

            if(this.isPointInsideObject(x, y, object)) {
                return object;
            }
        }

        return null;
    }


    protected isPointInsideObject(x: number, y: number, object: ObjectData): boolean {
        switch (object.type) {
            case ObjectType.RECTANGLE:
                return this.isPointInsideRectangle(x, y, object);
            case ObjectType.CIRCLE:
                return this.isPointInsideCircle(x, y, object);
            case ObjectType.TRIANGLE:
                return this.isPointInsideTriangle(x, y, object);
            case ObjectType.LINE:
                return this.isPointInsideLine(x, y, object);
            default:
                return false;
        }
    }

    protected isPointInsideRectangle(x: number, y: number, object: ObjectData): boolean {
        const { x1, y1, x2, y2 } = object;
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }

    protected isPointInsideCircle(x: number, y: number, object: ObjectData): boolean {
        const x1 = object.x1 - object.x2;
        const y1 = object.y1 - object.y2;
        const radius = Math.sqrt(x1 * x1 + y1 * y1) / 2;

        // Calculate the coordinates of the circle's center
        const centerX = object.x2 + x1 / 2;
        const centerY = object.y2 + y1 / 2;

        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        return distance <= radius;
    }

    protected area(x1, y1, x2, y2, x3, y3)
    {
        return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
    }

    protected isPointInsideTriangle(x: number, y: number, object: ObjectData): boolean {
        const x1 = object.x1;
        const y1 = object.y2;
        const x2 = (object.x1 + object.x2) / 2;
        const y2 = object.y1;
        const x3 = object.x2;
        const y3 = object.y2;

        /* Calculate area of triangle ABC */
        let A = this.area(x1, y1, x2, y2, x3, y3);

        /* Calculate area of triangle PBC */
        let A1 = this.area(x, y, x2, y2, x3, y3);

        /* Calculate area of triangle PAC */
        let A2 = this.area(x1, y1, x, y, x3, y3);

        /* Calculate area of triangle PAB */
        let A3 = this.area(x1, y1, x2, y2, x, y);

        /* Check if sum of A1, A2 and A3 is same as A */
        return (A == A1 + A2 + A3);
    }

    protected isPointInsideLine(x: number, y: number, object: ObjectData): boolean {
        const { x1, y1, x2, y2 } = object;
        const d1 = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        const d2 = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
        const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const buffer = 0.1; // Запасна величина для більш точних обчислень
        return d1 + d2 >= lineLength - buffer && d1 + d2 <= lineLength + buffer;
    }
}
