const Markup = require("./markup");

const BLOCKS = require("./constants/blocks");
const STYLES = require("./constants/styles");
const ENTITIES = require("./constants/entities");

const Content = require("./models/content");
const Syntax = require("./models/syntax");
const Rule = require("./models/rule");
const RulesSet = require("./models/rules");
const Token = require("./models/token");

const parse = require("./parse");
const render = require("./render");

const JSONUtils = require("./json");
const ProseMirrorUtils = require("./prosemirror");

const genKey = require("./utils/genKey");
const transform = require("./utils/transform");

module.exports = Markup;

// Method
module.exports.parse = parse;
module.exports.render = render;

// Models
module.exports.Content = Content;
module.exports.Token = Token;
module.exports.Syntax = Syntax;
module.exports.Rule = Rule;
module.exports.RulesSet = RulesSet;

// Utils
module.exports.JSONUtils = JSONUtils;
module.exports.ProseMirrorUtils = ProseMirrorUtils;
module.exports.genKey = genKey;
module.exports.transform = transform;

// Constants
module.exports.STYLES = STYLES;
module.exports.ENTITIES = ENTITIES;
module.exports.BLOCKS = BLOCKS;
