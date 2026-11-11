// The same driver interface on ImageKit (this is how the main server of this site stores files).
// NOT run in this course: it needs an ImageKit account and IMAGEKIT_PRIVATE_KEY.  npm install @imagekit/nodejs
import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });

export function imagekitDriver() {
  const ids = new Map();     // key -> ImageKit file id (keep this in your database in a real app)
  return {
    async put(key, buffer) {
      const uploaded = await imagekit.files.upload({ file: buffer.toString('base64'), fileName: key });
      ids.set(key, uploaded.fileId);
    },
    async get(key) {
      throw new Error('Serve ImageKit files by their URL instead of through your server');
    },
    async remove(key) {
      if (ids.has(key)) await imagekit.files.delete(ids.get(key));
    },
  };
}
