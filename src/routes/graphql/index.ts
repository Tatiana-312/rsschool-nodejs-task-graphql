import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql';
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import { MemberType, Post, Profile, User } from '../../utils/graphql/graphqlTypes';
import { getAll, getById } from '../../utils/controller';

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
            resolve: async () => await getAll(fastify.db.users)
          },
          user: {
            type: User,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, args) => await getById(fastify, fastify.db.users, args.id)
          },
          profiles: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
            resolve: async () => await getAll(fastify.db.profiles)
          },
          profile: {
            type: Profile,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, args) => await getById(fastify, fastify.db.profiles, args.id)
          },
          posts: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
            resolve: async () => await getAll(fastify.db.posts)
          },
          post: {
            type: Post,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, args) => await getById(fastify, fastify.db.posts, args.id)
          },
          memberTypes: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
            resolve: async () => await getAll(fastify.db.memberTypes)
          },
          memberType: {
            type: MemberType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, args) => await getById(fastify, fastify.db.memberTypes, args.id)
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