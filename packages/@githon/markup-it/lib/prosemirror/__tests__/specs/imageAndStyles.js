module.exports = {
    prosemirror: {
        type: "doc",
        attrs: {},
        content: [
            {
                type: "header_one",
                attrs: {
                    id: null,
                },
                content: [
                    {
                        type: "text",
                        text: "Hello",
                        attrs: {},
                        marks: [],
                    },
                ],
            },
            {
                type: "paragraph",
                attrs: {},
                content: [
                    {
                        type: "text",
                        text: "Hello ",
                        attrs: {},
                        marks: [],
                    },
                    {
                        type: "text",
                        text: "Wo",
                        attrs: {},
                        marks: [
                            {
                                href: "a.md",
                                _: "link",
                            },
                            {
                                _: "BOLD",
                            },
                        ],
                    },
                    {
                        type: "text",
                        text: "rld",
                        attrs: {},
                        marks: [
                            {
                                href: "a.md",
                                _: "link",
                            },
                            {
                                _: "BOLD",
                            },
                            {
                                _: "ITALIC",
                            },
                        ],
                    },
                    {
                        type: "text",
                        text: " ",
                        attrs: {},
                        marks: [],
                    },
                    {
                        type: "text",
                        text: " ",
                        attrs: {},
                        marks: [
                            {
                                _: "BOLD",
                            },
                        ],
                    },
                    {
                        type: "image",
                        text: "",
                        attrs: {
                            alt: "",
                            src: "test.png",
                        },
                        marks: [
                            {
                                _: "BOLD",
                            },
                        ],
                    },
                    {
                        type: "text",
                        text: " ",
                        attrs: {},
                        marks: [
                            {
                                _: "BOLD",
                            },
                        ],
                    },
                    {
                        type: "text",
                        text: ".",
                        attrs: {},
                        marks: [],
                    },
                ],
            },
        ],
    },
    json: {
        syntax: "prosemirror",
        token: {
            type: "doc",
            data: {},
            tokens: [
                {
                    type: "header_one",
                    data: {
                        id: null,
                    },
                    tokens: [
                        {
                            type: "text",
                            text: "Hello",
                            data: {},
                            tokens: [],
                        },
                    ],
                },
                {
                    type: "paragraph",
                    data: {},
                    tokens: [
                        {
                            type: "text",
                            text: "Hello ",
                            data: {},
                            tokens: [],
                        },
                        {
                            type: "link",
                            data: {
                                href: "a.md",
                            },
                            tokens: [
                                {
                                    type: "BOLD",
                                    data: {},
                                    tokens: [
                                        {
                                            type: "text",
                                            text: "Wo",
                                            data: {},
                                            tokens: [],
                                        },
                                        {
                                            type: "ITALIC",
                                            data: {},
                                            tokens: [
                                                {
                                                    type: "text",
                                                    text: "rld",
                                                    data: {},
                                                    tokens: [],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "text",
                            text: " ",
                            data: {},
                            tokens: [],
                        },
                        {
                            type: "BOLD",
                            data: {},
                            tokens: [
                                {
                                    type: "text",
                                    text: " ",
                                    data: {},
                                    tokens: [],
                                },
                                {
                                    type: "image",
                                    text: "",
                                    data: {
                                        alt: "",
                                        src: "test.png",
                                    },
                                    tokens: [],
                                },
                                {
                                    type: "text",
                                    text: " ",
                                    data: {},
                                    tokens: [],
                                },
                            ],
                        },
                        {
                            type: "text",
                            text: ".",
                            data: {},
                            tokens: [],
                        },
                    ],
                },
            ],
        },
    },
};
