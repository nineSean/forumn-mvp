// packages/shared/src/graphql/mutations.ts
import { gql } from "urql";

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
    }
  }
`;

export const CREATE_REPLY_MUTATION = gql`
  mutation CreateReply($input: CreateReplyInput!) {
    createReply(input: $input) {
      id
      content
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const DELETE_REPLY_MUTATION = gql`
  mutation DeleteReply($id: ID!) {
    deleteReply(id: $id)
  }
`;

export const CREATE_BOARD_MUTATION = gql`
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_BOARD_MUTATION = gql`
  mutation UpdateBoard($id: ID!, $input: UpdateBoardInput!) {
    updateBoard(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;
