import { addSlashToPathname } from "../server";

describe("addSlashToPathname", () => {
    test("should add trailing slash to pathname", () => {
        expect(addSlashToPathname("/path/to/dir")).toBe("/path/to/dir/");
    });

    test("should preserve query string", () => {
        expect(addSlashToPathname("/path/to/dir?q=1")).toBe("/path/to/dir/?q=1");
    });

    test("should preserve hash", () => {
        expect(addSlashToPathname("/path/to/dir#section")).toBe("/path/to/dir/#section");
    });

    test("should preserve both query string and hash", () => {
        expect(addSlashToPathname("/path/to/dir?q=1#section")).toBe("/path/to/dir/?q=1#section");
    });
});
