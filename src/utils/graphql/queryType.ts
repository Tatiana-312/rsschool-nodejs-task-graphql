import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql/type";
import { getAll, getById } from "../controller";
import { User, Profile, Post, MemberType } from "./graphqlTypes";

export const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (source, args, fastify) => await getAll(fastify.db.users),
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args, fastify) =>
        await getById(fastify, fastify.db.users, args.id),
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