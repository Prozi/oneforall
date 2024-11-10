import * as PIXI from 'pixi.js';
import { PIXITexture } from './model';
export type PIXIScaleMode = 'nearest' | 'linear';
export interface TextureAtlasOptions {
  texture: PIXI.Texture;
  tileWidth?: number;
  tileHeight?: number;
  cols?: number;
  rows?: number;
  offset?: number;
  count?: number;
  scaleMode?: PIXIScaleMode;
  trim?: number;
}
/**
 * for slicing textures into tileset
 */
export declare class TextureAtlas {
  /**
   * texture atlas base texture (required in constructor)
   */
  texture: PIXITexture;
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
   * how many pixels not put to slice from each side of frame
   */
  trim: number;
  /**
   * scale mode for slices
   */
  scaleMode: PIXIScaleMode;
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
    trim,
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
  protected loadSlice(slice: number): PIXITexture;
  /**
   * used internally to preload cached slices
   */
  protected preload(count?: number): void;
}
//# sourceMappingURL=texture-atlas.d.ts.map
