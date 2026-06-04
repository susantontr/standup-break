// Generates PNG app icons at all required macOS sizes using only Node built-ins
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

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

function makePNG(size) {
  const W = size, H = size;
  const cx = W / 2, cy = H / 2;
  const raw = [];

  for (let y = 0; y < H; y++) {
    raw.push(0); // filter byte
    for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const bgR = W * 0.48;

      // Background circle (dark teal)
      if (r <= bgR) {
        // Bird body (white ellipse in upper-center)
        const bx = x - cx * 1.0, by = y - cy * 0.6;
        const bodyR = W * 0.28;
        const inBody = (bx * bx) / (bodyR * bodyR) + (by * by) / (bodyR * 0.75 * bodyR * 0.75) <= 1;

        // Wing (white arc on left)
        const wx = x - cx * 0.3, wy = y - cy * 0.9;
        const wingR = W * 0.32;
        const inWing = (wx * wx + wy * wy) <= wingR * wingR && wx < 0 && wy < W * 0.05;

        // Beak (orange triangle pointing right)
        const beakX = x - (cx + W * 0.22);
        const beakY = y - cy * 0.55;
        const inBeak = beakX >= 0 && beakX <= W * 0.14 && Math.abs(beakY) <= W * 0.06 - beakX * 0.4;

        // Tail (white triangle on left)
        const tx = x - cx * 0.15, ty = y - cy * 1.1;
        const inTail = tx < 0 && ty > 0 && ty < -tx * 0.7 && ty < W * 0.18;

        if (inBeak) {
          raw.push(255, 140, 0, 255); // orange beak
        } else if (inBody || inWing || inTail) {
          raw.push(255, 255, 255, 255); // white bird parts
        } else {
          raw.push(45, 130, 130, 255); // teal background
        }
      } else {
        raw.push(0, 0, 0, 0); // transparent outside circle
      }
    }
  }

  const deflated = zlib.deflateSync(Buffer.from(raw));
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflated),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const sizes = [16, 32, 64, 128, 256, 512, 1024];
const iconsetDir = path.join(__dirname, '..', 'assets', 'icon.iconset');

for (const size of sizes) {
  const png = makePNG(size);
  // macOS iconset naming convention
  if (size <= 512) {
    fs.writeFileSync(path.join(iconsetDir, `icon_${size}x${size}.png`), png);
  }
  if (size >= 32) {
    const half = size / 2;
    fs.writeFileSync(path.join(iconsetDir, `icon_${half}x${half}@2x.png`), png);
  }
  console.log(`✓ ${size}x${size}`);
}

console.log('Done! Now run: iconutil -c icns assets/icon.iconset -o assets/icon.icns');
