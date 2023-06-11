import {ObjectData, ObjectType} from "../types/object";
import {Settings} from "../types/settings";
import {Renderer} from "../render/renderer";
import {PropertiesPanel} from "../../panels/properties.panel";
import {AppConfig} from "../../misc/app.config";
import {SettingsPanel} from "../../panels/settings.panel";

export class GraphicEditor {
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    settings: Settings;
    settingsPanel: SettingsPanel;
    propertiesPanel: PropertiesPanel;
    objects: ObjectData[];
    drawingObject: any;

    constructor(
        canvas: HTMLCanvasElement,
        renderer: Renderer,
        settings: Settings,
        propertiesPanel: PropertiesPanel,
        settingsPanel: SettingsPanel,
        objects: ObjectData[]
    ) {
        this.objects = objects;
        this.canvas = canvas;
        this.settings = settings;
        this.renderer =  renderer;
        this.propertiesPanel = propertiesPanel;
        this.settingsPanel = settingsPanel;

        this.settingsPanel.onBackgroundColorUpdate = this.updateBackground.bind(this);
        this.canvas.addEventListener('pointerdown', this.startDrawing.bind(this));
        this.canvas.addEventListener('pointerup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('pointermove', this.onDrawing.bind(this));
        this.canvas.addEventListener('contextmenu', this.propertiesPanel.handleSelect.bind(this.propertiesPanel));

        this.initBackground();
    }

    protected initBackground() {
        if (this.hasBackground()) { return; }

        this.objects.unshift({
            type: ObjectType.RECTANGLE,
            fillColor: this.settings.backgroundColor,
            pathColor: "#000000",
            x1: 0,
            lineWidth: 0,
            y2: AppConfig.Screen.Height,
            x2: AppConfig.Screen.Width,
            y1: 0
        })
        this.renderer.redraw(this.objects)
    }

    protected isBackground(obj: ObjectData) {
        return obj.x1 === 0 && obj.y1 === 0 && obj.x2 === AppConfig.Screen.Width && obj.y2 === AppConfig.Screen.Height;
    }

    protected hasBackground() {
        return this.objects.length > 0 && this.isBackground(this.objects[0]);
    }

    protected updateBackground() {
        if (!this.hasBackground()) { return; }
        this.objects[0].fillColor = this.settings.backgroundColor;
        this.renderer.redraw(this.objects);
    }

    protected startDrawing(event: PointerEvent) {
        event.preventDefault();

        if (event.button !== 0) return;

        const { offsetX, offsetY } = event;

        this.drawingObject = {
            type: this.settings.type,
            x1: offsetX,
            y1: offsetY,
            fillColor: this.settings.fillColor,
            pathColor: this.settings.pathColor,
            lineWidth: this.settings.lineWidth,
        };
    }

    protected stopDrawing(event: PointerEvent) {
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

    protected onDrawing(event: PointerEvent) {
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
}
