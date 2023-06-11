import {ObjectData, ObjectType} from "../core/types/object";

export class HitUtil {

    static isPointInsideObject(x: number, y: number, object: ObjectData): boolean {
        switch (object.type) {
            case ObjectType.RECTANGLE:
                return HitUtil.isPointInsideRectangle(x, y, object);
            case ObjectType.CIRCLE:
                return HitUtil.isPointInsideCircle(x, y, object);
            case ObjectType.TRIANGLE:
                return HitUtil.isPointInsideTriangle(x, y, object);
            case ObjectType.LINE:
                return HitUtil.isPointInsideLine(x, y, object);
            default:
                return false;
        }
    }

    protected static isPointInsideRectangle(x: number, y: number, object: ObjectData): boolean {
        const { x1, y1, x2, y2 } = object;
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }

    protected static isPointInsideCircle(x: number, y: number, object: ObjectData): boolean {
        const x1 = object.x1 - object.x2;
        const y1 = object.y1 - object.y2;
        const radius = Math.sqrt(x1 * x1 + y1 * y1) / 2;

        const centerX = object.x2 + x1 / 2;
        const centerY = object.y2 + y1 / 2;

        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        return distance <= radius;
    }

    protected static area(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
        return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
    }

    protected static isPointInsideTriangle(x: number, y: number, object: ObjectData): boolean {
        const x1 = object.x1;
        const y1 = object.y2;
        const x2 = (object.x1 + object.x2) / 2;
        const y2 = object.y1;
        const x3 = object.x2;
        const y3 = object.y2;

        let A = HitUtil.area(x1, y1, x2, y2, x3, y3);

        let A1 = HitUtil.area(x, y, x2, y2, x3, y3);

        let A2 = HitUtil.area(x1, y1, x, y, x3, y3);

        let A3 = HitUtil.area(x1, y1, x2, y2, x, y);

        return (A == A1 + A2 + A3);
    }

    protected static isPointInsideLine(x: number, y: number, object: ObjectData): boolean {
        const { x1, y1, x2, y2 } = object;
        const d1 = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        const d2 = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
        const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const buffer = 0.1;
        return d1 + d2 >= lineLength - buffer && d1 + d2 <= lineLength + buffer;
    }
}
