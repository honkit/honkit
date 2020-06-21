# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.10](https://github.com/honkit/honkit/compare/v3.3.9...v3.3.10) (2020-06-20)


### Bug Fixes

* **honkit:** relax "gitbook" engine version check ([d3850a9](https://github.com/honkit/honkit/commit/d3850a9f21f7a01bf39b0ba94101629b69d376e8))





## [3.3.9](https://github.com/honkit/honkit/compare/v3.3.8...v3.3.9) (2020-06-18)

**Note:** Version bump only for package honkit





## [3.3.8](https://github.com/honkit/honkit/compare/v3.3.7...v3.3.8) (2020-06-18)

**Note:** Version bump only for package honkit





## [3.3.7](https://github.com/honkit/honkit/compare/v3.3.6...v3.3.7) (2020-06-18)

**Note:** Version bump only for package honkit





## [3.3.6](https://github.com/honkit/honkit/compare/v3.3.5...v3.3.6) (2020-06-18)

**Note:** Version bump only for package honkit





## [3.3.5](https://github.com/honkit/honkit/compare/v3.3.4...v3.3.5) (2020-06-18)

**Note:** Version bump only for package honkit





## [3.3.4](https://github.com/honkit/honkit/compare/v3.3.3...v3.3.4) (2020-06-17)


### Bug Fixes

* **honkit:** disable confirm on copyDir ([008d66f](https://github.com/honkit/honkit/commit/008d66f29b5488a37b456a4ba6bc426c9ff23a94))
* **honkit:** ignore symlink ([662028a](https://github.com/honkit/honkit/commit/662028a696f962d306da58ee71a8e8bcb61f5287))
* **honkit:** use Buffer.from instead of Buffer constructor ([1d4fe84](https://github.com/honkit/honkit/commit/1d4fe848a80c2bbe052ea5e847cb07529d5087e5)), closes [#26](https://github.com/honkit/honkit/issues/26)
* **honkit:** use lstat instead of stat ([bbe0e41](https://github.com/honkit/honkit/commit/bbe0e410032a2c17d1596f29db65154a6626788c))





## [3.3.3](https://github.com/honkit/honkit/compare/v3.3.2...v3.3.3) (2020-06-16)

**Note:** Version bump only for package honkit





## [3.3.2](https://github.com/honkit/honkit/compare/v3.3.1...v3.3.2) (2020-06-16)


### Bug Fixes

* **honkit:** / is os specific ([2e28891](https://github.com/honkit/honkit/commit/2e288917eff1eecaa6f8034361e3ef1fa5f55293))
* **honkit:** support @honkit/honkit-plugin-theme-default as special ([2adca8d](https://github.com/honkit/honkit/commit/2adca8daa70f1731846672160646ca5a74794bc0))
* **honkit:** validatePlugin ([8a03bcb](https://github.com/honkit/honkit/commit/8a03bcb4e96c3b754e8460e46997447e413bcad6))


### Performance Improvements

* **honkit:** refactor plugin loading ([3e0d841](https://github.com/honkit/honkit/commit/3e0d84133cc8770a2664ddc4f5647fab707a36e0))





## [3.3.1](https://github.com/honkit/honkit/compare/v3.3.0...v3.3.1) (2020-06-15)


### Bug Fixes

* **markdown:** fix markdown parser ([2a1d670](https://github.com/honkit/honkit/commit/2a1d6705521da848233b3518b5adab871a8dc5fb))





# 3.3.0 (2020-06-14)


### Bug Fixes

* remove unused var ([b23b372](https://github.com/honkit/honkit/commit/b23b3728a204323129e57593665f6542dade9a03))
* **fs:** no use util ([2a9b299](https://github.com/honkit/honkit/commit/2a9b2993358978b1a419cb1cc12c568fb01bf779))
* **generate:** Promise.all should handle array ([7e59857](https://github.com/honkit/honkit/commit/7e598574fbf295b93c4d971ac583ed4b937a36a5))
* remove install, <type> ([fffe2d8](https://github.com/honkit/honkit/commit/fffe2d8043f90eacd68e65d01584270c3ec1ce80))


### Features

* **serve:** support incremental build ([88937fd](https://github.com/honkit/honkit/commit/88937fd47c62d0c05a038b07aae95496ba59730a))


### Performance Improvements

* **build:** add cache ([9b1eac6](https://github.com/honkit/honkit/commit/9b1eac6205f5e6479fd1f9f6b33a2674415468d2))
* memorize getArticleByPath ([4cb1a1c](https://github.com/honkit/honkit/commit/4cb1a1c17bc99d3ab325b88b23da42b4e1e79df9))
* use Promise.all on building ([b3e61f5](https://github.com/honkit/honkit/commit/b3e61f5bcbdb1585375016cf65e99702b522be27))
