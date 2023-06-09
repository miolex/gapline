import {Color} from "./color";

export enum ObjectType {
    RECTANGLE,
    CIRCLE,
    TRIANGLE,
    LINE
}

// Оголошення типу для збереження об'єкту
export interface ObjectData {
    type: ObjectType;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    lineWidth: number;
    fillColor: Color;
    pathColor: Color;
}
