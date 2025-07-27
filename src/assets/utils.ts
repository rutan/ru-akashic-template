export interface Frame {
  srcX: number;
  srcY: number;
  width: number;
  height: number;
}

export interface AssetJson {
  path: string;
  frames: { [key: string]: Frame };
}

export interface AssetInfo {
  path: string;
  frame: Frame;
}

// biome-ignore lint/suspicious/noExplicitAny: any
export function createWithAsset<T extends new (args: any) => any, U extends AssetJson>(
  scene: g.Scene,
  entityClass: T,
  assets: U,
  key: keyof U['frames'],
  options?: Omit<ConstructorParameters<T>[0], 'scene' | 'src' | 'srcX' | 'srcY' | 'width' | 'height'>,
): InstanceType<T> {
  const info = assetInfo(assets, key);
  return new entityClass({
    scene,
    src: scene.asset.getImage(info.path),
    ...info.frame,
    ...(options || {}),
  });
}

export function assetInfo<T extends AssetJson>(assets: T, key: keyof T['frames']): AssetInfo {
  const path = assets.path;
  const frame = assets.frames[key as string];
  if (!frame) throw `invalid asset name: ${String(key)}`;
  return { path, frame };
}

export function applyAssetInfo(e: g.Sprite, assetInfo: AssetInfo) {
  e.src = e.scene.asset.getImage(assetInfo.path);
  e.srcX = assetInfo.frame.srcX;
  e.srcY = assetInfo.frame.srcY;
  e.srcWidth = assetInfo.frame.width;
  e.srcHeight = assetInfo.frame.height;
  e.width = assetInfo.frame.width;
  e.height = assetInfo.frame.height;
  e.modified();
}

export function applyAssetFrame(e: g.Sprite, frame: Frame) {
  e.srcX = frame.srcX;
  e.srcY = frame.srcY;
  e.srcWidth = frame.width;
  e.srcHeight = frame.height;
  e.width = frame.width;
  e.height = frame.height;
  e.modified();
}
