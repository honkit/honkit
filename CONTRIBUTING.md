# Contributing Guide


### Installing Prerequisites

Please install following development prerequisites. You also need a [GitHub](https://github.com/) account for contribution.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/)


### Cloning Copy of HonKit

Forking a repository allows you to work with HonKit codebase without special permission to the HonKit repository itself.

1. Navigate to [HonKit](https://github.com/honkit/honkit/) repository
2. In the top–right corner of the page, click **Fork** button
3. Create a clone of the fork locally in your terminal:

    ```sh
    $ git clone --recursive https://github.com/YOUR_ACCOUNT/honkit YOUR_FORKED_REPOSITORY
    ```

See [Fork A Repo: GitHub Help](https://help.github.com/articles/fork-a-repo/) for further detail.

### Building HonKit

After getting your clone, you can start playing with HonKit.

1. Change directory to your clone:

    ```sh
    $ cd YOUR_FORKED_REPOSITORY
    ```

2. Install dependencies and build packages:

    ```sh
    $ yarn install
    ```

3. Run build:

    ```sh
    $ yarn run build
    ```

Under the hood, HonKit uses [Lerna](https://lerna.js.org/) to manage multiple packages:

- `packages/*`
- `packages/@honkit/*`
- `examples/*`

If you are new to Lerna, it seems to add another layer of complexity, but it's simpler than you think; you can edit codes, run tests, commit changes, etc. as usual in most cases.

Note that `yarn install` also builds a codebase, you can manually build by running `yarn run build`.

### Creating a Branch for Your Work

Before adding changes to your clone, please create a new branch (typically called _feature branch_). Changes made to feature branch don't affect or corrupt `master` branch so you will feel safe. In Git, creating a branch is easy and fast:

```sh
$ git checkout -b your-new-feature
```

### Making Changes

You have your feature branch with working HonKit then it's time to start making changes! Edit codes with text editor of your choice and add commits as you work on. Please don't forget to add or modify test cases and documents according to your changes.


#### Coding Guideline

##### Linting and Style

This repository uses [Prettier](https://prettier.io/) for code formatter. We use [`lint-staged`](https://www.npmjs.com/package/lint-staged) and [`husky`](https://www.npmjs.com/package/husky) to make coding style consistent before commit, but if you have your own [Git hooks](https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks) locally, these setup doesn't work. In such case, please run Prettier manually as below after making changes.

- Run Prettier to reformat code:

    ```sh
    $ yarn prettier
    ```

##### Commit Message Format

We use [Angular Convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) for commit message.

In order to make repository history clean, please use the following guideline as possible as you can. It also enables us creating comprehensive changelog semi–automatically.

```
                      component        commit title
       commit type       /                /
               \        |                |
                feat(rule-context): add template url parameter to events
                (a blank line)
       body ->  The `src` (i.e. the url of the template to load) is now provided to the
                `$includeContentRequested`, `$includeContentLoaded` and `$includeContentError`
                events.

referenced  ->  Closes #8453
issues          Ref. #8454
```

- commit type:
    - `docs`: create or update document
    - `feat`: add new feature
    - `fix`: fix a bug
    - `style`: change formatting
    - `perf`: performance related change
    - `test`: update on tests
    - `chore`: house–keeping
    - `refactor`: refactoring related change
- component: package or file name
- commit title:
    - Limit to 50 characters including commit type and component (as possible as you can)
    - Do not capitalize first character
    - Do not end with a period
    - Use imperative mood, in present tense; commit title should always be able to complete the following sentence:
        - If applied, this commit will _commit title here_
- body:
    - Separate from subject with a blank line
    - Wrap texts at 72 characters
    - Explain _what_ and _why_, not _how_
    - [GitHub flavored Markdown](https://github.github.com/gfm/) is ok to use
    - Start with `BREAKING CHANGE: ` when you made significant change in the commit (see versioning section below).

Example commit message:

```
test(formatter): check types while testing

- Add strict type check option to `ts-node` to make sure future
  interface changes will be took into account while running test.
- Update test case for interface changes made at #430.

Closes #448.
```

Please see [Commit Message Format](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) and [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) for detail.


### Running Tests

We have some type of tests. You should run at least **unit test** before submitting a pull request.

All tests should be run at the top directory of your fork.

#### Unit Test

Run tests for all packages:

```sh
$ yarn test
```

While developing, it would be good to run package level unit test since it will run faster:

```sh
$ cd packages/PACKAGE
$ yarn test
```


### Pushing the Commit and Opening a Pull Request

After finishing your changes and unit tests or documentation test ran fine, you can push your feature branch to GitHub. Please see [GitHub Help](https://help.github.com/articles/pushing-to-a-remote/) for detail but typically, run `git push` at your terminal.

```sh
$ git push origin feature-branch
```

Then follow another [GitHub Help](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) to create a pull request.

### Working with Reviews (if any)

Once a pull request has been created, it will initiate continuous integration builds and we can work on your changes. You can push additional commits to your fork according to feedback.

### Merging

After all participants on pull request are satisfied to the changes, we will merge your code into the HonKit master branch. Yay!

## Benchmark

HonKit has a continuous benchmark:

- <https://honkit.github.io/honkit/dev/bench/>

## Release Flow

A Maintainer releases a new version of HonKit by following way.

1. Checkout release branch

```
# checkout release branch like "release/2019-10-10"
git checkout -b "release/$(date '+%Y-%m-%d')"
```

2. Version up and Update CHANGELOG via `versionup` script

`npm run versionup:*` script update version and generate CHANGELOG.md

```
# bump vesrion and update changelog
npm run versionup
## Also, availble npm run versionup:{patch,minor,major}
# push the changes to release branch
git push origin HEAD -u
```

3. Create a Pull Request and Review the release

Create a Pull Request from the release branch, and we will review it.

:memo: GitHub Release page use this pull request.

- Pull Request's title = Release title
- Pull Request's body = Release body

4. Merge the Pull Request

Finally, GitHub Actions(CI) publish it to npm and dockerhub automatically.
