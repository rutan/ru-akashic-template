# @rutan/akashic-template

[Akashic Engine](https://akashic-games.github.io/) でゲームを作るときのプロジェクトのテンプレートだよ。

## 必要なもの

- node.js
- yarn
- [TexturePacker](https://www.codeandweb.com/texturepacker)
    - CLIツールを使えるようにしておくこと

## ディレクトリ構成
```
├ _dist/        … アツマールに投稿するzipファイルが出てくる場所
├ assets/       … テクスチャ画像置き場（後述）
├ extensions/   … eslintなどのカスタムルール置き場
├ game/         … ゲーム本体
├ public/       … アツマールに投稿するzipに一緒に含めるファイル置き場
├ scripts/      … ゲーム本体以外のコード
├ src/          … ゲーム本体のコード
│ ├ assets/    … テクスチャ画像を呼び出すためのコード
│ ├ constants/ … 定数置き場
│ ├ libs/      … ゲーム固有でない汎用処理のコード置き場
│ └ modules/   … ゲーム固有のコード置き場
│   └ _share/  … ゲーム全体で共有するコード置き場
└ vendor/       … ダミー用のパッケージ置き場（後述）
```

## 各種あれこれ

### modules内の依存関係について

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
TexturePackerを利用した画像アセットをサポートしています。

1. プロジェクトルートにある `assets/` 以下にディレクトリを作成する
2. 中に画像ファイルを入れる
3. `yarn assets` を実行
4. TexturePacker で画像の結合＆呼び出し用コード(JSON)の生成

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

ただし、結合後の画像が2048x2048を超えないようにしてください。

### アツマールの「おれいポップアップ」API

アツマールの [おれいポップアップ](https://atsumaru.github.io/api-references/thanks/) は `src/config.yaml` で設定できます。

おれい用の画像を変更する場合は、 `public/atsumaru` 内の画像を差し替えたり追加したりしてください。

### アツマールの「ニコニ広告」API

アツマールの [ニコニ広告API](https://atsumaru.github.io/api-references/nicoad/) を利用して、アツマール上でのゲーム起動時に画面下部にニコニ広告をしてくれた方の名前が表示されます。  
表示内容のカスタマイズは `src/config.yaml` で行うことができます。

このニコニ広告表示は [Torigoya_NiconikoBar](https://torigoya-plugin.rutan.dev/service/niconikoBar/) をベースとしています。

## その他

### resolutions の指定

`@akashic/akashic-cli` などが一部非公開パッケージ（？）を optionalDependency に指定しているため、yarn installがコケてしまう……！(◞‸◟)

そのため、 yarn install をコケさせないために optionalDependency のパッケージのダミーを resolutions に指定しています。

### TexturePackerのCLIツール in WSL

Windows上のTexturePackerを使いたいのでこういうのを書いてる。WSL2で動くかは不明。

```
#!/bin/bash

/mnt/d/Tools/TexturePacker/bin/TexturePacker.exe $@
```

※パスは適宜よい場所を指定しよう！
