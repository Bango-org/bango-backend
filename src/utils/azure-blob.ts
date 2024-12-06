import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import config from "../config/config";

export interface UploadConfig {
    connectionString: string;
    containerName: string;
    allowedFileTypes?: string[];
    maxSizeMB?: number;
}

export interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
    blobName?: string;
}

class AzureBlobUploader {
    private blobServiceClient: BlobServiceClient;
    private containerClient: ContainerClient;
    private config: UploadConfig;

    constructor(config: UploadConfig) {
        this.config = {
            allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            maxSizeMB: 5,
            ...config
        };

        this.blobServiceClient = BlobServiceClient.fromConnectionString(
            this.config.connectionString
        );
        this.containerClient = this.blobServiceClient.getContainerClient(
            this.config.containerName
        );
    }

    private validateFile(file: Buffer, fileName: string): string | null {
        // Check file size
        const fileSizeInMB = file.length / (1024 * 1024);
        if (fileSizeInMB > this.config.maxSizeMB!) {
            return `File size exceeds ${this.config.maxSizeMB} MB limit`;
        }

        // Check file type
        const fileExtension = path.extname(fileName).toLowerCase();
        if (!this.config.allowedFileTypes!.includes(fileExtension)) {
            return `File type ${fileExtension} not allowed. Allowed types: ${this.config.allowedFileTypes!.join(', ')}`;
        }

        return null;
    }

    private generateBlobName(fileName: string): string {
        const fileExtension = path.extname(fileName);
        const timestamp = new Date().getTime();
        const uuid = uuidv4();
        return `${timestamp}-${uuid}${fileExtension}`;
    }

    async uploadImage(file: Buffer, originalFileName: string): Promise<UploadResult> {
        try {
            // Validate the file
            const validationError = this.validateFile(file, originalFileName);
            if (validationError) {
                return {
                    success: false,
                    error: validationError
                };
            }

            // Generate unique blob name
            const blobName = this.generateBlobName(originalFileName);

            // Get blob client
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

            // Upload file
            await blockBlobClient.upload(file, file.length, {
                blobHTTPHeaders: {
                    blobContentType: this.getContentType(originalFileName)
                }
            });

            return {
                success: true,
                url: blockBlobClient.url,
                blobName: blobName
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    private getContentType(fileName: string): string {
        const extension = path.extname(fileName).toLowerCase();
        const contentTypes: { [key: string]: string } = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        };
        return contentTypes[extension] || 'application/octet-stream';
    }

    async deleteImage(blobName: string): Promise<boolean> {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.delete();
            return true;
        } catch (error) {
            console.error('Error deleting blob:', error);
            return false;
        }
    }

    async listImages(): Promise<string[]> {
        const urls: string[] = [];
        try {
            for await (const blob of this.containerClient.listBlobsFlat()) {
                const blockBlobClient = this.containerClient.getBlockBlobClient(blob.name);
                urls.push(blockBlobClient.url);
            }
        } catch (error) {
            console.error('Error listing blobs:', error);
        }
        return urls;
    }
}


export const thread_blob_uploader = new AzureBlobUploader({
    connectionString: config.azure_blob_connection_string,
    containerName: "predictor-threads"
})

export const users_blob_uploader = new AzureBlobUploader({
    connectionString: config.azure_blob_connection_string,
    containerName: "predictor-users"
})

export const event_blob_uploader = new AzureBlobUploader({
    connectionString: config.azure_blob_connection_string,
    containerName: "predictor-events"
})