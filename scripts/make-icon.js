// Generates a 22x22 PNG tray icon using only Node built-ins
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const W = 22, H = 22;

// Simple bird silhouette (1 = orange, 0 = transparent)
const bitmap = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
  [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

// Build raw RGBA pixel data — orange bird (#FF6B00)
const raw = [];
for (let y = 0; y < H; y++) {
  raw.push(0); // PNG filter byte
  for (let x = 0; x < W; x++) {
    if (bitmap[y][x]) {
      raw.push(255, 107, 0, 255); // orange, fully opaque
    } else {
      raw.push(0, 0, 0, 0);       // transparent
    }
  }
}

const deflated = zlib.deflateSync(Buffer.from(raw));

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

const png = Buffer.concat([
  Buffer.from([137,80,78,71,13,10,26,10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflated),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = path.join(__dirname, '..', 'assets', 'tray-icon.png');
fs.writeFileSync(out, png);
console.log('Icon written to', out);
