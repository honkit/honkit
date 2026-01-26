import path from "path";

/**
 * Determine if a file change requires a full rebuild
 *
 * Full rebuild is needed when:
 * - SUMMARY.md is changed (book structure changed)
 * - GLOSSARY.md is changed (glossary definitions changed)
 * - book.json or book.js is changed (configuration changed)
 *
 * @param filepath - The absolute path of the changed file
 * @returns true if full rebuild is needed, false for incremental build
 */
export function shouldFullRebuild(filepath: string): boolean {
    const filename = path.basename(filepath);
    const lowerFilename = filename.toLowerCase();

    // Structure files that require full rebuild
    const structureFiles = ["summary.md", "glossary.md", "book.json", "book.js"];

    return structureFiles.includes(lowerFilename);
}
