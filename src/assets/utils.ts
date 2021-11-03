export interface Frame {
  srcX: number;
  srcY: number;
  width: number;
  height: number;
}

export interface AssetJson {
  name: string;
  path: string;
  frames: { [key: string]: Frame };
}

export interface AssetInfo {
  name: string;
  path: string;
  frame: Frame;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createWithAsset<T extends new (args: any) => any, U extends AssetJson>(
  scene: g.Scene,
  entityClass: T,
  assets: U,
  key: keyof U['frames'],
  options?: Omit<ConstructorParameters<T>[0], 'scene' | 'src' | 'srcX' | 'srcY' | 'width' | 'height'>
) {
  const info = assetInfo(assets, key);
  return new entityClass(
    Object.assign(
      {
        scene,
        src: scene.asset.getImage(info.path),
      },
      info.frame,
      options || {}
    )
  );
}

export function assetInfo<T extends AssetJson>(assets: T, key: keyof T['frames']): AssetInfo {
  const name = assets.name;
  const path = assets.path;
  const frame = assets.frames[key as string];
  if (!frame) throw `invalid asset name: ${key}`;
  return { name, path, frame };
}

export function applyAssetInfo(e: g.Sprite, assetInfo: AssetInfo) {
  e.src = e.scene.asset.getImageById(assetInfo.name);
  e.srcX = assetInfo.frame.srcX;
  e.srcY = assetInfo.frame.srcY;
  e.srcWidth = assetInfo.frame.width;
  e.srcHeight = assetInfo.frame.height;
  e.width = assetInfo.frame.width;
  e.height = assetInfo.frame.height;
  e.modified();
}
