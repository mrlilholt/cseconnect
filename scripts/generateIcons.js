import fs from 'fs';
import zlib from 'zlib';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function createPng({ width, height, color }) {
  const [r, g, b, a] = color;
  const row = Buffer.alloc(width * 4, 0);
  for (let x = 0; x < width; x += 1) {
    const idx = x * 4;
    row[idx] = r;
    row[idx + 1] = g;
    row[idx + 2] = b;
    row[idx + 3] = a;
  }

  const raw = Buffer.alloc((width * 4 + 1) * height, 0);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // filter type 0
    row.copy(raw, rowStart + 1);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const compressed = zlib.deflateSync(raw);

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const color = [11, 31, 51, 255];

const icon192 = createPng({ width: 192, height: 192, color });
const icon512 = createPng({ width: 512, height: 512, color });
const apple = createPng({ width: 180, height: 180, color });

fs.writeFileSync('public/pwa-192x192.png', icon192);
fs.writeFileSync('public/pwa-512x512.png', icon512);
fs.writeFileSync('public/apple-touch-icon.png', apple);

console.log('Icons generated.');
