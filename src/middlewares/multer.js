import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import crypto from 'crypto';
import s3 from '../config/s3.js';
import ENV from '../../src/config/env.js';
import ApiError from '../utils/ApiError.js';

const MIME_TYPE_MAP = {
  image: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ],
  video: [
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
};

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
};

const getSafeExtension = (file) => {
  const rawExt = path.extname(file.originalname || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  if (rawExt && /^\.[a-z0-9]{1,10}$/.test(rawExt)) {
    return rawExt;
  }
  return MIME_TO_EXT[file.mimetype] || '';
};

const fileFilter = (req, file, cb) => {
  const uploadType = req.params?.type;
  if (uploadType && MIME_TYPE_MAP[uploadType]) {
    const allowedMimeTypes = MIME_TYPE_MAP[uploadType];
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new ApiError(400, `Unsupported file type: ${file.mimetype} for ${uploadType} upload`), false);
  }

  // Fallback if type is not specifically one of image/video/document
  const allAllowedMimeTypes = Object.values(MIME_TYPE_MAP).flat();
  if (allAllowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`), false);
};

const upload = multer({
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 25 * 1024 * 1024, // 25 MB default
  },
  storage: multerS3({
    s3,
    bucket: ENV.AWS.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,

    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },

    key: (req, file, cb) => {
      const rawType = String(req.params.type || '').trim();
      const safeType = rawType.replace(/[^a-zA-Z0-9_-]/g, '');
      if (!safeType) {
        return cb(new ApiError(400, 'Invalid directory name'));
      }

      const ext = getSafeExtension(file);
      const uniqueId = `${Date.now()}-${crypto.randomUUID()}`;
      const fileKey = `${safeType}/${uniqueId}${ext}`;
      cb(null, fileKey);
    },
  }),
});

export default upload;
