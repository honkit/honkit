const path = require("path");
module.exports ={
  "gitbook": ">=3.0.0",
  "title": "JavaScript Primer #jsprimer",
  "description": "JavaScriptの基本的な書き方からアプリケーションの作成などのユースケースを学ぶための入門書です",
  "root": "./source/",
  "structure": {
    "readme": "index.md",
    "summary": "README.md"
  },
  "plugins": [
    "-search",
    "-lunr",
    "page-toc-button",
    "include-codeblock",
    "anchors",
    "canonical-link",
    "js-console"
  ],
  "variables": {
    "esversion": "2019",
    "nodeversion": "12.13.0",
    "npmversion": "6.12.0",
    "triplebackticks": "```",
    "console": "<a class=\"gitbook-plugin-js-console\" aria-hidden=\"true\"></a>"
  },
  "pluginsConfig": {
    "include-codeblock": {
      "template": path.join(__dirname, "resources/gitbook-plugin-include-codeblock.hbs")
    },
    "page-toc-button": {
      "maxTocDepth": 2,
      "minTocSize": 2
    },
    "docSearch": {
      "apiKey": "fd28ebaba94be0c39fb9fa1b2fed4f23",
      "index": "asciidwango"
    },
    "github-issue-feedback": {
      "repo": "asciidwango/js-primer"
    },
    "edit-link": {
      "base": "https://github.com/asciidwango/js-primer/edit/master/source/",
      "label": "Edit"
    },
    "canonical-link": {
      "baseURL": "https://jsprimer.net"
    }
  }
}
