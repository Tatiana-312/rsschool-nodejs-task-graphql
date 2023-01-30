import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql/type";
import { getAll, getById } from "../controller";
import { UserEntity } from "../DB/entities/DBUsers";
import { Profile, Post, MemberType, UserWithRelatives } from "./graphqlTypes";

export const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserWithRelatives))),
      resolve: async (source, args, fastify) => {
       return await (await fastify.db.users.findMany()).map(async (user: UserEntity) => {
          const profile = await fastify.db.profiles.findOne({key: 'userId', equals: user.id});
          const posts = await fastify.db.posts.findMany({key: 'userId', equals: user.id});
          const member = await fastify.db.memberTypes.findOne({key: 'id', equals: profile?.memberTypeId});
    
          return {
            ...user,
            profile: {
              ...profile,
              memberType: member 
            },
            posts: posts
          }
        });
      }
    },
    user: {
      type: UserWithRelatives,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args, fastify) => {
        const user = await fastify.db.users.findOne({key: 'id', equals: args.id});

        if (user === null) {
          return fastify.httpErrors.notFound('User not found!');
        }

        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: user.id });
        const posts = await fastify.db.posts.findMany({ key: 'userId', equals: user.id });
        const member = await fastify.db.memberTypes.findOne({ key: 'id', equals: profile?.memberTypeId });

          return {
            ...user,
            profile: {
              ...profile,
              memberType: member
            },
            posts: posts
          }
      }
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      resolve: async (source, args, fastify) => await getAll(fastify.db.profiles),
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args, fastify) =>
        await getById(fastify, fastify.db.profiles, args.id),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (source, args, fastify) => await getAll(fastify.db.posts),
    },
    post: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args, fastify) =>
        await getById(fastify, fastify.db.posts, args.id),
    },
    memberTypes: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(MemberType))
      ),
      resolve: async (source, args, fastify) => await getAll(fastify.db.memberTypes),
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args, fastify) =>
        await getById(fastify, fastify.db.memberTypes, args.id),
    },
  },
});