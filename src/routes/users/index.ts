import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { HttpError } from '@fastify/sensible/lib/httpError';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      const result = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
      if (result !== null) {
        return result;
      } else {
        return fastify.httpErrors.notFound();
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      const user = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
      if (user !== null) {
        const arrOfUsers = await fastify.db.users.findMany({key: 'subscribedToUserIds', inArray: request.params.id});

        arrOfUsers.forEach(async (user) => {
          const arrOfId = user.subscribedToUserIds;
          const updatedArrOfId = arrOfId.filter((id) => id !== request.params.id);
          await fastify.db.users.change(user.id, {"subscribedToUserIds": updatedArrOfId});
        });

        return await fastify.db.users.delete(request.params.id);
      } else {
        return fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      const user = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
      if (user !== null) {
        const arrOfId = user.subscribedToUserIds;
        arrOfId.push(request.params.id);
        const result = await fastify.db.users.change(request.body.userId, {"subscribedToUserIds": arrOfId});
        return result;
      } else {
        return fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      const user = await fastify.db.users.findOne({key: 'id', equals: request.body.userId});
      if (user !== null) {
        const arrOfId = user.subscribedToUserIds;
        if (arrOfId.includes(request.params.id)) {
          const updatedArrOfId = arrOfId.filter((id) => id !== request.params.id);
          const result = await fastify.db.users.change(request.body.userId, {"subscribedToUserIds": updatedArrOfId});
          return result;
        }
      }
      return fastify.httpErrors.badRequest();
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      const user = await fastify.db.users.findOne({key: 'id', equals: request.params.id});
      if (user !== null) {
        return await fastify.db.users.change(request.params.id, request.body);
      } else {
        return fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
