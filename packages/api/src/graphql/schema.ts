export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
    name: String!
    avatarUrl: String
    role: String!
    createdAt: String!
  }

  type Board {
    id: ID!
    name: String!
    description: String!
    sortOrder: Int!
    createdAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    replyCount: Int!
    createdAt: String!
    updatedAt: String!
    author: User!
    board: Board!
    replies: [Reply!]!
  }

  type Reply {
    id: ID!
    content: String!
    createdAt: String!
    author: User!
  }

  type PostEdge {
    node: Post!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }

  input CreatePostInput {
    boardId: ID!
    title: String!
    content: String!
  }

  input UpdatePostInput {
    title: String
    content: String
  }

  input CreateReplyInput {
    postId: ID!
    content: String!
  }

  input CreateBoardInput {
    name: String!
    description: String
  }

  input UpdateBoardInput {
    name: String
    description: String
    sortOrder: Int
  }

  type Query {
    boards: [Board!]!
    board(id: ID!): Board
    posts(boardId: ID!, cursor: String, limit: Int): PostConnection!
    post(id: ID!): Post
    searchPosts(query: String!, cursor: String, limit: Int): PostConnection!
    me: User
    login(email: String!, password: String!): User
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    createReply(input: CreateReplyInput!): Reply!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    deleteReply(id: ID!): Boolean!
    createBoard(input: CreateBoardInput!): Board!
    updateBoard(id: ID!, input: UpdateBoardInput!): Board!
  }
`;
