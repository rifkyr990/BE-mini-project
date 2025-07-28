import prisma from '../config/prisma';

class UserService {
    async getUsers() {
        return await prisma.user.findMany();
    }

    async createUser(email: string, name?: string) {
        return await prisma.user.create({
            data: {
                email,
                name,
            },
        });
    }
}

export default UserService;
