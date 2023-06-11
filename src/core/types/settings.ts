import {ObjectType} from "./object";
import {Color} from "./color";

export interface Settings {
    type: ObjectType;
    fillColor:  Color;
    pathColor:  Color;
    lineWidth: number;
    backgroundColor: Color
}
