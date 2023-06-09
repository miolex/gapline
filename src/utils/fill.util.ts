interface Color {
    r: number;
    g: number;
    b: number;
}

function parseHexColor(hexColor: string): Color {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return { r, g, b };
}

function getPixelColor(imageData: ImageData, x: number, y: number): Color {
    const index = (y * imageData.width + x) * 4;
    const data = imageData.data;
    return {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2]
    };
}

function setPixelColor(imageData: ImageData, x: number, y: number, color: Color) {
    const index = (y * imageData.width + x) * 4;
    const data = imageData.data;
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
}

function colorsMatch(color1: Color, color2: Color, tolerance: number): boolean {
    const dr = Math.abs(color1.r - color2.r);
    const dg = Math.abs(color1.g - color2.g);
    const db = Math.abs(color1.b - color2.b);
    return dr <= tolerance && dg <= tolerance && db <= tolerance;
}

function floodFill(
    context: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColor: Color,
    tolerance: number = 0
) {
    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    const pixelStack: [number, number][] = [];
    const startColor = getPixelColor(imageData, startX, startY);

    if (colorsMatch(startColor, fillColor, tolerance)) {
        return; // Exit early if the start color already matches the fill color
    }

    pixelStack.push([startX, startY]);

    while (pixelStack.length) {
        const [x, y] = pixelStack.pop()!;
        const currentColor = getPixelColor(imageData, x, y);

        if (colorsMatch(currentColor, startColor, tolerance)) {
            setPixelColor(imageData, x, y, fillColor);

            if (x > 0) {
                pixelStack.push([x - 1, y]);
            }
            if (x < imageData.width - 1) {
                pixelStack.push([x + 1, y]);
            }
            if (y > 0) {
                pixelStack.push([x, y - 1]);
            }
            if (y < imageData.height - 1) {
                pixelStack.push([x, y + 1]);
            }
        }
    }

    context.putImageData(imageData, 0, 0);
}
