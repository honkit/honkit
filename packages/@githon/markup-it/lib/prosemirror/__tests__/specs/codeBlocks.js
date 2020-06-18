module.exports = {
    json: {
        syntax: "markdown",
        token: {
            type: "doc",
            data: {},
            tokens: [
                {
                    type: "paragraph",
                    data: {},
                    tokens: [
                        {
                            type: "text",
                            text: "Hello World",
                            data: {},
                            tokens: [],
                        },
                    ],
                },
                {
                    type: "code_block",
                    data: {
                        syntax: "js",
                    },
                    tokens: [
                        {
                            type: "text",
                            text: "var a = 'test'\n",
                            data: {},
                            tokens: [],
                        },
                    ],
                },
            ],
        },
    },
    prosemirror: {
        type: "doc",
        attrs: {},
        content: [
            {
                type: "paragraph",
                attrs: {},
                content: [
                    {
                        type: "text",
                        text: "Hello World",
                        attrs: {},
                        marks: [],
                    },
                ],
            },
            {
                type: "code_block",
                attrs: {
                    syntax: "js",
                },
                content: [
                    {
                        type: "text",
                        text: "var a = 'test'\n",
                        attrs: {},
                        marks: [],
                    },
                ],
            },
        ],
    },
};
