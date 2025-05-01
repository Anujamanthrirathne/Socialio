export const uploadToCloudinary = async (pics) => {
    if (pics) {
        // Validate file type (image or video)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];  // Add other video types if necessary
        if (!allowedTypes.includes(pics.type)) {
            throw new Error("Invalid file type. Please upload an image (JPG, PNG, GIF) or video (MP4).");
        }

        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "mern_product");
        data.append("cloud_name", "dwviccr1k");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dwviccr1k/upload", {
                method: "POST",
                body: data,
            });

            // Check if the response is OK (status 200)
            if (res.ok) {
                const fileData = await res.json();
                console.log("Cloudinary Response:", fileData); // Debugging response

                // Check if the fileData contains the URL property
                if (fileData && fileData.url) {
                    return fileData.url.toString();
                } else {
                    throw new Error("File URL not found in the Cloudinary response.");
                }
            } else {
                throw new Error("Failed to upload image or video to Cloudinary.");
            }
        } catch (error) {
            console.error("Error in uploadToCloudinary:", error);
            throw error;  
        }
    } else {
        console.log("No image or video file provided.");
        throw new Error("No file provided.");
    }
};
