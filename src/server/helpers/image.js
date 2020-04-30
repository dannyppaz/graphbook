import { storage } from "./../gcp";
import path from "path";
const fs = require("fs");

export const uploadImage = async (
  localFilePath,
  bucketName = "graphbook_phto_bucket",
  options
) => {
  try {
    const bucket = storage.bucket(bucketName);
    const fileName = path.basename(localFilePath);
    const file = bucket.file(fileName);

    return bucket
      .upload(localFilePath, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: "public, max-age=31536000",
        },
      })
      .then(() => console.log(`${filename} uploaded to ${bucketName}.`))
      .then(() => file.makePublic())
      .then(() => getPublicUrl(bucketName, fileName));
  } catch (error) {
    console.error("ERROR WHILE UPLOADING IMAGE TO GCP: ", error);
  }
};

export const uploadStreamImage = async (
  fileUpload,
  bucketName = "graphbook_phto_bucket",
  options
) =>
  new Promise(async (resolve, reject) => {
    const { filename, mimetype, encoding, createReadStream } = await fileUpload;
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${Date.now()}-${filename}`;
    const file = bucket.file(gcsFileName);
    const stream = createReadStream();

    stream
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: mimetype,
          },
          validation: "md5",
          resumable: false,
        })
      )
      .on("data", (chunk) => {
        console.info("---------- uploading -------> ", chunk);
      })
      .on("error", (error) => {
        file.cloudStorageError = error;
        console.error("ERROR WHILE UPLOADING IMAGE TO GCP: ", error);
        reject(error);
      })
      .on("finish", async () => {
        file.cloudStorageObject = gcsFileName;
        await file.makePublic();
        file.gcsUrl = getPublicUrl(bucketName, gcsFileName);
        resolve(file);
      });
  });

const getPublicUrl = (bucketName, fileName) =>
  `https://storage.googleapis.com/${bucketName}/${fileName}`;
