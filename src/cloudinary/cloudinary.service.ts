import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import cloudinary from '../helper/cloudinary.config';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, folder: string):
  Promise<UploadApiErrorResponse | UploadApiResponse> {

    return await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );
      upload_stream.end(file.buffer);
    });

  }

  async deleteFile(url: string) {
    const slices = url.split('/');
    const filenameWithExtension = slices[slices.length - 1];
    const [filename] = filenameWithExtension.split('.');
    return await cloudinary.uploader.destroy(filename);
  }
}
