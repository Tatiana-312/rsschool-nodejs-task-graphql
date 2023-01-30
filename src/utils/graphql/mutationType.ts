import { FastifyInstance } from "fastify";
import { GraphQLNonNull, GraphQLObjectType } from "graphql/type";
import { Post, PostInput, ProfileInput, ProfileType, User, UserInput } from "./graphqlTypes";

export const mutationType = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      createUser: {
        type: User,
        args: {
          input: { type: new GraphQLNonNull(UserInput)}
        },
        resolve: async (source, args, fastify: FastifyInstance) => {
          return await fastify.db.users.create(args.input);
        }
      },
      createProfile: {
        type: ProfileType,
        args: {
          input: { type: new GraphQLNonNull(ProfileInput)}
        },
        resolve: async (source, args, fastify: FastifyInstance) => {
            const member = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.input.memberTypeId });
            const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: args.input.userId });
            if (member !== null && profile === null) {
                return await fastify.db.profiles.create(args.input);
            }
            return fastify.httpErrors.badRequest('This user already has profiles, please change userId');
        }
      },
      createPost: {
        type: Post,
        args: {
          input: { type: new GraphQLNonNull(PostInput)}
        },
        resolve: async (source, args, fastify: FastifyInstance) => {
            return await fastify.db.posts.create(args.input);
        }
      },
    },
  });