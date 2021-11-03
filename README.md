# @rutan/akashic-template

[Akashic Engine](https://akashic-games.github.io/) でゲームを作るときのプロジェクトのテンプレートだよ。

## 必要なもの

- node.js
- yarn
- [TexturePacker](https://www.codeandweb.com/texturepacker)
    - CLIツールを使えるようにしておくこと

## ディレクトリ構成
```
├ _dist/   … アツマールに投稿するzipファイルが出てくる場所
├ assets/  … テクスチャ画像置き場（後述）
├ game/    … ゲーム本体
├ public/  … アツマールに投稿するzipに一緒に含めるファイル置き場
├ scripts/ … ゲーム本体以外のコード
├ src/     … ゲーム本体のコード
│ ├ assets/   … テクスチャ画像を呼び出すためのコード
│ ├ libs/     … ゲーム固有でない汎用処理のコード置き場
│ └ modules/  … ゲーム固有のコード置き場
└ vendor/  … ダミー用のパッケージ置き場（後述）
```

## 各種あれこれ

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
