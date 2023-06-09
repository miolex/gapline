import {ObjectData, ObjectType} from "../core/object";
import {SettingsPanel} from "./settings";
import {Renderer} from "../core/renderer";
import {PropertiesPanel} from "./properties";

export class GraphicEditor {
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    settingsPanel: SettingsPanel;
    propertiesPanel: PropertiesPanel;
    objects: ObjectData[];
    drawingObject: any;

    constructor(canvasId: string) {
        this.objects = [];
        this.canvas = document.getElementById(canvasId)! as HTMLCanvasElement;
        this.settingsPanel = new SettingsPanel();
        this.renderer = new Renderer(
            this.canvas.getContext('2d')!,
            this.canvas
        );
        this.propertiesPanel = new PropertiesPanel(this.objects, this.renderer);
        this.settingsPanel.onBackgroundColorUpdate = () => {
            if (!this.objects[0] ||
                this.objects[0].y2 !== this.canvas.height ||
                this.objects[0].x2 !== this.canvas.width
            ) {
                return
            }
            this.objects[0].fillColor = this.settingsPanel.settings.backgroundColor;
            this.renderer.redraw(this.objects);
        }
        this.canvas.addEventListener('pointerdown', this.startDrawing.bind(this));
        this.canvas.addEventListener('pointerup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('pointermove', this.onDrawing.bind(this));
        this.canvas.addEventListener('contextmenu', this.propertiesPanel.handle.bind(this.propertiesPanel));

        this.objects.unshift({
            type: ObjectType.RECTANGLE,
            fillColor: this.settingsPanel.settings.backgroundColor,
            pathColor: "#000000",
            x1: 0,
            lineWidth: 0,
            y2: this.canvas.height,
            x2: this.canvas.width,
            y1: 0
        })
        this.renderer.redraw(this.objects)


        document.getElementById("clear")!.addEventListener(
            "click",
            () => {
                this.objects = [];
                this.renderer.redraw(this.objects);
            }
        );
    }

    startDrawing(event: PointerEvent) {
        event.preventDefault();

        if (event.button !== 0) return;

        const { offsetX, offsetY } = event;

        this.drawingObject = {
            type: this.settingsPanel.settings.type,
            x1: offsetX,
            y1: offsetY,
            fillColor: this.settingsPanel.settings.fillColor,
            pathColor: this.settingsPanel.settings.pathColor,
            lineWidth: this.settingsPanel.settings.lineWidth,
        };
    }

    stopDrawing(event: PointerEvent) {
        event.preventDefault();

        if (event.button !== 0) return;

        const { offsetX, offsetY } = event;

        this.drawingObject = {
            x2: offsetX,
            y2: offsetY,
            ...this.drawingObject,
        } as ObjectData;

        this.objects.push(this.drawingObject);
        this.drawingObject = null;
        this.renderer.redraw(this.objects);
    }

    onDrawing(event: PointerEvent) {
        event.preventDefault();

        if (event.button !== -1) return;

        const { offsetX, offsetY } = event;

        this.renderer.redraw(this.objects)

        const tempObject = {
            x2: offsetX,
            y2: offsetY,
            ...this.drawingObject,
        } as ObjectData;

        this.renderer.draw(tempObject);
    }

    saveImage() {
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'image.png';
        link.click();
    }

    saveData() {
        const jsonData = JSON.stringify(this.objects);
        const filename = "data.json";

        const blob = new Blob([jsonData], { type: "application/json" });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // Для Internet Explorer або Microsoft Edge
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Інші браузери
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();

            // Звільнення ресурсів після завантаження
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 0);
        }
    }

    loadData(jsonData: string) {
        this.objects = JSON.parse(jsonData);
        this.propertiesPanel.setObjects(this.objects)
        this.renderer.redraw(this.objects);
    }
}
