import path from "path";
import fs from "fs";
import assert from "assert";
import markdown from "../";
const page = markdown.page;

describe("Page parsing", () => {
    let LEXED;

    beforeAll(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/PAGE.md"), "utf8");
        LEXED = page(CONTENT);
    });

    it("should gen content", () => {
        assert(LEXED.content);
    });

    it("should not add id to headings", () => {
        assert.equal(page("# Hello").content, "<h1>Hello</h1>");
        assert.equal(page("# Hello {#test}").content, '<h1 id="test">Hello</h1>');
    });

    it("should handle line breaks appropriately", () => {
        assert.equal(page("Line one.  \nLine two.").content, "<p>Line one.<br>Line two.</p>");
    });

    it("should escape codeblocks in preparation (1)", () => {
        assert.equal(page.prepare("Hello `world`"), "Hello {% raw %}`world`{% endraw %}\n\n");
        assert.equal(page.prepare("Hello `world test`"), "Hello {% raw %}`world test`{% endraw %}\n\n");
        assert.equal(page.prepare("Hello ```world test```"), "Hello {% raw %}`world test`{% endraw %}\n\n");
        assert.equal(
            page.prepare("Hello\n```js\nworld test\n```\n"),
            "Hello\n\n{% raw %}```js\nworld test\n```\n\n{% endraw %}"
        );
        expect(page.prepare("Hello\n```\ntest\n\tworld\n\ttest\n```")).toMatchInlineSnapshot(`
            "Hello

            {% raw %}\`\`\`
            test
                world
                test
            \`\`\`

            {% endraw %}"
        `);
        // preserve \t in CodeBlock
        expect(page.prepare("Hello\n```js\n\tvar a = 1;\n\tconsole.log(a);\n```")).toMatchInlineSnapshot(`
            "Hello

            {% raw %}\`\`\`js
                var a = 1;
                console.log(a);
            \`\`\`

            {% endraw %}"
        `);
    });

    it("should escape codeblocks in preparation (2)", () => {
        expect(
            page.prepare(`Hello


\tworld
\thello


test`)
        ).toMatchInlineSnapshot(`
            "Hello

            {% raw %}        world
                    hello

            {% endraw %}test

            "
        `);
        expect(
            page.prepare(`Hello


\tworld
\thello


`)
        ).toMatchInlineSnapshot(`
            "Hello

            {% raw %}        world
                    hello

            {% endraw %}"
        `);
    });

    it("should escape codeblocks with nunjucks tags", () => {
        assert.equal(
            page.prepare('Hello {{ "Bonjour" }} ```test```'),
            'Hello {{ "Bonjour" }} {% raw %}`test`{% endraw %}\n\n'
        );
    });

    it("should escape codeblocks with nunjucks tags in {% raw %} tags", () => {
        assert.equal(
            page.prepare('{% raw %}Hello {{ "Bonjour" }} ```test```{% endraw %}'),
            '{% raw %}Hello {{ "Bonjour" }} `test`{% endraw %}\n\n'
        );
        assert.equal(
            page.prepare('{% raw %}Hello {{ "Bonjour" }} {% raw %}{% endraw %}```test```'),
            '{% raw %}Hello {{ "Bonjour" }} {% raw %}{% endraw %}{% raw %}`test`{% endraw %}\n\n'
        );
        assert.equal(
            page.prepare('```{% raw %}Hello {{ "Bonjour" }} {% raw %}```'),
            '{% raw %}`{% raw %}Hello {{ "Bonjour" }} {% raw %}`{% endraw %}\n\n'
        );

        assert.equal(
            page.prepare("```\ntest\n```\n\n\n### Test"),
            "{% raw %}```\ntest\n```\n\n{% endraw %}### Test\n\n"
        );
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

            {% raw %}        Class Stage
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

    it("should not process math", () => {
        assert.equal(page.prepare("Hello $world$"), "Hello $world$\n\n");
        assert.equal(page.prepare("Hello $$world$$"), "Hello $$world$$\n\n");
    });
});
