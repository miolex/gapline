export type Color = string | CanvasGradient | CanvasPattern;

export function isColor(value: any): boolean {
    if (typeof value !== 'string') {
        return false;
    }

    const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    if (rgbRegex.test(value)) {
        return true;
    }

    const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
    if (rgbaRegex.test(value)) {
        return true;
    }

    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (hexRegex.test(value)) {
        return true;
    }

    return false;
}

