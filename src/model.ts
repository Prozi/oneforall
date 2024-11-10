export type PIXITexture = {
  width: number;
  height: number;
  // pixi v6
  name?: string;
  baseTexture?: any;
  // pixi v8
  label?: string;
  source?: { scaleMode: 'nearest' | 'linear' };
};
