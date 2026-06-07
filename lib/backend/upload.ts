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
