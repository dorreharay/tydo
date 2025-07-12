declare module 'dom-to-image-more' {
  export interface Options {
    filter?: (node: HTMLElement) => boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    quality?: number;
    imagePlaceholder?: string;
    cacheBust?: boolean;
    preferredFontFormat?: 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg';
  }

  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  export function toPixelData(node: HTMLElement, options?: Options): Promise<Uint8ClampedArray>;
  export function toCanvas(node: HTMLElement, options?: Options): Promise<HTMLCanvasElement>;
}