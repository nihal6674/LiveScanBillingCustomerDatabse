const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("./r2");

exports.uploadToR2 = async ({ buffer, key, contentType }) => {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return key; // store only the key
};
