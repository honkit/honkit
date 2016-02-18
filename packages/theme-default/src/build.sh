#! /bin/bash

# Cleanup folder
rm -rf _assets

# Recreate folder
mkdir -p _assets/website/
mkdir -p _assets/ebook/

# Compile JS
browserify src/js/main.js | uglifyjs -mc > _assets/website/app.js

# Compile Website CSS
lessc src/less/website.less _assets/website/style.css

# Compile eBook CSS
lessc src/less/ebook.less _assets/ebook/ebook.css
lessc src/less/pdf.less _assets/ebook/pdf.css
lessc src/less/mobi.less _assets/ebook/mobi.css
lessc src/less/epub.less _assets/ebook/epub.css

