import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql/type";

export const User = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    email: {type: GraphQLString},
    subscribedToUserIds: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))}
  })
});

export const Profile = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: {type: GraphQLString},
    avatar: {type: GraphQLString},
    sex: {type: GraphQLString},
    birthday: {type: GraphQLInt},
    country: {type: GraphQLString},
    street: {type: GraphQLString},
    city: {type: GraphQLString},
    memberTypeId: {type: GraphQLString},
    userId: {type: GraphQLString}
  })
});

export const Post = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: {type: GraphQLString},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    userId: {type: GraphQLString}
  })
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberTypeType',
  fields: () => ({
    id: {type: GraphQLString},
    discount: {type: GraphQLInt},
    monthPostsLimit: {type: GraphQLInt}
  })
});
