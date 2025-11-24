declare module 'fontkit' {
  interface Font {
    [key: string]: any;
  }

  interface Fontkit {
    create(buffer: Buffer | Uint8Array): Font;
    [key: string]: any;
  }

  const fontkit: Fontkit;
  export default fontkit;
}

