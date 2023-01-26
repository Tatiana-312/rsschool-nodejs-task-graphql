import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { HttpError } from '@fastify/sensible/lib/httpError';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | HttpError> {
      const result = await fastify.db.profiles.findOne({key: 'id', equals: request.params.id});
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
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | HttpError> {
      const member = await fastify.db.memberTypes.findOne({key: 'id', equals: request.body.memberTypeId});
      const profile = await fastify.db.profiles.findOne({key: 'userId', equals: request.body.userId});
      if (member !== null && profile === null) {
        return await fastify.db.profiles.create(request.body);
      }
      return fastify.httpErrors.badRequest();
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | HttpError> {
      const profile = await fastify.db.profiles.findOne({key: 'id', equals: request.params.id});
      if (profile !== null) {
        return await fastify.db.profiles.delete(request.params.id);
      }
      return fastify.httpErrors.badRequest();
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | HttpError> {
      const profile = await fastify.db.profiles.findOne({key: 'id', equals: request.params.id});
      if (profile !== null) {
        return await fastify.db.profiles.change(request.params.id, request.body);
      }
      return fastify.httpErrors.badRequest();
    }
  );
};

export default plugin;
