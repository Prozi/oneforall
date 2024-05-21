import * as PIXI from 'pixi.js';

// declare this on server or in tests to save memory
declare var headless: boolean;

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

export class TextureAtlas {
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
  slices: PIXI.Texture[] = [];

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
    offset = 0,
    scaleMode = 'nearest'
  }: TextureAtlasOptions) {
    this.texture = texture;
    if (tileWidth && tileHeight) {
      this.tileWidth = tileWidth;
      this.tileHeight = tileHeight;
    } else if (cols && rows) {
      this.tileWidth = this.width / cols;
      this.tileHeight = this.height / rows;
    } else {
      throw new Error('Specify tileWidth/tileHeight or cols/rows.');
    }
    this.offset = offset;
    this.scaleMode = scaleMode;
    this.preload(count);
  }

  /**
   * width read from texture
   */
  get width(): number {
    return this.texture.width;
  }

  /**
   * height read from texture
   */
  get height(): number {
    return this.texture.height;
  }

  /**
   * get lazy cached slice on index
   */
  get(frame: number): PIXI.Texture {
    if (typeof headless !== 'undefined') {
      return PIXI.Texture.WHITE;
    }

    if (!this.slices[frame]) {
      this.loadSlice(frame);
    }

    return this.slices[frame];
  }

  /**
   * used internally in get(frame) to load the slice first time
   */
  protected loadSlice(frame: number): PIXI.Texture {
    if (typeof headless !== 'undefined') {
      return PIXI.Texture.WHITE;
    }

    const cols: number = Math.floor(this.width / this.tileWidth);
    const index: number = Math.floor(frame - this.offset);
    const x: number = (index % cols) * this.tileWidth;
    const y: number = Math.floor(index / cols) * this.tileHeight;
    const texture: PIXI.Texture = new PIXI.Texture({
      source: this.texture.source,
      frame: new PIXI.Rectangle(x, y, this.tileWidth, this.tileHeight)
    });

    texture.source.scaleMode = this.scaleMode;

    return texture;
  }

  /**
   * used internally to preload cached slices
   */
  protected preload(
    count = Math.floor(
      (this.width / this.tileWidth) * (this.height / this.tileHeight)
    )
  ): void {
    if (this.slices.length) {
      throw new Error("Don't call prepare() twice.");
    }

    Array.from({ length: count }, (_, frame) => {
      const texture = this.loadSlice(frame);
      this.slices.push(texture);
    });
  }
}
