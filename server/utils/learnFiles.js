// Where lesson solution zips live.
//  - Uploaded by an admin: LEARN_FILES_DIR (default server/storage/learn-files). Keep this folder out of git and
//    out of the deploy's clean step, or uploads disappear on the next release.
//  - Shipped with the repo: learn-labs/<lab>/zips/<file> (download.builtin = true, download.file = "<lab>/<file>").
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const FILES_DIR = process.env.LEARN_FILES_DIR || path.join(here, '..', 'storage', 'learn-files');
export const LABS_DIR = path.join(here, '..', 'learn-labs');
export const MAX_ZIP_BYTES = 25 * 1024 * 1024;

export const isZip = (buf) => Buffer.isBuffer(buf) && buf.length > 22 && buf[0] === 0x50 && buf[1] === 0x4b && (buf[2] === 3 || buf[2] === 5) && (buf[3] === 4 || buf[3] === 6);

export const safeName = (name) => {
    const base = String(name || 'solution.zip').split(/[\\/]/).pop().replace(/\.zip$/i, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, 80);
    return `${base || 'solution'}.zip`;
};

export const saveUpload = (buf) => {
    fs.mkdirSync(FILES_DIR, { recursive: true });
    const file = `${crypto.randomBytes(12).toString('hex')}.zip`;
    fs.writeFileSync(path.join(FILES_DIR, file), buf);
    return file;
};

export const removeUpload = (file) => {
    if (!/^[a-f0-9]{24}\.zip$/.test(file || '')) return;
    try { fs.unlinkSync(path.join(FILES_DIR, file)); } catch { /* already gone */ }
};

// Absolute path of a lesson's download, or null.
export const downloadPath = (d) => {
    if (!d?.file) return null;
    if (d.builtin) {
        const m = /^([a-z0-9-]{1,60})\/(ai-lab-lesson-\d{2}\.zip)$/.exec(d.file);
        return m ? path.join(LABS_DIR, m[1], 'zips', m[2]) : null;
    }
    return /^[a-f0-9]{24}\.zip$/.test(d.file) ? path.join(FILES_DIR, d.file) : null;
};

export const builtinDownload = (lab, n) => {
    const file = `ai-lab-lesson-${String(n).padStart(2, '0')}.zip`;
    const full = path.join(LABS_DIR, lab, 'zips', file);
    if (!fs.existsSync(full)) return undefined;
    return { name: file, file: `${lab}/${file}`, size: fs.statSync(full).size, builtin: true, uploadedAt: new Date() };
};
