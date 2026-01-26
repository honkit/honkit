import path from "path";
import type { WatchEventType } from "./watch";

/**
 * Determine if a file change requires a full rebuild based on the file path
 *
 * Full rebuild is needed when:
 * - SUMMARY.md is changed (book structure changed)
 * - GLOSSARY.md is changed (glossary definitions changed)
 * - book.json or book.js is changed (configuration changed)
 *
 * @param filepath - The absolute path of the changed file
 * @returns true if full rebuild is needed, false for incremental build
 */
export function isStructureFile(filepath: string): boolean {
    const filename = path.basename(filepath);
    const lowerFilename = filename.toLowerCase();

    // Structure files that require full rebuild
    const structureFiles = ["summary.md", "glossary.md", "book.json", "book.js"];

    return structureFiles.includes(lowerFilename);
}

/**
 * Determine if a file change requires a full rebuild
 *
 * Full rebuild is needed when:
 * - Structure files are changed (SUMMARY.md, GLOSSARY.md, book.json, book.js)
 * - New files are added (to update asset list and page structure)
 *
 * @param filepath - The absolute path of the changed file
 * @param eventType - The type of file change event
 * @returns true if full rebuild is needed, false for incremental build
 */
export function shouldFullRebuild(filepath: string, eventType?: WatchEventType): boolean {
    // New file additions always require full rebuild
    if (eventType === "add") {
        return true;
    }

    // Structure files require full rebuild
    return isStructureFile(filepath);
}
