// packages/shared/src/graphql/queries.ts
import { gql } from "urql";

export const BOARDS_QUERY = gql`
  query Boards {
    boards {
      id
      name
      description
      sortOrder
    }
  }
`;

export const POSTS_QUERY = gql`
  query Posts($boardId: ID!, $cursor: String, $limit: Int) {
    posts(boardId: $boardId, cursor: $cursor, limit: $limit) {
      edges {
        node {
          id
          title
          content
          replyCount
          createdAt
          author {
            id
            name
            avatarUrl
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const POST_QUERY = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      content
      replyCount
      createdAt
      updatedAt
      author {
        id
        name
        avatarUrl
      }
      board {
        id
        name
      }
      replies {
        id
        content
        createdAt
        author {
          id
          name
          avatarUrl
        }
      }
    }
  }
`;

export const SEARCH_POSTS_QUERY = gql`
  query SearchPosts($query: String!, $cursor: String, $limit: Int) {
    searchPosts(query: $query, cursor: $cursor, limit: $limit) {
      edges {
        node {
          id
          title
          content
          replyCount
          createdAt
          author {
            id
            name
          }
          board {
            id
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      avatarUrl
      role
    }
  }
`;
