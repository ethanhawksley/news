import fs from 'node:fs';
import path from 'node:path';

const fontPath = path.join(process.cwd(), 'public/fonts/ibm-sans-subset.woff2');

const fontBase64 = fs.readFileSync(fontPath).toString('base64');

export const fontFaceCss = `@font-face{font-family:'IBM Sans Subset';font-style:normal;font-weight:400 600;src:url('data:font/woff2;charset=utf-8;base64,${fontBase64}') format('woff2');font-display:block;}`;
