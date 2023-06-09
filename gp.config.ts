/// <reference types="vitest" />
import { defineConfig, ConfigEnv, UserConfigExport } from 'vite';

export default function ({}: ConfigEnv): UserConfigExport {
    return defineConfig({
        base: "https://miolex.github.io/gapline",
        build: {
            outDir: "docs",
            assetsDir: "./"
        },
    });
}
