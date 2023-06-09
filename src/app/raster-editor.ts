// Опис типу кольору
type Color = string;

// Опис типу точки на канві
type Point = {
    x: number;
    y: number;
};

// Опис типу шару з прозорістю
type Layer = {
    canvas: HTMLCanvasElement;
    opacity: number;
};

// Опис класу редактора
export class RasterEditor {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private layers: Layer[];
    private activeLayerIndex: number;
    private currentColor: Color;
    private isDrawing: boolean;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        this.layers = [];
        this.activeLayerIndex = -1;
        this.currentColor = "#000000";

        // Додати обробники подій для малювання
        this.canvas.addEventListener("pointerdown", this.handlePointerDown.bind(this));
        this.canvas.addEventListener("pointermove", this.handlePointerMove.bind(this));
        this.canvas.addEventListener("pointerup", this.handlePointerUp.bind(this));

    }

    // Додати новий шар
    addLayer(opacity: number) {
        const layerCanvas = document.createElement("canvas");
        layerCanvas.width = this.canvas.width;
        layerCanvas.height = this.canvas.height;
        const layerCtx = layerCanvas.getContext("2d")!;
        this.layers.push({
            canvas: layerCanvas,
            opacity: opacity,
        });
        this.activeLayerIndex = this.layers.length - 1;
    }

    // Встановити активний шар
    setActiveLayer(layerIndex: number) {
        if (layerIndex >= 0 && layerIndex < this.layers.length) {
            this.activeLayerIndex = layerIndex;
        }
    }

    // Встановити поточний колір
    setCurrentColor(color: Color) {
        this.currentColor = color;
    }

    // Обробник події натискання кнопки миші або планшета
    handlePointerDown(event: PointerEvent) {
        if (event.pointerType === "pen" || event.pointerType === "mouse") {
            const { offsetX, offsetY } = event;
            const point = { x: offsetX, y: offsetY };
            this.startDrawing(point);
        }
    }

    // Обробник події руху миші або планшета
    handlePointerMove(event: PointerEvent) {
        if (this.isDrawing && (event.pointerType === "pen" || event.pointerType === "mouse")) {
            const { offsetX, offsetY } = event;
            const point = { x: offsetX, y: offsetY };
            this.drawPoint(point);
        }
    }

    // Обробник події відпускання кнопки миші або планшета
    handlePointerUp(event: PointerEvent) {
        if (this.isDrawing && (event.pointerType === "pen" || event.pointerType === "mouse")) {
            this.stopDrawing();
        }
    }

    // Розпочати малювання
    startDrawing(point: Point) {
        this.isDrawing = true;
        this.drawPoint(point);
    }

    // Зупинити малювання
    stopDrawing() {
        this.isDrawing = false;
    }


    // Намалювати точку на активному шарі
    drawPoint(point: Point) {
        const activeLayer = this.layers[this.activeLayerIndex];
        const { x, y } = point;
        const { canvas, opacity } = activeLayer;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = this.currentColor;
        ctx.globalAlpha = opacity;
        ctx.fillRect(x, y, 1, 1);
        this.ctx.drawImage(canvas, 0, 0);
    }
}
