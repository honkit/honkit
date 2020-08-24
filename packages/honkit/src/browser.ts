import Modifiers from "./modifiers";

import parse from "./parse";

import models from "./models/book";

import models0 from "./models/fs";

import models01 from "./models/file";

import models012 from "./models/summary";

import models0123 from "./models/glossary";

import models01234 from "./models/config";

import models012345 from "./models/page";

import models0123456 from "./models/pluginDependency";

import constants from "./constants/configFiles";

import constants0 from "./constants/ignoreFiles";

import constants01 from "./constants/defaultPlugins";

import constants012 from "./constants/extsMarkdown";

import constants0123 from "./constants/extsAsciidoc";

export default {
    Parse: parse,

    // Models
    Book: models,
    FS: models0,
    File: models01,
    Summary: models012,
    Glossary: models0123,
    Config: models01234,
    Page: models012345,
    PluginDependency: models0123456,

    // Modifiers
    SummaryModifier: Modifiers.Summary,
    ConfigModifier: Modifiers.Config,

    // Constants
    CONFIG_FILES: constants,
    IGNORE_FILES: constants0,
    DEFAULT_PLUGINS: constants01,
    EXTENSIONS_MARKDOWN: constants012,
    EXTENSIONS_ASCIIDOC: constants0123,
};
