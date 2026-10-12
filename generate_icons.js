const fs = require('fs');
const zlib = require('zlib');

// Create a simple valid PNG generator using node's zlib
function createPng(width, height, colorR, colorG, colorB) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with scanline filter bytes
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData.writeUInt8(0, rowOffset); // filter 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Soft pink gradient with white center
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      let r = colorR;
      let g = colorG;
      let b = colorB;
      let a = 255;

      // Outer rounded rect border or circle
      if (dist > 0.95) {
        a = 0; // transparent corners
      } else {
        // Gradient shading
        r = Math.min(255, Math.floor(colorR + (1 - dist) * 25));
        g = Math.min(255, Math.floor(colorG + (1 - dist) * 35));
        b = Math.min(255, Math.floor(colorB + (1 - dist) * 35));
      }

      rawData.writeUInt8(r, pxOffset);
      rawData.writeUInt8(g, pxOffset + 1);
      rawData.writeUInt8(b, pxOffset + 2);
      rawData.writeUInt8(a, pxOffset + 3);
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', idatData);

  // IEND chunk
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);

  const crc = Buffer.alloc(4);
  crc.writeInt32BE(calcCrc(body), 0);

  return Buffer.concat([len, body, crc]);
}

function calcCrc(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1);
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

// Rose Pink: rgb(224, 90, 126)
fs.writeFileSync('icons/icon-192.png', createPng(192, 192, 224, 90, 126));
fs.writeFileSync('icons/icon-512.png', createPng(512, 512, 224, 90, 126));

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F47294"/>
      <stop offset="50%" stop-color="#E05A7E"/>
      <stop offset="100%" stop-color="#C94367"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#831843" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#roseGrad)"/>
  <!-- Shopping Cart with Shield badge -->
  <g transform="translate(100, 100)" stroke="#FFFFFF" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#shadow)">
    <!-- Cart Body -->
    <circle cx="90" cy="260" r="16" fill="#FFFFFF"/>
    <circle cx="230" cy="260" r="16" fill="#FFFFFF"/>
    <path d="M10 20 h50 l38 180 h150 l32 -130 h-200" />
    <!-- Heart / Shield icon inside trolley -->
    <path d="M160 70 C145 50 120 50 105 70 C85 95 105 130 160 160 C215 130 235 95 215 70 C200 50 175 50 160 70 Z" fill="#FFFFFF" fill-opacity="0.9" stroke="none"/>
  </g>
</svg>`;

fs.writeFileSync('icons/icon.svg', svgIcon);
console.log('Icons generated successfully!');
