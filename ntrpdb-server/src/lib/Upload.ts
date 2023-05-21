import cloudinary from "cloudinary";
import { ReadStream } from "fs-capacitor";
import { Vimeo } from "vimeo";
import GraphqlUpload from "graphql-upload/Upload";
import fs from "fs";

const Upload = {
  uploadStream: async (fileStream: ReadStream): Promise<any> => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      });

      const transformState = cloudinary.v2.uploader.upload_stream(
        { folder: "NTRPDB_Assets/" },
        (err, fileUploaded) => {
          if (err) {
            reject(err);
          }

          resolve(fileUploaded);
        }
      );

      fileStream.pipe(transformState);
    });
  },

  completeUploadVideo: async (path: string, filename: string): Promise<string> => {
    const VimeoClient = new Vimeo(
      process.env.VIMEO_CLIENT_ID,
      process.env.VIMEO_CLIENT_SECRET,
      process.env.VIMEO_ACCESS_TOKEN
    );

    return new Promise((resolve, reject) => {
      VimeoClient.upload(
        path,
        {
          name: filename,
          description: "NTRPDB-APPLICATION video upload",
        },
        function (uri) {
          console.log("Your video URI is: " + uri);
          resolve(uri);
        },
        function (bytes_uploaded, bytes_total) {
          const percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
          console.log(bytes_uploaded, bytes_total, percentage + "%");
        },
        function (error) {
          console.log("Failed because: " + error);
          reject(error);
        }
      );
    });
  },

  uploadPicture: async (picture: GraphqlUpload): Promise<string> => {
    const { file } = picture;
    const { createReadStream } = file;
    const fileStream = createReadStream();
    const { url } = await Upload.uploadStream(fileStream);
    return url;
  },

  storeVideo: async (fileStream: ReadStream, path: string): Promise<string> => {
    return new Promise((resolve, reject) =>
      fileStream
        .pipe(fs.createWriteStream(path))
        .on("error", (error: any) => reject(error))
        .on("finish", () => resolve(path))
    );
  },

  uploadVideo: async (video: GraphqlUpload): Promise<string> => {
    const uploadDir = "./temp";
    const { file } = video;
    const { createReadStream, filename } = file;
    const path = `${uploadDir}/${filename}`;
    const fileStream = createReadStream();

    await Upload.storeVideo(fileStream, path);
    const url = await Upload.completeUploadVideo(path, filename);

    console.log({ url });

    return url;
  },
};

export { Upload };
