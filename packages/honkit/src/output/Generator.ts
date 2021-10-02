import Output from "../models/output";
import type Page from "../models/page";
import TemplateEngine from "../models/templateEngine";

// Generator Type
// FIXME: This types is ambiguousness
export type Generator = {
    name: string;
    State: unknown;
    Options: unknown;
    onInit: (output: Output) => Output;
    onFinish: (output: Output) => Output;
    onPage: (output: Output, page: Page) => Output;
    onAsset?: (output: Output, asset: string) => Output;
    createTemplateEngine?: (output: Output, currentFile: string) => TemplateEngine;
};
