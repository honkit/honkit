import GeneratorState from "./output/website/state";
import createTemplateEngine from "./output/website/createTemplateEngine";
// TODO: use this interface for building generator website/ebook
export interface BuildGenerator {
    name: string;
    State: GeneratorState;
    Options: any;
    onInit: Function;
    onFinish: Function;
    onPage: Function;
    onAsset: Function;
    createTemplateEngine: typeof createTemplateEngine;
}
