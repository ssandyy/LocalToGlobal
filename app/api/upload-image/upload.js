import { uploadImage } from "@/lib/imagekit";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { image, folder } = req.body;
        const result = await uploadImage(image, folder);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}