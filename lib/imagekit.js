import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Utility function to upload an image
// export const uploadImage = async (file, folder = "/uploads") => {
//     try {
//         let buffer;

//         if (file instanceof File) {
//             buffer = Buffer.from(await file.arrayBuffer());
//         } else if (typeof file === "string") {
//             // Handle base64 strings
//             buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), "base64");
//         } else {
//             throw new Error("Unsupported file type");
//         }

//         const response = await imagekit.upload({
//             file: buffer,
//             fileName: `image-${Date.now()}`,
//             folder,
//             useUniqueFileName: true
//         });

//         return response;
//     } catch (error) {
//         console.error("Image upload error:", error);
//         throw error;
//     }
// };

// Utility function to generate optimized image URL
// export const getOptimizedImageUrl = (url, width = 300, height = 300, quality = "auto") => {
//     return imagekit.url({
//         src: url,
//         transformation: [{ width, height, quality, crop: "auto" }]
//     });
// };

// Utility function to delete an image
// export const deleteImage = async (fileId) => {
//     try {
//         const response = await imagekit.deleteFile(fileId);
//         return response;
//     } catch (error) {
//         console.error("Image deletion error:", error);
//         throw error;
//     }
// };


export default imagekit;