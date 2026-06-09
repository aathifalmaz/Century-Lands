import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2"
import { randomUUID } from "node:crypto"

export async function uploadToR2(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`
    const key = `properties/uploads/${fileName}`

    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    })

    await s3Client.send(command)

    return `${R2_PUBLIC_URL}/${key}`
}

export async function deleteFromR2(fileUrl: string) {
    try {
        if (!fileUrl) return
        
        // Extract the key from the public URL
        const prefix = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/` : ""
        if (prefix && !fileUrl.startsWith(prefix)) {
            console.warn(`URL ${fileUrl} does not start with R2_PUBLIC_URL ${prefix}`)
            return
        }
        
        const key = prefix ? fileUrl.replace(prefix, "") : fileUrl
        
        const { DeleteObjectCommand } = await import("@aws-sdk/client-s3")
        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key
        })
        
        await s3Client.send(command)
        console.log(`Successfully deleted key from R2: ${key}`)
    } catch (err) {
        console.error("Failed to delete file from R2:", err)
    }
}
