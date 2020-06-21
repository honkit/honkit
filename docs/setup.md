# Setup and Installation of HonKit

Getting HonKit installed and ready-to-go should only take a few minutes.

### Local Installation

##### Requirements

Installing HonKit is easy and straightforward. Your system just needs to meet these two requirements:

* NodeJS (v10.0.0 and above is recommended)
* Windows, Linux, Unix, or Mac OS X

##### Install with NPM

The best way to install HonKit is via **NPM** or **Yarn** At the terminal prompt, simply run the following command to install HonKit:

```
$ npm install honkit --save-dev
# or
$ yarn install honkit --save
```

##### Create a book

HonKit can setup a boilerplate book:

```
$ honkit init
```

If you wish to create the book into a new directory, you can do so by running `honkit init ./directory`

Preview and serve your book using:

```
$ honkit serve
```

Or build the static website using:

```
$ honkit build
```


##### Debugging

You can use the options `--log=debug` and `--debug` to get better error messages (with stack trace). For example:

```
$ honkit build ./ --log=debug --debug
```

