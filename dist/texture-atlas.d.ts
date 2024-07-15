import * as PIXI from 'pixi.js';
export interface TextureAtlasOptions {
  texture: PIXI.Texture;
  tileWidth?: number;
  tileHeight?: number;
  cols?: number;
  rows?: number;
  offset?: number;
  count?: number;
  scaleMode?: PIXI.SCALE_MODE;
}
/**
 * for slicing textures into tileset
 */
export declare class TextureAtlas {
  /**
   * texture atlas base texture (required in constructor)
   */
  texture: PIXI.Texture;
  /**
   * calculated from cols/rows or passed in constructor
   */
  tileWidth: number;
  /**
   * calculated from cols/rows or passed in constructor
   */
  tileHeight: number;
  /**
   * get(frame) gets slice of index frame - offset
   * if unsure leave at 0
   */
  offset: number;
  /**
   * scale mode for slices
   */
  scaleMode: PIXI.SCALE_MODE;
  /**
   * texture slices
   */
  slices: PIXI.Texture[];
  /**
   * create texture atlas
   * @param textureAtlasOptions
   */
  constructor({
    texture,
    tileWidth,
    tileHeight,
    cols,
    rows,
    count,
    offset,
    scaleMode
  }: TextureAtlasOptions);
  /**
   * width read from texture
   */
  get width(): number;
  /**
   * height read from texture
   */
  get height(): number;
  /**
   * get lazy cached slice on index
   */
  get(frame: number): PIXI.Texture;
  /**
   * used internally in get(frame) to load the slice first time
   */
  protected loadSlice(frame: number): PIXI.Texture;
  /**
   * used internally to preload cached slices
   */
  protected preload(count?: number): void;
}
//# sourceMappingURL=texture-atlas.d.ts.map
