import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import { thread_blob_uploader, UploadResult, users_blob_uploader } from '../utils/azure-blob';

const createBlob = catchAsync(async (req, res) => {
    const { type } = req.body;
    const image = req.file!;

    let result: UploadResult | null = null;
    console.log(type);

    if (type === "users") {
        result = await users_blob_uploader.uploadImage(image.buffer, image.originalname)
    } else {
        result = await thread_blob_uploader.uploadImage(image.buffer, image.originalname)
    }

    if (result?.success === false) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(result);
        return;
    }

    res.status(StatusCodes.CREATED).send(result);
});



export default {
    createBlob
};
