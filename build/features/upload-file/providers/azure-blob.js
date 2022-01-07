"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureBlobProvider = void 0;
const path_1 = __importDefault(require("path"));
const base_provider_1 = require("./base-provider");
class AzureBlobProvider extends base_provider_1.BaseProvider {
    constructor(options) {
        super(options.container);
        const { BlobServiceClient } = require('@azure/storage-blob');
        this.blobSvc = BlobServiceClient.fromConnectionString(options.connectionString);
        this.containerName = this.blobSvc.getContainerClient(options.container);
        // if (!existsSync(options.bucket)) {
        //   throw new Error(ERROR_MESSAGES.NO_DIRECTORY(options.bucket))
        // }
    }
    async upload(file, key) {
        const blockBlobClient = this.containerName.getBlockBlobClient(key);
        const uploadBlobResponse = await blockBlobClient.uploadFile(file.path);
        console.log(uploadBlobResponse);
        // await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        // await fs.promises.rename(file.path, filePath);
        return uploadBlobResponse;
    }
    async delete(key, bucket) {
        return Promise.resolve(true);
        // await fs.promises.unlink(process.platform === 'win32'
        //     ? this.path(key, bucket) : this.path(key, bucket).slice(1)); // adjusting file path according to OS
    }
    // eslint-disable-next-line class-methods-use-this
    path(key, bucket) {
        // Windows doesn't requires the '/' in path, while UNIX system does
        return process.platform === 'win32' ? `${path_1.default.join(bucket || this.bucket, key)}`
            : `/${path_1.default.join(bucket || this.bucket, key)}`;
    }
}
exports.AzureBlobProvider = AzureBlobProvider;
