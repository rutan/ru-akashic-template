# @rutan/akashic-template

[Akashic Engine](https://akashic-games.github.io/) でゲームを作るときのプロジェクトのテンプレートだよ。

[Akashic Engine 標準のテンプレート機能](https://github.com/akashic-contents/templates)とは異なり、このリポジトリをまるっとコピーして持っていくタイプです。

## 特徴
公式のテンプレート（ `typescript-shin-ichiba-ranking` ）との主な違いは以下です。

- Vite での事前 bundle / minify
- [storybook](https://storybook.js.org/) を利用したコンポーネント表示
- [TexturePacker](https://www.codeandweb.com/texturepacker) を利用した画像の結合＆呼び出し用コードの自動生成
- ニコ生ゲーム以外での公開のための機能
  - 例1）staticフォルダを利用したファイルの追加（favicon.ico など）
  - 例2）localStorageを使用したセーブ機構
- その他、強い "思想"
  - ディレクトリ構成の強制など

なお、公式ではES5へのトランスパイルが行われていますが、このテンプレートでは target を es2015 にしています。

## 必要なもの

このリポジトリでは node のバージョン管理に Volta を使うことを想定しています。

- [Volta](https://volta.sh/)
  - pnpm サポートを有効にしてください
  - 詳細： https://docs.volta.sh/advanced/pnpm
    - 環境変数に `VOLTA_FEATURE_PNPM=1` を設定する

## あると便利なもの

- [TexturePacker](https://www.codeandweb.com/texturepacker)
  - CLIツールを使えるようにしておくこと

## ディレクトリ構成
```
├ _dist/        … ニコ生などに投稿するzipファイルが出てくる場所
├ assets/       … テクスチャ画像置き場（後述）
├ extensions/   … eslintなどのカスタムルール置き場
├ game/         … ゲーム本体
├ static/       … Webビルド時に一緒に含めるファイル置き場
├ scripts/      … ゲーム本体以外のコード
├ src/          … ゲーム本体のコード
│ ├ assets/    … テクスチャ画像を呼び出すためのコード
│ ├ constants/ … 定数置き場
│ ├ libs/      … ゲーム固有でない汎用処理のコード置き場
│ └ modules/   … ゲーム固有のコード置き場
│   └ _share/  … ゲーム全体で共有するコード置き場
└ vendor/       … ダミー用のパッケージ置き場（後述）
```

## 開発の流れ

### セットアップ
```
$ pnpm install
```

### ビルド
#### 開発中（ watch ビルド）
```
$ pnpm run watch
```

#### 本番
```
$ pnpm run zip
```

### 起動
#### ローカル起動

akashic sandbox を利用して起動します

```
$ pnpm run start
```

#### サーバ起動

akashic-serve を利用して起動します

```
$ pnpm run serve
```

## 各種あれこれ

### modules 内の依存関係について

`src/modules` 内はシーンごとにディレクトリを作成することを想定しています。  
ただし `src/modules/_share` のみ特別なディレクトリとして、全シーンで共有するコードを置くことができます。

```
▼ イメージ
src/modules/_share   … 共有コード置き場
src/modules/title    … タイトルシーンのコード
src/modules/play     … プレイシーンのコード
src/modules/result   … リザルトシーンのコード
```

原則として modules 内のコードは他のシーン用のコードを読み込んではいけません。
例えば `src/modules/play` 内から `src/modules/title` 内のコードを import すると、 eslint で設定されたカスタムルールである `no-import-other-scene-modules` によってエラーとなります。

複数のシーンにまたがって利用するコードは、必ず `src/modules/_share` に設置してください。

### テクスチャ画像について
TexturePacker を利用した画像アセットをサポートしています。

1. プロジェクトルートにある `assets/` 以下にディレクトリを作成する
2. 中に画像ファイルを入れる
3. `yarn assets` を実行
4. TexturePacker で画像の結合＆呼び出し用コード (JSON) の生成

例えば `assets/sample1/` というフォルダ内に画像を設置した場合、 `game/assets/textures/sample1.png` と `src/assets/textures/assets_sample1.json` が生成されます。

このテクスチャ画像は以下のようなコードで呼び出すことができます。

```typescript
import { createWithAsset, assetsSample1 } from './assets';

const sprite =
  createWithAsset(
    scene,
    g.Sprite, // インスタンスを作成するclass（普通は g.Sprite ）
    assetsSample1, // assets/textures/以下に自動生成されたJSON
    'ru', // 画像ファイルの名前（拡張子は無し）
    {
      // g.Sprite の引数にわたすパラメータ
      // ただし src などは自動設定されるため不要
      x: 100,
      y: 200,
    }
  );
scene.append(sprite);
```

ただし、結合後の画像が 2048x2048 を超えないようにしてください。

### static ディレクトリ
Web 向けビルドに生成される zip ファイルの中に static ディレクトリ内のファイルを含むことができます。ニコ生ゲーム向けビルドには含まれません。

ここには favicon などの Web 公開時に必要となるファイルを設置することを想定しています。

## その他

### resolutions の指定

`@akashic/akashic-cli` などが一部非公開パッケージ（？）を optionalDependency に指定しているため、 `yarn install` がコケてしまう……！(◞‸◟)

そのため、 yarn install をコケさせないために optionalDependency のパッケージのダミーを resolutions に指定しています。

### TexturePackerのCLIツール in WSL

Windows 上の TexturePacker を使いたいのでこういうのを書いてる。WSL2 で動くかは不明。

```
#!/bin/bash

/mnt/d/Tools/TexturePacker/bin/TexturePacker.exe $@
```

※パスは適宜よい場所を指定しよう！
