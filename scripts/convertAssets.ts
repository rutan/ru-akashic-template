import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { packAsync } from 'free-tex-packer-core';
import { glob } from 'glob';

const root = join(new URL('.', import.meta.url).pathname, '..');
const assetsDir = glob.sync(join(root, 'assets', '*')).sort();
const pngDir = join(root, 'game', 'assets', 'textures');
const jsonDir = join(root, 'src', 'assets', 'textures');

const nonNullableFilter = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;
const exporter = {
  fileExt: 'json',
  content: `
{
  "path": "/assets/textures/{{config.imageName}}",
  "frames": {
    {{#rects}}
    "{{{name}}}": {
      "srcX": {{frame.x}},
      "srcY": {{frame.y}},
      "width": {{frame.w}},
      "height": {{frame.h}}
    }{{^last}},{{/last}}
    {{/rects}}
  }
}`.trim(),
};

(async () => {
  mkdirSync(jsonDir, { recursive: true });
  mkdirSync(pngDir, { recursive: true });

  const result = await Promise.all(
    assetsDir.map(async (dir) => {
      if (!statSync(dir).isDirectory()) return null;

      const assetName = basename(dir);
      const images = glob
        .sync(join(dir, '**', '*.{png,jpg,jpeg}'))
        .sort()
        .map((path) => {
          return {
            path: relative(dir, path),
            contents: readFileSync(path),
          };
        });

      const ret = await packAsync(images, {
        exporter,
        textureName: assetName,
        width: 2048,
        height: 2048,
        fixedSize: false,
        padding: 2,
        allowRotation: false,
        detectIdentical: true,
        allowTrim: false,
        removeFileExtension: true,
        prependFolderName: true,
      });

      for (const file of ret) {
        if (file.name.endsWith('.json')) {
          writeFileSync(join(jsonDir, file.name), file.buffer);
          continue;
        }

        writeFileSync(join(pngDir, file.name), file.buffer);
      }

      return {
        assetName,
        assetNameCamelCase: assetName.replace(/(?:^|[-_])([a-z])/g, (_, letter) => letter.toUpperCase()),
      };
    }),
  );

  const code = `
// This code was generated by convertAssets.js
${result
  .filter(nonNullableFilter)
  .map((ret) => `import * as assets${ret.assetNameCamelCase} from './${ret.assetName}.json';`)
  .join('\n')}

export {
${result
  .filter(nonNullableFilter)
  .map((ret) => `  assets${ret.assetNameCamelCase},`)
  .join('\n')}
};`.trim();

  writeFileSync(join(jsonDir, 'index.ts'), code, 'utf-8');
})();