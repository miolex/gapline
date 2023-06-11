import {ObjectData, ObjectType} from "../types/object";
import {AppConfig} from "../../misc/app.config";

export class Renderer {
    protected context: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.context = ctx;
    }

    clear() {
        this.context.clearRect(0, 0, AppConfig.Screen.Width, AppConfig.Screen.Height);
    }

    redraw(objects: ObjectData[]) {
        this.clear();
        objects.forEach(object => {
            this.draw(object);
        });
    }

    drawImage(image: CanvasImageSource, x: number, y: number) {
        this.context.drawImage(image, x, y);
    }

    draw(object: ObjectData) {
        this.context.fillStyle = object.fillColor;
        this.context.strokeStyle = object.pathColor;
        this.context.lineWidth = object.lineWidth;
        switch (object.type) {
            case ObjectType.RECTANGLE:
                this.drawRect(object);
                break;
            case ObjectType.CIRCLE:
                this.drawCircle(object);
                break;
            case ObjectType.LINE:
                this.drawLine(object);
                break;
            case ObjectType.TRIANGLE:
                this.drawTriangle(object);
                break;
        }
    }

    protected drawRect(object: ObjectData) {
        const width = Math.abs(object.x2 - object.x1);
        const height = Math.abs(object.y2 - object.y1);

        const startX = object.x1 <= object.x2 ? object.x1 : object.x2;
        const startY = object.y1 <= object.y2 ? object.y1 : object.y2;

        this.context.fillRect(startX, startY, width, height);

        if (object.lineWidth > 0) {
            this.context.strokeRect(startX, startY, width, height);
        }
    }

    protected drawCircle(object: ObjectData) {
        const x1 = object.x1 - object.x2;
        const y1 = object.y1 - object.y2;
        const radius = Math.sqrt(x1 * x1 + y1 * y1) / 2

        const centerX = object.x2 + x1 / 2;
        const centerY = object.y2 + y1 / 2;

        this.context.beginPath();
        this.context.arc(
            centerX,
            centerY,
            radius,
            0,
            2 * Math.PI,
            false
        );
        this.context.fill();
        if(object.lineWidth > 0) {
            this.context.stroke();
        }
    }

    protected drawTriangle(object: ObjectData) {
        const startX = (object.x1 + object.x2) / 2;
        const startY = object.y1;

        this.context.beginPath();
        this.context.moveTo(startX, startY);
        this.context.lineTo(object.x1, object.y2);
        this.context.lineTo(object.x2, object.y2);
        this.context.closePath();
        this.context.fillStyle = object.fillColor;
        this.context.fill();


        if (object.lineWidth > 0) {
            this.context.strokeStyle = object.pathColor;
            this.context.lineWidth = object.lineWidth;
            this.context.stroke();
        }
    }

    protected drawLine(object: ObjectData) {
        this.context.beginPath();
        this.context.lineWidth = object.lineWidth;
        this.context.moveTo(object.x2, object.y2);
        this.context.lineTo(object.x1 || object.x2, object.y1 || object.y2);
        this.context.stroke();
    }
}
