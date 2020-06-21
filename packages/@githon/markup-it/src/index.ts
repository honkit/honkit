import Markup from "./markup";

import BLOCKS from "./constants/blocks";
import STYLES from "./constants/styles";
import ENTITIES from "./constants/entities";

import Content from "./models/content";
import Syntax from "./models/syntax";
import Rule from "./models/rule";
import RulesSet from "./models/rules";
import Token from "./models/token";

import parse from "./parse";
import render from "./render";

import JSONUtils from "./json";
import ProseMirrorUtils from "./prosemirror";

import genKey from "./utils/genKey";
import transform from "./utils/transform";

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
