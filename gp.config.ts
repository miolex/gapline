/// <reference types="vitest" />
import { defineConfig, ConfigEnv, UserConfigExport } from 'vite';

export default function ({}: ConfigEnv): UserConfigExport {
    return defineConfig({
        build: {
            outDir: "docs",
            assetsDir: "./"
        },
    });
}
