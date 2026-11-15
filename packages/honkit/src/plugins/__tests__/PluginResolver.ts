import fs from "fs";
import os from "os";
import path from "path";
import { PluginResolver } from "../PluginResolver";

describe("PluginResolver", () => {
    let baseDirectory: string;

    // Create a fake package in baseDirectory, as if it was installed in node_modules
    const installPackage = (name: string) => {
        const packageDir = path.join(baseDirectory, name);
        fs.mkdirSync(packageDir, { recursive: true });
        fs.writeFileSync(path.join(packageDir, "package.json"), JSON.stringify({ name }));
        return packageDir;
    };

    beforeEach(() => {
        // require.resolve returns the real path: the temporary directory is a symlink on macOS
        // and a short (8.3) path on Windows, which only the native realpath expands
        baseDirectory = fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), "honkit-plugin-resolver-")));
    });

    afterEach(() => {
        fs.rmSync(baseDirectory, { recursive: true, force: true });
    });

    const resolve = (name: string) => new PluginResolver({ baseDirectory }).resolvePluginPackageName(name);

    it("should resolve honkit-plugin-* before gitbook-plugin-*", () => {
        const honkitPlugin = installPackage("honkit-plugin-example");
        installPackage("gitbook-plugin-example");

        expect(resolve("example")).toBe(honkitPlugin);
    });

    it("should resolve gitbook-plugin-*", () => {
        const gitbookPlugin = installPackage("gitbook-plugin-example");

        expect(resolve("example")).toBe(gitbookPlugin);
    });

    it("should resolve a package by its full name", () => {
        const plugin = installPackage("honkit-plugin-example");

        expect(resolve("honkit-plugin-example")).toBe(plugin);
    });

    it("should resolve a default plugin to the @honkit/ package before a library of the same name", () => {
        // npm hoists the "lunr" library, a dependency of @honkit/honkit-plugin-lunr, next to the plugin
        installPackage("lunr");
        const scopedPlugin = installPackage("@honkit/honkit-plugin-lunr");

        expect(resolve("lunr")).toBe(scopedPlugin);
    });

    it("should prefer a user-installed gitbook-plugin-* over the @honkit/ package", () => {
        installPackage("@honkit/honkit-plugin-lunr");
        const gitbookPlugin = installPackage("gitbook-plugin-lunr");

        expect(resolve("lunr")).toBe(gitbookPlugin);
    });

    it("should not resolve a non-default plugin to the @honkit/ package", () => {
        installPackage("@honkit/honkit-plugin-example");

        expect(() => resolve("example")).toThrow(ReferenceError);
    });

    it("should fall back to the bare package name", () => {
        const plugin = installPackage("example");

        expect(resolve("example")).toBe(plugin);
    });

    it("should throw when the plugin is not found", () => {
        expect(() => resolve("not-found")).toThrow(/"not-found" is not found/);
    });
});
