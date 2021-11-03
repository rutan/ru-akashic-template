export type SceneEvent = SceneChangeEvent;

export interface SceneChangeEvent {
  type: 'change';
  name: string;
}
