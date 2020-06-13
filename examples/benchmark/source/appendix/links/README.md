---
author: laco
description: "ここでは本編で取り上げられなかったJavaScriptの周辺ツールやライブラリなどをいくつか紹介します。"
---

# 付録: 参考リンク集 {#reference-links}

ここでは本編で取り上げられなかったJavaScriptの周辺ツールやライブラリなどをいくつか紹介します。
これらは時流に左右されて古くなりやすい情報であるため、本編からは独立した付録としてまとめています。

## 開発を補助するツール {#developer-tools}

JavaScriptを使った開発に役立つツールをいくつか紹介します。

### トランスパイラー {#transpiler}

トランスパイラーとはソースコードからソースコードへ変換（Transpile）する機能を持つツールです。
ここでは、アプリケーション開発でも利用されることが多いJavaScriptのソースコードに変換するトランスパイラーを紹介します。

#### Babel {#babel}

[Babel][]は、ECMAScriptの新しい構文を古いECMAScriptの構文に変換することを主な機能にしたトランスパイラーです。
たとえば、Internet Explorerなど古いブラウザはECMAScript 2015をサポートしていないため新しい構文をパースできません。
BabelでES2015の構文をES5でエミュレートするコードへ変換することで、古い構文しかサポートしていない実行環境でも動かせます。

また、「[ECMAScript][]」の章でも紹介したように、最新のプロポーザルの機能を試すツールとしても利用されています。

#### TypeScript {#typescript}

[TypeScript][]は、JavaScriptに静的型づけの構文を追加した言語とトランスパイラーです。
TypeScript言語には型注釈などの構文が用意されており、JavaScriptのコードに対して型注釈をつけて静的な型チェックができます。
また、TypeScriptのコードは型に関する構文などを取り除いたJavaScriptのコードに変換できます。

### モジュールバンドラー {#module-bundler}

モジュールバンドラーとは、JavaScriptのモジュール依存関係を解決し、複数のモジュールを1つのJavaScriptファイルに結合するツールのことです。
モジュールバンドラーは起点となるモジュールが依存するモジュールを次々にたどり、適切な順序になるように結合（バンドル）します。

NPMによって多くのJavaScriptライブラリがNode.js向けに配布されていますが、これらはほぼすべてCommonJSモジュールです。
CommonJSモジュールはNode.jsでの実行を想定したものであったため、そのままではウェブブラウザ上で動作しません。
そのため、CommonJSモジュールをブラウザでも実行できるようにモジュールの依存関係を解決したりファイルを結合する目的でモジュールバンドラーと呼ばれるツールが登場しました。

#### webpack {#webpack}

[webpack][]は、JavaScriptアプリケーションの作成に適したモジュールバンドラーです。
webpackは、CommonJSモジュールやECMAScriptモジュールの依存関係を解決し、アプリケーション向けに最適化しながらモジュールを結合します。
JavaScriptのモジュール以外にも、画像やCSSなどのリソースを読み込む仕組みが用意されており、さまざまな種類のファイルを扱えます。
また、webpackにはプラグインで拡張できる仕組みが用意されており、柔軟な変換が可能です。

#### Rollup {#rollup}

[Rollup][]は、JavaScriptライブラリの作成に適したモジュールバンドラーです。
Rollupは、ECMAScriptモジュールを主に扱い、モジュールの依存関係を解決し、ライブラリ向けに最適化しながらモジュールを結合します。
CommonJS形式やECMAScriptモジュール形式などの複数の形式のファイルを生成するといったライブラリ作成に向いた設定が柔軟にできます。
またRollupも、webpackと同様にプラグインで拡張でき、柔軟な変換が可能です。

### コーディングスタイルの統一 {#coding-style}

複数人での開発においては、改行の位置やインデントの幅など、ソースコードのフォーマットを統一します。
なぜなら、異なったスタイルのコードはレビューに余計な時間がかかってしまうからです。
また、使うべきでない古いイディオムやバグを生みやすい危険なコードの混入を防ぎ、品質を保つことも重要です。

これらのコーディングスタイルの統一は、一貫性を持って持続的に行うことが重要です。
そのため、ツールを使って自動化することが推奨されます。

#### Prettier {#prettier}

[Prettier][]はJavaScriptをはじめとする多くの言語に対応した汎用的なコードフォーマッターです。
設定ファイルがなくても利用できるため、導入しやすいのが大きな特徴です。

#### ESLint {#eslint}

[ESLint][]はJavaScriptファイル用のLintツールです。
_Lint_ とは、ソースコードファイルを静的解析して不適切なコードやコーディングスタイルに合わないコードを検知する仕組みのことです。
Lintを使うことで、チーム内でのコーディングスタイルを機械的に統一できます。

### コードエディター {#code-editor}

JavaScriptやHTML、CSSなどのコーディングに適したエディターを選ぶことで、開発の生産性を高められます。

#### VSCode {#vscode}

[VSCode][]はMicrosoft社がオープンソースで開発している無料のコードエディターです。
JavaScriptによってプラグインを書くことができ、さまざまな機能を追加できます。

#### Atom {#atom}

[Atom][]はGitHub社がオープンソースで開発している無料のコードエディターです。
VSCodeと同じようにプラグインによる拡張性が高く、GitHubと連携した機能が特徴です。

### ブラウザの開発者ツール {#browser-devtools}

多くのブラウザは開発者向けの組み込みツールを提供しており、本編で紹介したコンソールもその一部です。
そのほかにもJavaScriptコードをステップ実行できるデバッガーや、HTTPの通信ログなど、ブラウザごとにさまざまな機能があります。

- Firefox: [開発ツール | MDN][]
- Chrome: [Chrome DevTools][]
- Safari: [Safari Developer Help][]

### パフォーマンスの改善 {#performance-improvement}

ウェブサイトやウェブアプリケーションのパフォーマンスを計測、改善するためのツールを紹介します。

#### PageSpeed Insights {#pagespeed}

[PageSpeed Insights][]はGoogleが提供するウェブパフォーマンス計測ツールです。
計測したいページのURLを入力すると読み込みにかかっている時間や、改善できる項目を提示してくれます。

#### WebPagetest {#webpagetest}

[WebPagetest][]は、ブラウザを利用したウェブパフォーマンス計測ツールです。
さまざまな条件下のブラウザでウェブサイトにアクセスし、パフォーマンスを計測できます。
BSDライセンスの下でオープンソース化されており、任意のサーバーにインストールして実行することもできます。

#### Lighthouse {#lighthouse}

[Lighthouse][]はGoogleが提供するウェブページの分析ツールです。
ウェブパフォーマンスだけでなく、アクセシビリティやSEOなどの観点からも分析し、そのスコアを表示します。
Chromeブラウザの開発者ツールとして組み込まれていますが、npmでパッケージをインストールすればCLIとしても実行できます。

## JavaScriptの実行プラットフォーム {#javascript-platform}

JavaScriptはウェブサイトを作るためだけの言語ではありません。
いまでは多くのプラットフォームを超えた共通言語として、JavaScriptやその周辺のエコシステムが発展しています。
JavaScriptを使ったプログラムを実行するためのいくつかのプラットフォームについて紹介します。

### ウェブサイトを公開する {#publishing-website}

ウェブサイトやウェブアプリケーションをインターネットに公開するためには、どこかのウェブサーバーでホスティング（公開）する必要があります。
ここではホスティングを機能として提供し、簡単にウェブサイトを公開できるいくつかの _ホスティングサービス_ を紹介します。

#### GitHub Pages {#github-pages}

[GitHub Pages][]は、GitHubが提供する無料のホスティングサービスです。
GitHubのリポジトリをウェブページとして公開して、リポジトリ内に配置したHTMLやCSS、JavaScriptなどの静的ファイルを配信できます。

#### Firebase Hosting {#firebase-hosting}

[Firebase Hosting][]は、GoogleのFirebaseプラットフォームが提供するホスティングサービスです。
CLIを使ったシンプルなデプロイと、小規模の利用なら無料で利用できることが特徴です。

#### Netlify {#netlify}

[Netlify][]も無料で利用できるホスティングサービスです。
GitHubやBitBucketのようなGitリポジトリサービスと連携していて、リモートリポジトリにpushするだけで自動的にデプロイできるのが特徴です。

### Node.jsをサーバーレスに実行する {#serverless}

AWS LambdaやGoogle Cloud Functionsのような[Function as a Service][]（FaaS）と呼ばれる実行プラットフォームがあります。
FaaSではNode.jsのサーバーを用意しなくても関数単位でNode.jsのスクリプトを実行できます。
FaaSにJavaScriptの関数をデプロイすると、クラウド上で管理されているNode.jsサーバーにホストされ、それぞれの関数にエンドポイントが割り当てられます。

#### AWS Lambda {#aws-lambda}

[AWS Lambda][]はAmazon Web Services上で提供されるサーバーレスNode.js実行環境です。

#### Google Cloud Functions {#google-cloud-functions}

[Google Cloud Functions][]はGoogle Cloud Platform上で提供されるサーバーレスNode.js実行環境です。


### デスクトップアプリケーションを作る {#desktop-app}

JavaScriptを使ってWindowsやmacOS、Linuxなどのデスクトップ環境で動作するGUIアプリケーションを作ることもできます。


#### Electron {#electron}

[Electron][]はGitHub社によって開発されているオープンソースのデスクトップアプリケーションフレームワークです。
HTMLやCSS、JavaScriptを使ったウェブアプリケーションをChromiumブラウザと一緒にパッケージ化して配布可能な実行ファイルを作成できます。

#### NW.js {#nwjs}

[NW.js][]はIntel社によって開発されているオープンソースのデスクトップアプリケーションフレームワークです。
Electronと同様にChromiumブラウザをベースにしたアプリケーションを開発できます。
NW.jsはブラウザの中からNode.jsの開発エコシステムを直接利用できるようにしているのが特徴です。

[Babel]: https://babeljs.io/
[ECMAScript]: ../../basic/ecmascript/README.md
[TypeScript]: https://www.typescriptlang.org/

[Webpack]: https://webpack.js.org/
[Rollup]: https://rollupjs.org/

[ESLint]: https://eslint.org/
[Prettier]: https://prettier.io/
[stylelint]: https://stylelint.io/

[VSCode]: https://code.visualstudio.com/
[Atom]: https://atom.io/

[開発ツール | MDN]: https://developer.mozilla.org/ja/docs/Tools
[Chrome DevTools]: https://developers.google.com/web/tools/chrome-devtools/?hl=ja
[Safari Developer Help]: https://support.apple.com/ja-jp/guide/safari-developer/welcome/mac

[PageSpeed Insights]: https://developers.google.com/speed/pagespeed/insights/
[WebPagetest]: https://www.webpagetest.org/
[Lighthouse]: https://developers.google.com/web/tools/lighthouse/?hl=ja

[GitHub Pages]: https://pages.github.com/
[Firebase Hosting]: https://firebase.google.com/products/hosting/?hl=ja
[Netlify]: https://www.netlify.com/

[AWS Lambda]: https://aws.amazon.com/jp/lambda/
[Google Cloud Functions]: https://cloud.google.com/functions/
[Function as a Service]: https://en.wikipedia.org/wiki/Function_as_a_service

[Electron]: https://electronjs.org/
[NW.js]: https://nwjs.io/

