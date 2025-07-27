# @rutan/akashic-template

[Akashic Engine](https://akashic-games.github.io/) でゲームを作るときのプロジェクトのテンプレートだよ。

[Akashic Engine 標準のテンプレート機能](https://github.com/akashic-contents/templates)とは異なり、このリポジトリをまるっとコピーして持っていくタイプです。

## 特徴
公式のテンプレート（ `typescript-shin-ichiba-ranking` ）との主な違いは以下です。

- Vite での事前 bundle / minify
- [storybook](https://storybook.js.org/) を利用したコンポーネント表示
- [free-tex-packer-core](https://github.com/odrick/free-tex-packer-core) を利用した画像の結合＆呼び出し用コードの自動生成
- ニコ生ゲーム以外での公開のための機能
  - 例1）staticフォルダを利用したファイルの追加（favicon.ico など）
  - 例2）localStorageを使用したセーブ機構
- その他、強い "思想"
  - ディレクトリ構成の強制など

なお、公式ではES5へのトランスパイルが行われていますが、このテンプレートでは target を es2015 にしています。

## 必要なもの

- [node.js](https://nodejs.org/)

また、pnpm を利用するため corepack を有効にする必要があります。  
corepack を有効にしていない場合は、以下のコマンドを実行してください。

```
corepack enable pnpm
```

## ディレクトリ構成
```
├ _dist/        … ニコ生などに投稿するzipファイルが出てくる場所
├ assets/       … テクスチャ画像置き場（後述）
├ game/         … ゲーム本体
├ static/       … Webビルド時に一緒に含めるファイル置き場
├ scripts/      … ゲーム本体以外のコード
├ src/          … ゲーム本体のコード
│ ├ assets/    … テクスチャ画像を呼び出すためのコード
│ ├ constants/ … 定数置き場
│ ├ libs/      … ゲーム固有でない汎用処理のコード置き場
│ └ modules/   … ゲーム固有のコード置き場
│   └ _share/  … ゲーム全体で共有するコード置き場
└ tmp/          … ビルド処理とかで使う一時ファイルの出力先
```

## 開発の流れ

### セットアップ
```
# corepackを有効にしていない場合、一度だけ実行する
$ corepack enable pnpm

$ pnpm install
```

### 開発中
```
$ pnpm run dev
```

akashic sandbox が起動します。
`http://localhost:3000` をブラウザで開いてください。

ランキング対応ゲームを作る場合は、右上のメニューから `Niconico` を選択し、`セッションパラメータを送る（要リロード）` にチェックを付けてリロードすることで、ゲームが始まるようになります。

### デプロイメント
```
# ブラウザプレイ用のビルド（PLiCyなど）
$ pnpm run build
$ pnpm run deploy:web

# ニコ生ゲーム投稿用のビルド
$ pnpm run build
$ pnpm run deploy:nicolive
```

## 各種あれこれ

### lint / formatter について

biome を使っています。

```
# 自動修正
$ pnpm run format

# lintの実行
$ pnpm run lint
```

また、コミット時に自動的に lint が実行されるようになっています。

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
複数のシーンにまたがって利用するコードは、必ず `src/modules/_share` に設置してください。

### テクスチャ画像について
free-tex-packer-core を利用した画像アセットをサポートしています。

1. プロジェクトルートにある `assets/` 以下にディレクトリを作成する
2. 中に画像ファイルを入れる
3. `pnpm run assets` を実行
4. free-tex-packer-core で画像の結合＆呼び出し用コード (JSON) の生成

例えば `assets/sample1/` というフォルダ内に画像を設置した場合、 `game/assets/textures/sample1.png` と `src/assets/textures/sample1.json` が生成されます。

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

### Storybook

`pnpm run dev` を実行しているターミナルとは別のターミナルで以下のコマンドを実行することで、 Storybook を起動することができます。

```
$ pnpm run storybook
```

ストーリーの書き方はサンプル（ `src/modules/sample/Sample.stories.ts` ）を参考にしてください。

### static ディレクトリ
Web 向けビルドに生成される zip ファイルの中に static ディレクトリ内のファイルを含むことができます。ニコ生ゲーム向けビルドには含まれません。

ここには favicon などの Web 公開時に必要となるファイルを設置することを想定しています。

### セーブデータについて（上級者向け）

シングルプレイ向けの実行の場合に限り、 `SaveManager` を呼び出すことで、ゲーム中にセーブを行うことができます。

イメージとしてはオートセーブ機能のようなもので、ゲームに1つのセーブファイルのみが存在するという前提のもと実装されています。なお、ロードについてはゲーム起動時に自動的に実行されます。

```typescript
import { getManagers } from '$share';

class MyScene extends g.Scene {
  myFunction() {
    const { SaveManager } = getManagers();

// セーブしたい情報を data に入れる
    SaveManager.data = {
      highScore: 12345
    };

    // セーブの実行（非同期）
    SaveManager.save();
  }
}
```

PLiCyなどのローカルプレイの場合は localStorage が使用されます。ニコ生上でのプレイ時にはダミーのモックストレージが利用されるため、実際にはセーブは行われません。

なお、セーブという仕組みの性質上、リプレイとの相性が悪いです。わかっている人向け。
