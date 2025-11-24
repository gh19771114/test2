declare module 'fontkit' {
  interface Font {
    postscriptName?: string;
    fullName?: string;
    familyName?: string;
    subfamilyName?: string;
    [key: string]: any;
  }

  interface Fontkit {
    create(buffer: Buffer | Uint8Array): Font;
    [key: string]: any;
  }

  const fontkit: Fontkit;
  export default fontkit;
  
  // 导出类型以兼容 pdf-lib
  export type { Font, Fontkit };
}

