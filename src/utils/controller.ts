import { UserEntity } from "./DB/entities/DBUsers";

export const getAll = async (db: any) => {
    return await db.findMany();
};

export const getById = async (fastify: any, db: any, id: any) => {
    const result = await db.findOne({ key: 'id', equals: id });
    if (result !== null) {
        return result;
    } else {
        return fastify.httpErrors.notFound();
    }
};

export const create = async (fastify: any, db: any, request: any) => {
    return await db.create(request.body);
};

export const createProfiles = async (fastify: any, request: any) => {
    const member = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });
    const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId });
    if (member !== null && profile === null) {
        return await fastify.db.profiles.create(request.body);
    }
    return fastify.httpErrors.badRequest();
};

export const deleteEnt = async (fastify: any, db: any, request: any) => {
    const profile = await db.findOne({ key: 'id', equals: request.params.id });
    if (profile !== null) {
        return await db.delete(request.params.id);
    }
    return fastify.httpErrors.badRequest();
};

export const deleteUser = async (fastify: any, request: any) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });
    if (user !== null) {
        const arrOfUsers = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: request.params.id });

        arrOfUsers.forEach(async (user: UserEntity) => {
            const arrOfId = user.subscribedToUserIds;
            const updatedArrOfId = arrOfId.filter((id) => id !== request.params.id);
            await fastify.db.users.change(user.id, { "subscribedToUserIds": updatedArrOfId });
        });

        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.params.id });
        const post = await fastify.db.posts.findOne({ key: 'userId', equals: request.params.id });

        if (profile !== null) {
            await fastify.db.profiles.delete(profile.id);
        }
        if (post !== null) {
            await fastify.db.posts.delete(post.id);
        }
        return await fastify.db.users.delete(request.params.id);
    } else {
        return fastify.httpErrors.badRequest();
    }
};

export const patch = async (fastify: any, db: any, request: any) => {
    const entity = await db.findOne({ key: 'id', equals: request.params.id });
    if (entity !== null) {
        return await db.change(request.params.id, request.body);
    } else {
        return fastify.httpErrors.badRequest();
    }
};

export const subscribeToUser = async (fastify: any, request: any) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
    if (user !== null) {
        const arrOfId = user.subscribedToUserIds;
        arrOfId.push(request.params.id);
        const result = await fastify.db.users.change(request.body.userId, { "subscribedToUserIds": arrOfId });
        return result;
    } else {
        return fastify.httpErrors.badRequest();
    }
};

export const unsubscribeFromUser = async (fastify: any, request: any) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
    if (user !== null) {
        const arrOfId = user.subscribedToUserIds;
        if (arrOfId.includes(request.params.id)) {
            const updatedArrOfId = arrOfId.filter((id: string) => id !== request.params.id);
            const result = await fastify.db.users.change(request.body.userId, { "subscribedToUserIds": updatedArrOfId });
            return result;
        }
    }
    return fastify.httpErrors.badRequest();
};
