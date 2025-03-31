import FormData from "form-data";
import userModel from "../models/userModel.js";
import axios from "axios";

const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        if (!userId || !prompt) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.creditBalance < 1) {
            return res.status(403).json({ success: false, message: "Insufficient Credits", creditBalance: user.creditBalance });
        }

        const formData = new FormData();
        formData.append("prompt", prompt);

        console.log("Sending request to ClipDrop...");

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                'Content-Type': 'multipart/form-data',
                ...formData.getHeaders(),
            },
            responseType: 'arraybuffer' // Ensure we get a binary response
        });

        if (!data) {
            console.log("Image generation failed, credit not deducted.");
            return res.status(500).json({ success: false, message: "Failed to generate image" });
        }

        console.log("Image successfully generated, deducting credit...");

        // 🔥 Deduct credit only after a successful image generation
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $inc: { creditBalance: -1 } },
            { new: true }
        );

        console.log(`New credit balance: ${updatedUser.creditBalance}`);

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        return res.json({ 
            success: true, 
            message: "Image Generated", 
            creditBalance: updatedUser.creditBalance, 
            resultImage 
        });

    } catch (error) {
        console.error("Error generating image:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export { generateImage };
