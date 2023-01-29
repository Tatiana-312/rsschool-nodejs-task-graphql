import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql';
import { GraphQLSchema } from 'graphql/type';
import { mainQuery } from '../../utils/graphql/mainQuery';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const queryType = mainQuery(fastify);

      const schema = new GraphQLSchema({
        query: queryType
      });

      return await graphql({
        schema,
        source: String(request.body.query),
        variableValues: request.body.variables
      });
    }
  );
};

export default plugin;