import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import dayjs from 'dayjs';

/**
 * Generates a unique key for storing a file in S3.
 * @param {string} originalName
 * @param {string} folder
 * @returns {string}
 */
export const generateS3Key = (originalName, folder) => {
  if (!originalName) {
    throw new Error('originalName is required to generate S3 key');
  }

  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const shortBase = nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .slice(0, 10);

  const extension = mime.extension(mime.lookup(originalName) || 'jpeg');
  const timestamp = dayjs().format('YYYYMMDD');
  const uuid = uuidv4();

  return `${folder}/${shortBase}-${timestamp}-${uuid}.${extension}`;
};
