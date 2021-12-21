import fs, { existsSync } from 'fs'
import path from 'path'
import { UploadedFile } from 'adminjs'
import { ERROR_MESSAGES } from '../constants'

import { BaseProvider } from './base-provider'

/**
 * Options required by the LocalAdapter
 *
 * @memberof module:@adminjs/upload
 */
export type AzureBlobOptions = {

  container: string;
  connectionString: string;
}

export class AzureBlobProvider extends BaseProvider {
  private blobSvc: any
  private containerName: any

  constructor(options: AzureBlobOptions) {
    super(options.container)

    const { BlobServiceClient } = require('@azure/storage-blob');

    this.blobSvc = BlobServiceClient.fromConnectionString(options.connectionString);
    this.containerName = this.blobSvc.getContainerClient(options.container);
    // if (!existsSync(options.bucket)) {
    //   throw new Error(ERROR_MESSAGES.NO_DIRECTORY(options.bucket))
    // }
  }

  public async upload(file: UploadedFile, key: string): Promise<any> {

    const blockBlobClient = this.containerName.getBlockBlobClient(key);
    const uploadBlobResponse = await blockBlobClient.uploadFile(file.path);

    console.log (uploadBlobResponse);
    // await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    // await fs.promises.rename(file.path, filePath);
    return uploadBlobResponse;
  }

  public async delete(key: string, bucket: string): Promise<any> {
    await fs.promises.unlink(process.platform === 'win32'
        ? this.path(key, bucket) : this.path(key, bucket).slice(1)); // adjusting file path according to OS
  }

  // eslint-disable-next-line class-methods-use-this
  public path(key: string, bucket?: string): string {
    // Windows doesn't requires the '/' in path, while UNIX system does
    return process.platform === 'win32' ? `${path.join(bucket || this.bucket, key)}`
        : `/${path.join(bucket || this.bucket, key)}`;
  }
}
