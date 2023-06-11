import {ObjectData, ObjectType} from "../core/types/object";
import {Settings} from "../core/types/settings";
import {Renderer} from "../core/render/renderer";
import {PropertiesPanel} from "../panels/properties.panel";
import {GraphicEditor} from "../core/editor/editor";
import {SettingsPanel} from "../panels/settings.panel";
import {ControlsPanel} from "../panels/controls.panel";

export class App {
    protected objects: ObjectData[];
    protected canvas: HTMLCanvasElement;
    protected renderer: Renderer;
    protected settings: Settings;
    protected settingsPanel: SettingsPanel;
    protected propertiesPanel: PropertiesPanel;
    protected graphicEditor: GraphicEditor;
    protected controlsPanel: ControlsPanel;

    constructor() {
        this.objects = [];
        this.canvas = document.getElementById("canvas")! as HTMLCanvasElement;
        this.renderer = new Renderer(this.canvas.getContext('2d')!);

        this.settings = {
            type: ObjectType.RECTANGLE,
            fillColor: "#42f563",
            pathColor: "#000000",
            lineWidth: 2,
            backgroundColor: "#fafafa"
        }

        this.settingsPanel = new SettingsPanel(this.settings);
        this.propertiesPanel = new PropertiesPanel(this.objects, this.renderer);
        this.controlsPanel = new ControlsPanel();

        this.graphicEditor = new GraphicEditor(
            this.canvas,
            this.renderer,
            this.settings,
            this.propertiesPanel,
            this.settingsPanel,
            this.objects
        );

        this.init();
    }

    protected init() {
        this.controlsPanel.onClearClick = this.clear.bind(this);
        this.controlsPanel.onSaveClick = this.saveData.bind(this);
        this.controlsPanel.onExportClick = this.saveImage.bind(this);
        this.controlsPanel.onLoad = this.loadData.bind(this);
    }

    protected saveImage() {
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'image.png';
        link.click();
    }

    protected saveData() {
        const jsonData = JSON.stringify(this.objects);
        const filename = "data.json";

        const blob = new Blob([jsonData], { type: "application/json" });
        //@ts-ignore
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //@ts-ignore
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 0);
        }
    }

    protected loadData(jsonData: string) {
        this.objects.splice(0);
        this.objects.push(...JSON.parse(jsonData));
        console.log(this.objects);
        this.renderer.redraw(this.objects);
    }

    protected clear() {
        this.objects.splice(1)
        this.renderer.redraw(this.objects)
    }
}
