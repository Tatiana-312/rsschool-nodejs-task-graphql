import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql';
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql/type';
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
      const queryType = new GraphQLObjectType({
        name: 'Query',
        fields: {
          users: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
            resolve: async () => {
              return await fastify.db.users.findMany()
            }
          },
          user: {
            type: User,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, args) => await fastify.db.users.findOne({ key: 'id', equals: args.id })
          },
          profiles: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
            resolve: async () => await fastify.db.profiles.findMany()
          },
          profile: {
            type: Profile,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, args) => await fastify.db.profiles.findOne({ key: 'id', equals: args.id })
          },
          posts: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
            resolve: async () => await fastify.db.posts.findMany()
          },
          post: {
            type: Post,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, args) => await fastify.db.posts.findOne({ key: 'id', equals: args.id })
          },
          memberTypes: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
            resolve: async () => await fastify.db.memberTypes.findMany()
          },
          memberType: {
            type: MemberType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, args) => await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id })
          },
        }
      });

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