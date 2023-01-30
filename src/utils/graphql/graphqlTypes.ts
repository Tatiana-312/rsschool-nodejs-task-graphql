import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } from "graphql/type";

export const User = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    email: {type: GraphQLString},
    subscribedToUserIds: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))}
  })
});

export const Post = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    userId: {type: GraphQLString}
  })
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberTypeType',
  fields: () => ({
    id: {type: GraphQLID},
    discount: {type: GraphQLInt},
    monthPostsLimit: {type: GraphQLInt}
  })
});

export const Profile = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: {type: GraphQLID},
    avatar: {type: GraphQLString},
    sex: {type: GraphQLString},
    birthday: {type: GraphQLInt},
    country: {type: GraphQLString},
    street: {type: GraphQLString},
    city: {type: GraphQLString},
    memberTypeId: {type: GraphQLString},
    userId: {type: GraphQLString},
    memberType: {type: MemberType}
  })
});

export const UserWithRelatives = new GraphQLObjectType({
  name: 'UserWithRelativesType',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    email: {type: GraphQLString},
    subscribedToUserIds: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
    userSubscribedTo: { type: new GraphQLList(User)},
    profile: {type: Profile},
    posts: {type: new GraphQLList(Post)}
  })
});