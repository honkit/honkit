# Generating eBooks and PDFs

HonKit can generate a website, but can also output content as ebook (ePub, Mobi, PDF).

```
# Generate a PDF file
$ honkit pdf ./ ./mybook.pdf

# Generate an ePub file
$ honkit epub ./ ./mybook.epub

# Generate a Mobi file
$ honkit mobi ./ ./mybook.mobi
```

### Installing ebook-convert

`ebook-convert` is required to generate ebooks (epub, mobi, pdf).

##### OS X

Download the [Calibre application](https://calibre-ebook.com/download). After moving the `calibre.app` to your Applications folder create a symbolic link to the ebook-convert tool:

```
$ sudo ln -s /Applications/calibre.app/Contents/MacOS/ebook-convert /usr/local/bin
```

You can replace `/usr/bin` with any directory that is in your $PATH.

### Page numbers in the PDF table of contents

To show physical target page numbers in the **front** table of contents, enable the
following in `book.json`:

```json
{
    "pdf": {
        "tocPageNumbers": true
    }
}
```

This option defaults to `false` and is supported by the bundled default themes.
Numbers count physical PDF pages starting at 1, including the cover and the table
of contents itself. Fragment links point to the page containing their target,
not necessarily the first page of the chapter. External links and unlinked
headings do not receive page numbers. This setting is independent of
`pdf.pageNumbers`, which controls footer numbering; custom footer labels or
numbering offsets do not change physical TOC numbers. ePub, Mobi and website
output are unchanged.

HonKit reserves fixed-width number slots in `SUMMARY.html`, renders temporary
PDFs with paired identification/destination links, and reads their internal link
destinations using a pure Node parser (`pdf-lib`). It renders again with the
measured numbers and verifies that pagination has stabilized before generating a
clean PDF without those probe links. PDFs are never edited or reordered. This
usually requires three Calibre conversions, so generation takes longer. If
pagination does not stabilize within five measurement passes, or a target cannot
be resolved, generation fails rather than printing guessed numbers.

If you override `ebook/summary.html`, preserve the bundled template's `pdfToc`
context handling and paired `.pdf-toc-probe` links. This context is a map keyed by
`article.level`; each slot exposes only `pageNumber` and a temporary `probeURL`.
IDs, PDF parsing and convergence are handled internally by HonKit.
Custom PDF/print styles must
preserve the fixed `.pdf-toc-number` slot dimensions and absolutely positioned,
overlapping probe anchors. Hiding or moving these links can prevent pagination;
a clean final conversion is also checked for page and internal-link layout
changes. The reserved slots accommodate up to six-digit physical page numbers.

### Cover

Covers are used for all the ebook formats.

To provide a cover, place a **`cover.jpg`** file at the root directory of your book. Adding a **`cover_small.jpg`** will specify a smaller version of the cover. The cover should be a **JPEG** file.

A good cover should respect the following guidelines:

* Size of 1800x2360 pixels for `cover.jpg`, 200x262 for `cover_small.jpg`
* No border
* Clearly visible book title
* Any important text should be visible in the small version
