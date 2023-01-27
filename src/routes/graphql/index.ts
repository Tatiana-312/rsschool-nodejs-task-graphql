import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import { MemberType, Post, Profile, User } from '../../utils/graphql/graphqlTypes';

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
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          users: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
            resolve: async () => await fastify.db.users.findMany()
          },
          profiles: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
            resolve: async () => await fastify.db.profiles.findMany()
          },
          posts: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
            resolve: async () => await fastify.db.posts.findMany()
          },
          memberTypes: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
            resolve: async () => await fastify.db.memberTypes.findMany()
          }
        }
      })
    });

    return await graphql({
      schema,
      source: String(request.body.query)
    });
    }
  );
};

export default plugin;