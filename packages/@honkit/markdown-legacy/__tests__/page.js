var fs = require("fs");
var path = require("path");
var assert = require("assert");

var page = require("../").page;

describe("Page parsing", function () {
    var LEXED;

    beforeAll(function () {
        var CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/PAGE.md"), "utf8");
        LEXED = page(CONTENT);
    });

    it("should gen content", function () {
        assert(LEXED.content);
    });

    it("should not add id to headings", function () {
        assert.equal(page("# Hello").content, "<h1>Hello</h1>\n");
        assert.equal(page("# Hello {#test}").content, '<h1 id="test">Hello </h1>\n');
    });

    it("should escape codeblocks in preparation (1)", function () {
        assert.equal(page.prepare("Hello `world`"), "Hello {% raw %}`world`{% endraw %}");
        assert.equal(page.prepare("Hello `world test`"), "Hello {% raw %}`world test`{% endraw %}");
        assert.equal(page.prepare("Hello ```world test```"), "Hello {% raw %}```world test```{% endraw %}");
        assert.equal(
            page.prepare("Hello\n```js\nworld test\n```\n"),
            "Hello\n{% raw %}```js\nworld test\n```\n{% endraw %}"
        );
        assert.equal(
            page.prepare("Hello\n```\ntest\n\tworld\n\ttest\n```"),
            "Hello\n{% raw %}```\ntest\n    world\n    test\n```{% endraw %}"
        );
    });

    it("should escape codeblocks in preparation (2)", function () {
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\ntest"),
            "Hello\n\n\n{% raw %}    world\n    hello\n\n\n{% endraw %}test"
        );
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\n"),
            "Hello\n\n\n{% raw %}    world\n    hello\n\n\n{% endraw %}"
        );
    });

    it("should escape codeblocks with nunjucks tags", function () {
        assert.equal(
            page.prepare('Hello {{ "Bonjour" }} ```test```'),
            'Hello {{ "Bonjour" }} {% raw %}```test```{% endraw %}'
        );
    });

    it("should escape codeblocks with nunjucks tags in {% raw %} tags", function () {
        assert.equal(
            page.prepare('{% raw %}Hello {{ "Bonjour" }} ```test```{% endraw %}'),
            '{% raw %}Hello {{ "Bonjour" }} ```test```{% endraw %}'
        );
        assert.equal(
            page.prepare('{% raw %}Hello {{ "Bonjour" }} {% raw %}{% endraw %}```test```'),
            '{% raw %}Hello {{ "Bonjour" }} {% raw %}{% endraw %}{% raw %}```test```{% endraw %}'
        );
        assert.equal(
            page.prepare('```{% raw %}Hello {{ "Bonjour" }} {% raw %}```'),
            '{% raw %}```{% raw %}Hello {{ "Bonjour" }} {% raw %}```{% endraw %}'
        );

        assert.equal(page.prepare("```\ntest\n```\n\n\n### Test"), "{% raw %}```\ntest\n```\n{% endraw %}\n\n### Test");
    });

    it("should normalize some characters for kramed's annotate function", function () {
        assert.equal(
            page.prepare("Hello\r\nworld\rhello\u2424world\ttest\u00a0"),
            "Hello\nworld\nhello\nworld    test "
        );
    });

    it("should not process math", function () {
        assert.equal(page.prepare("Hello $world$"), "Hello $world$");
        assert.equal(page.prepare("Hello $$world$$"), "Hello $$world$$");
    });

    it("pageContent block in CodeBlock should be escaped with {% raw %}", () => {
        const code = `
\`\`\`
{% block pageContent %}
This is the default content
{% endblock %}

# License

{% include "./LICENSE" %}
\`\`\`
        `;
        expect(page.prepare(code)).toMatchInlineSnapshot(`
            "
            {% raw %}\`\`\`
            {% block pageContent %}
            This is the default content
            {% endblock %}

            # License

            {% include "./LICENSE" %}
            \`\`\`
            {% endraw %}{% raw %}        {% endraw %}"
        `);
    });
    it("When content has two codeblocks, both should be escaped with {% raw %}", () => {
        const code = `
\`\`\`
{% extends "./mypage.md" %}

{% block pageContent %}
# This is my page content
{% endblock %}
\`\`\`

In the file \`mypage.md\`, you should specify the blocks that can be extended:

\`\`\`
{% block pageContent %}
This is the default content
{% endblock %}

# License

{% include "./LICENSE" %}
\`\`\`
`;
        expect(page.prepare(code)).toMatchInlineSnapshot(`
            "
            {% raw %}\`\`\`
            {% extends "./mypage.md" %}

            {% block pageContent %}
            # This is my page content
            {% endblock %}
            \`\`\`
            {% endraw %}
            In the file {% raw %}\`mypage.md\`{% endraw %}, you should specify the blocks that can be extended:

            {% raw %}\`\`\`
            {% block pageContent %}
            This is the default content
            {% endblock %}

            # License

            {% include "./LICENSE" %}
            \`\`\`
            {% endraw %}"
        `);
    });
    it("escape {% uml %} block tags + Indented code block", () => {
        const code = `{% uml %}
@startuml

\tClass Stage
\tClass Timeout {
\t\t+constructor:function(cfg)
\t\t+timeout:function(ctx)
\t\t+overdue:function(ctx)
\t\t+stage: Stage
\t}
 \tStage <|-- Timeout

@enduml
{% enduml %}
`;
        expect(page.prepare(code)).toMatchInlineSnapshot(`
            "{% uml %}
            @startuml

            {% raw %}    Class Stage
                Class Timeout {
                    +constructor:function(cfg)
                    +timeout:function(ctx)
                    +overdue:function(ctx)
                    +stage: Stage
                }
                 Stage <|-- Timeout

            {% endraw %}@enduml
            {% enduml %}
            "
        `);
    });
    it("conrefs.md and prepare test", () => {
        const code = fs.readFileSync(path.join(__dirname, "fixtures/conrefs.md"), "utf-8");
        expect(page.prepare(code)).toMatchSnapshot("conrefs.md");
    });
    it("conrefs.md inline and prepare test", () => {
        const code = `# Content References

Content referencing (conref) is a convenient mechanism to reuse content from other files or books.

### Importing local files

Importing an other file's content is easy using the \`include\` tag:

\`\`\`
{% include "./test.md" %}
\`\`\`

### Importing file from another book

HonKit can also resolve the include path by using git:

\`\`\`
{% include "git+https://github.com/GitbookIO/documentation.git/README.md#0.0.1" %}
\`\`\`

The format of git url is:

\`\`\`
git+https://user@hostname/owner/project.git/file#commit-ish
\`\`\`

The real git url part should finish with \`.git\`, the filename to import is extracted after the \`.git\` till the fragment of the url.

The \`commit-ish\` can be any tag, sha, or branch which can be supplied as an argument to \`git checkout\`. The default is \`master\`.

### Inheritance

Template inheritance is a way to make it easy to reuse templates. When writing a template, you can define "blocks" that child templates can override. The inheritance chain can be as long as you like.

\`block\` defines a section on the template and identifies it with a name. Base templates can specify blocks and child templates can override them with new content.

\`\`\`
{% extends "./mypage.md" %}

{% block pageContent %}
# This is my page content
{% endblock %}
\`\`\`

In the file \`mypage.md\`, you should specify the blocks that can be extended:

\`\`\`
{% block pageContent %}
This is the default content
{% endblock %}

# License

{% include "./LICENSE" %}
\`\`\`
`;
        expect(page.prepare(code)).toMatchSnapshot("conrefs.md inline");
    });
});
