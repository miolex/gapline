import {Color} from "./color";

export enum ObjectType {
    RECTANGLE,
    CIRCLE,
    TRIANGLE,
    LINE
}

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
