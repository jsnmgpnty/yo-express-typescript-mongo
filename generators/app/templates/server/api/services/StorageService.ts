import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
} from '@azure/storage-blob';
import getStream from 'into-stream';

export class StorageService {
  public static instance: StorageService;
  private static blobServiceClient: BlobServiceClient;
  private static connectionString: string;

  public static init(
    connString: string,
    accountName: string,
    accessKey: string
  ): StorageService {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accessKey
    );
    const pipeline = newPipeline(sharedKeyCredential);
    this.blobServiceClient = new BlobServiceClient(connString, pipeline);
    this.connectionString = connString;

    if (!this.instance) {
      this.instance = new StorageService();
    }

    return this.instance;
  }

  private ONE_MEGABYTE = 1024 * 1024;
  private uploadOptions = { bufferSize: 4 * this.ONE_MEGABYTE, maxBuffers: 20 };

  public async uploadFile(
    file: Express.Multer.File,
    containerName: string,
    folderPath?: string
  ) {
    if (folderPath) {
      folderPath = folderPath.replace(/\/$/, '');
    }

    const blobName = this.getBlobName();
    const stream = getStream(file.buffer);
    const containerClient = StorageService.blobServiceClient.getContainerClient(
      containerName
    );
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${folderPath}/${blobName}`
    );

    try {
      const result = await blockBlobClient.uploadStream(
        stream,
        this.uploadOptions.bufferSize,
        this.uploadOptions.maxBuffers,
        { blobHTTPHeaders: { blobContentType: 'image/jpeg' } }
      );
      if (!result) {
        throw new Error(`Failed to upload media ${file.originalname}`);
      }

      let url = result._response.request.url;
      url = url.replace(StorageService.connectionString, '');
      return url;
    } catch (err) {
      throw new Error(err);
    }
  }

  private getBlobName() {
    // Use a random number to generate a unique file name,
    // removing "0." from the start of the string.
    const identifier =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    return identifier;
  }
}
