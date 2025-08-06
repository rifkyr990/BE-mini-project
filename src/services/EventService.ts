import { prisma } from "../config/prisma";
import cloudinary from "../config/cloudinaryConfig";

class EventService {
    public static async createEvent (data: any, fileStream?: NodeJS.ReadableStream) {
        let uploadedUrl: string | undefined;

        if (fileStream) {
            uploadedUrl = await new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "upload/event" },(err, result) => {
                        if (err || !result) return reject(err || new Error("Upload failed"));
                        resolve(result.secure_url);
                    }
                );
                fileStream.pipe(uploadStream);
            });
        }
        return await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                capacity: Number(data.capacity),
                organizerId: data.organizerId,
                banner: uploadedUrl,
                seatsTaken: 0,
            },
        });
    }

    public static async findAll() {
        return await prisma.event.findMany();
    }

    public static async findById(id: string) {
        return await prisma.event.findUnique({
            where: { id }
        })
    }

    public static async findByIdUser(organizerId: string) {
        return await prisma.event.findMany({
            where: {
                organizerId // Menyaring event berdasarkan organizerId yang sesuai dengan userId
            }
        });
    }

    public static async update(id: string, data: any) {
        return await prisma.event.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                capacity: data.capacity,
            }
        })
    }

    public static async delete(id: string) {
        return await prisma.event.delete({ where: {id}});
    }
}

export default EventService;