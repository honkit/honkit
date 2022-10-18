import { run } from "../bin";
import path from "path";
import { mockProcessStdout } from "jest-mock-process";
import { stripAnsi } from "@relmify/jest-serializer-strip-ansi";

const CWD = process.cwd();
const cwdPlugin: jest.SnapshotSerializerPlugin = {
    test: (value: any) => typeof value === "string" && value.includes(CWD),
    print: (value: unknown, serialize: any) => {
        if (typeof value === "string") {
            return serialize(value.split(CWD).join("<CWD>").replace(/\\/g, "/"));
        }
        return value;
    },
};
expect.addSnapshotSerializer(stripAnsi);
expect.addSnapshotSerializer(cwdPlugin);
describe("e2e", function () {
    let stdoutMock: jest.SpyInstance;
    beforeEach(() => {
        stdoutMock = mockProcessStdout();
    });
    afterEach(() => {
        stdoutMock.mockRestore();
    });
    it("`honkit parse` for multilang", async () => {
        await run([process.argv[0], "honkit", "parse", path.join(__dirname, "__fixtures__/multilang")]);
        expect(stdoutMock.mock.calls).toMatchInlineSnapshot(`
            [
              [
                "info: parsing multilingual book, with 2 languages 
            ",
              ],
              [
                "warn: no summary file in this book 
            ",
              ],
              [
                "warn: no summary file in this book 
            ",
              ],
              [
                "info: Book located in: <CWD>/src/__tests__/__fixtures__/multilang 
            ",
              ],
              [
                "info: 2 languages 
            ",
              ],
              [
                "info: Language: English 
            ",
              ],
              [
                "info: Introduction file is README.md 
            ",
              ],
              [
                "info:  
            ",
              ],
              [
                "info: Language: Japanese 
            ",
              ],
              [
                "info: Introduction file is README.md 
            ",
              ],
              [
                "info:  
            ",
              ],
            ]
        `);
    });
});
