export type Color = string | CanvasGradient | CanvasPattern;

export function isColor(value: any): boolean {
    if (typeof value !== 'string') {
        return false;
    }

    // Перевірка на колір RGB
    const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    if (rgbRegex.test(value)) {
        return true;
    }

    // Перевірка на колір RGBA
    const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
    if (rgbaRegex.test(value)) {
        return true;
    }

    // Перевірка на колір HEX
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (hexRegex.test(value)) {
        return true;
    }

    return false;
}

