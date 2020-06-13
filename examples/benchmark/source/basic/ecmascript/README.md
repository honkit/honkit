---
author: azu
description: "JavaScriptの仕様であるECMAScriptについてを紹介します。ECMAScriptの歴史や仕様策定がどのようなプロセスで行われているかを紹介します。"
---

# ECMAScript {#ecmascript}

ここまでJavaScriptの基本文法について見てきましたが、その文法を定めるECMAScriptという仕様自体がどのように変化していくのかを見ていきましょう。

ECMAScriptは[Ecma International][]という団体によって標準化されている仕様です。
Ecma InternationalはECMAScript以外にもC#やDartなどの標準化作業をしています。
Ecma Internationalの中のTechnical Committee 39（TC39）という技術委員会が中心となって、ECMAScript仕様について議論しています。
この技術委員会はMicrosoft、Mozilla、Google、AppleといったブラウザベンダーやECMAScriptに関心のある企業などによって構成されます。

## ECMAScriptのバージョンの歴史 {#history}

ここで、簡単にECMAScriptのバージョンの歴史を振り返ってみましょう。

| バージョン | リリース時期  |
| -------- | --------  |
| 1        | 1997年6月  |
| 2        | 1998年6月  |
| 3        | 1999年12月 |
| 4        | 破棄[^1] |
| 5        | 2009年12月 |
| 5.1      | 2011年6月  |
| 2015     | 2015年6月  |
| 2016     | 2016年6月  |
| 2017     | 2017年6月  |
| 以下毎年リリース |

<!-- textlint-disable -->

ES5.1からES2015がでるまで4年もの歳月がかかっているのに対して、ES2015以降は毎年リリースされています。
毎年安定したリリースを行えるようになったのは、ES2015以降に仕様策定プロセスの変更が行われたためです。

<!-- textlint-enable -->


## Living StandardとなるECMAScript {#living-standard}

現在、ECMAScriptの仕様書のドラフトはGitHub上の[tc39/ecma262][]で管理されており、日々更新されています。
そのため、本当の意味での最新のECMAScript仕様は<https://tc39.github.io/ecma262/>となります。
このように更新ごとにバージョン番号をつけずに、常に最新版を公開する仕様のことを**Living Standard**と呼びます。

ECMAScriptはLiving Standardですが、これに加えてECMAScript 2017のようにバージョン番号をつけたものも公開されています。
このバージョンつきECMAScriptは、毎年決まった時期のドラフトを元にしたスナップショットのようなものです。

ブラウザなどに実際にJavaScriptとして実装される際には、Living StandardのECMAScriptを参照しています。
これは、ブラウザ自体も日々更新されるものであり、決まった時期にしかリリースされないバージョンつきよりもLiving Standardのほうが適当であるためです。

## 仕様策定のプロセス {#specification-process}

ES2015以前はすべての仕様の合意が取れるまで延々と議論を続け、すべてが決まってからリリースされていました。
そのため、ES2015がリリースされるまでには長い時間がかかり、言語の進化が停滞していました。
この問題を解消するために、TC39は毎年リリースする形へとECMAScriptの策定プロセスを変更しました。

この策定プロセスはES2015のリリース後に適用され、このプロセスで初めてリリースされたのがES2016となります。
ES2016以降では、次のような仕様策定のプロセスで議論を進めて仕様が決定されています。[^2]

仕様に追加する機能（API、構文など）をそれぞれ個別の**プロポーザル**（提案書）として進めていきます。
現在策定中のプロポーザルはGitHub上の[tc39/proposals][]に一覧が公開されています。
それぞれのプロポーザルは責任者である**チャンピオン**と**ステージ**（Stage）と呼ばれる`0`から`4`の5段階の状態を持ちます。

| ステージ  | ステージの概要                                               |
| :------: | ------------------------------------------------------------ |
|    0     | アイデアの段階                                               |
|    1     | 機能提案の段階                                               |
|    2     | 機能の仕様書ドラフトを作成した段階                               |
|    3     | 仕様としては完成しており、ブラウザの実装やフィードバックを求める段階  |
|    4     | 仕様策定が完了し、2つ以上の実装が存在している<br />正式にECMAScriptにマージできる段階 |

2ヶ月に一度行われるTC39のミーティングにおいて、プロポーザルごとにステージを進めるかどうかを議論します。
このミーティングの議事録もGitHub上の[tc39/tc39-notes][]にて公開されています。
ステージ4となったプロポーザルはドラフト版である[tc39/ecma262][]へマージされます。
そして毎年の決まった時期にドラフト版を元にして`ECMAScript 20XX`としてリリースします。

この仕様策定プロセスの変更は、ECMAScriptに含まれる機能の形にも影響しています。

たとえば、`class`構文の策定は**最大限に最小のクラス**（maximally minimal classes）と呼ばれる形で提案されています。
これによりES2015で`class`構文が導入されましたが、クラスとして合意が取れる最低限の機能だけの状態で入りました。
その他のクラスの機能は別のプロポーザルとして提案され、ES2015以降に持ち越された形で議論が進められています。

このような合意が取れる最低限の形でプロポーザルを進めていくのには、ES4の苦い失敗が背景にあります。
ES4ではECMAScriptに多くの変更を入れることを試みましたが、TC39内でも意見が分かれ、最終的に合意できませんでした。
これによりES4の策定に割いた数年分のリソースが無駄になってしまったという経緯があります。[^3]

ES2016以降の策定プロセスでも、すべてのプロポーザルが仕様に入るわけではありません。[^4]
別の代替プロポーザルが出た場合や後方互換性を保てない場合などにプロポーザルの策定を中断する場合があります。
しかし、この場合でもプロポーザルという単位であるため策定作業の無駄は最小限で済みます。
このようにモジュール化されたプロポーザルは入れ替えがしやすいという性質もあります。

## プロポーザルの機能を試す {#try-proposal}

ECMAScriptの策定プロセスのステージ4に「2つ以上の実装が存在している」という項目があります。
そのためブラウザのJavaScriptエンジンには、策定中のプロポーザルが実装されている場合があります。
多くの場合は試験的なフラグつきで実装されておりフラグを有効化することで、試すことができるようになっています。

またTranspilerやPolyfillといった手段で、プロポーザルの機能をエミュレートできる場合があります。

Transpilerとは、新しい構文を既存の機能で再現できるようにソースコードを変換するツールのことです。
たとえば、ES2015で`class`構文が導入されましたが、ES5では`class`は予約語であるため構文エラーとなり実行できません。
Transpilerでは、`class`構文を含むソースコードを`function`キーワードを使って疑似的に再現するコードへ変換します。
Transpilerとしては[Babel][]や[TypeScript][]などが有名です。

Polyfillとは、新しい関数やメソッドなどの仕様を満たすような実装を提供するライブラリのことです。
たとえば、ES2016では`Array#includes`というメソッドが追加されました。
構文とは異なり`Array#includes`のようなメソッドはビルトインオブジェクトを書き換えることで実装できます。
Polyfillを提供するものとしては[core-js][]や[polyfill.io][]などが有名です。

注意点としてはTranspilerやPolyfillは、あくまで既存の機能を用いて新しい機能の再現を試みているだけにすぎません。
そのため、既存の機能で再現ができないプロポーザル（機能）はTranspilerやPolyfillでは再現できません。
また、完全な再現はできていないことがあるためTranspilerやPolyfillを新しい機能を学ぶために使うべきではありません。

<!-- Notes: バージョンが西暦となった理由

実際に各ブラウザなどはECMAScriptを実装していますが、このときに参照するのは基本的にLiving StandardであるECMAScriptです。
また、PolyfillやTranspilerといった手段で、タグづけされたECMAScript 20XXがリリースされる前にその機能が利用できることも多いです。
ECMAScriptのバージョンとしてES6ではなくES2015のように西暦をバージョンとして使うようになったのも、Living Standardを意識しての試みです。

-->

## 仕様や策定プロセスを知る意味 {#meaning-specification-process}

こうしたECMAScriptという仕様や策定プロセスを知る意味は何があるのでしょうか？　主に次のような理由で知る意味があると考えています。

- 言語を学ぶため
- 言語が進化しているため
- 情報の正しい状態を調べるため

### 言語を学ぶため {#to-learn}

もっとも単純な理由はJavaScriptという言語そのものを学ぶためです。
言語の詳細を知りたい場合にはECMAScriptという仕様を参照できます。

しかしながら、JavaScriptの言語機能に関しては[MDN Web Docs][]という優れたリファレンスサイトなどがあります。
そのため、使い方を覚えたいなどの範囲ではECMAScriptの仕様そのものを参照する機会は少ないでしょう。

### 言語が進化しているため {#to-progress}

ECMAScriptはLiving Standardであり、日々更新されています。
これは、言語仕様に新しい機能や修正などが常に行われていることを表しています。

ECMAScriptは後方互換性を尊重するため、今学んでいることが無駄になるわけではありません。
しかしながら言語自体も進化していることは意識しておくとよいでしょう。

ECMAScriptのプロポーザル（機能）は問題を解決するために提案されます。
そのプロポーザルがECMAScriptにマージされ利用できる場合、その機能が何を解決するために導入されたのかを知ることが大切です。
その際には、ECMAScriptの策定プロセスを知っておくことが役立ちます。

この仕様はなぜこうなったのかということを知りたいと思ったときに、その機能がどのような経緯で入ったのかを調べる手段を持つことは大切です。
特にES2015以降は策定プロセスもGitHubを利用したオープンなものとなり、過去の記録なども探しやすくなっています。

### 情報の正しい状態を調べるため {#to-search}

JavaScriptは幅広く使われている言語であるため、世の中には膨大な情報があります。
そして、検索して見つかる情報には正しいものや間違ったものが混在しています。

その中においてECMAScriptの仕様やその策定中のプロポーザルに関する情報は状態が明確です。
基本的にECMAScriptの仕様に入るものは、後方互換性を維持するために破壊的変更はほとんど行えません。
プロポーザルはステージという明示された状態があり、ステージ4未満の場合はまだ安定していないことがわかります。

そのため、問題を見つけた際に該当する仕様やプロポーザルを確認してみることが重要です。

これはECMAScriptに限らず、ウェブやブラウザに関する情報については同じことが言えます。
ブラウザに関してはHTML、DOM API、CSSなどのオープンな仕様とそれぞれの策定プロセスが存在しています。

### まとめ {#ecmascript-summary}

JavaScriptと一言に言ってもECMAScript、ウェブブラウザ、Node.js、WebAssembly、WebGL、WebRTCなど幅広い分野があります。
すべてのことを知っている必要はありませんし、知っている人もおそらくいないでしょう。
このような状況下においては知識そのものよりも、それについて知りたいと思ったときに調べる方法を持っていることが大切です。

何ごとも突然まったく新しい概念が増えるわけではなく、ものごとには過程が存在します。
ECMAScriptにおいては策定プロセスという形でどのような段階であるかが公開されています。
つまり、仕様にいきなり新しい機能が増えるのではなくプロポーザルという段階を踏んでいます。

日々変化しているソフトウェアにおいては、自身に適切な調べ方を持つことが大切です。

[Ecma International]: http://www.ecma-international.org/  "Ecma International"
[Standard ECMA-262]: https://www.ecma-international.org/publications/standards/Ecma-262.htm "Standard ECMA-262"
[tc39/proposals]: https://github.com/tc39/proposals  "tc39/proposals: Tracking ECMAScript Proposals"
[tc39/ecma262]: https://github.com/tc39/ecma262  "tc39/ecma262: Status, process, and documents for ECMA262"
[tc39/tc39-notes]: https://github.com/tc39/tc39-notes  "tc39/tc39-notes: TC39 Meeting Notes"
[Babel]: https://babeljs.io/  "Babel · The compiler for writing next generation JavaScript"
[TypeScript]: https://www.typescriptlang.org/  "TypeScript - JavaScript that scales."
[core-js]: https://github.com/zloirock/core-js  "zloirock/core-js: Standard Library"
[polyfill.io]: https://polyfill.io/v2/docs/  "Polyfill service"
[MDN Web Docs]: https://developer.mozilla.org/ja/  "MDN Web Docs"
[^1]: ECMAScript 4は複雑で大きな変更が含まれており、合意を得ることができずに仕様が破棄されました。
[^2]: この策定プロセスは<https://tc39.github.io/process-document/>に詳細が書かれています。
[^3]: ES2015の仕様編集者であるAllen Wirfs-Brock氏の書いた[Programming Language Standardization](http://wirfs-brock.com/allen/files/papers/standpats-asianplop2016.pdf)に詳細が書かれています。
[^4]: [Inactive Proposals](https://github.com/tc39/proposals/blob/master/inactive-proposals.md)に策定を中止したプロポーザルの一覧が公開されています。
