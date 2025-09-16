// https://ai-interview-system-bucket.s3.ap-south-1.amazonaws.com/395d0631-1c89-4f20-a487-b1b865761af7/avatar/IMG202501010115291754389116973
export const publicUrl = (userId, module, key) => {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${userId}/${module}/${key}`;
};
