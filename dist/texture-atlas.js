'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            }
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.TextureAtlas = void 0;
const PIXI = __importStar(require('pixi.js'));
/**
 * for slicing textures into tileset
 */
class TextureAtlas {
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
    trim = 0,
    scaleMode = 'nearest'
  }) {
    /**
     * texture slices
     */
    this.slices = [];
    this.texture = texture;
    this.trim = trim;
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
  get width() {
    return this.texture.width;
  }
  /**
   * height read from texture
   */
  get height() {
    return this.texture.height;
  }
  /**
   * get lazy cached slice on index
   */
  get(frame) {
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
  loadSlice(frame) {
    if (typeof headless !== 'undefined') {
      return PIXI.Texture.WHITE;
    }
    const cols = Math.floor(this.width / this.tileWidth);
    const index = Math.floor(frame - this.offset);
    const x = (index % cols) * this.tileWidth;
    const y = Math.floor(index / cols) * this.tileHeight;
    const texture = new PIXI.Texture({
      source: this.texture.source,
      frame: new PIXI.Rectangle(
        this.trim + x,
        this.trim + y,
        this.tileWidth - this.trim * 2,
        this.tileHeight - this.trim * 2
      )
    });
    texture.source.scaleMode = this.scaleMode;
    return texture;
  }
  /**
   * used internally to preload cached slices
   */
  preload(
    count = Math.floor(
      (this.width / this.tileWidth) * (this.height / this.tileHeight)
    )
  ) {
    if (this.slices.length) {
      throw new Error("Don't call prepare() twice.");
    }
    Array.from({ length: count }, (_, frame) => {
      const texture = this.loadSlice(frame);
      this.slices.push(texture);
    });
  }
}
exports.TextureAtlas = TextureAtlas;
