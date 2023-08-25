import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { v4 as uuidv4 } from 'uuid';

// demo users data
let users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
    age: 26
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
    age: 28
  },
  {
    id: '4',
    name: 'Sergio',
    email: 'sergio@example.com',
    age: 35
  }
];

let posts = [
  {
    id: '1',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: false,
    author: '1'
  },
  {
    id: '2',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'Trading Music',
    body: 'Relax and focus',
    published: true,
    author: '2'
  },
  {
    id: '4',
    title: 'Programming Music',
    body: 'Boost your energy',
    published: true,
    author: '3'
  },
  {
    id: '5',
    title: 'Music for Studying',
    body: 'Concentrate and study',
    published: true,
    author: '4'
  }
];

let comments = [
  {
    id: '1',
    text: 'This worked well for me. Thanks!',
    author: '3',
    post: '1'
  },
  {
    id: '2',
    text: 'Glad you enjoyed it.',
    author: '1',
    post: '1'
  },
  {
    id: '3',
    text: 'This did not work.',
    author: '2',
    post: '2'
  },
  {
    id: '4',
    text: 'Nevermind. I got it to work.',
    author: '1',
    post: '3'
  },
  {
    id: '5',
    text: 'Amazing music for studying!',
    author: '4',
    post: '5'
  }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: (parent, args, ctx, info) => {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts: (parent, args, ctx, info) => {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    comments: (parent, args, ctx, info) => {
      if (!args.query) {
        return comments;
      }
      return comments.filter((comment) => {
        return comment.text.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me: () => {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com',
        age: 28
      };
    },
    post: () => {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: 'Get started with GraphQL...',
        published: false
      };
    }
  },
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error('Email taken.');
      }
      const user = {
        id: uuidv4(),
        ...args.data
      };
      users.push(user);
      return user;
    },
    deleteUser: (parent, args, ctx, info) => {
      const userIndex = users.findIndex((user) => user.id === args.id);
      if (userIndex === -1) {
        throw new Error('User not found.');
      }
      const deletedUsers = users.splice(userIndex, 1);
      posts = posts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }
        return !match;
      });
      comments = comments.filter((comment) => comment.author !== args.id);
      return deletedUsers[0];
    },
    createPost: (parent, args, ctx, info) => {
      const userExists = users.some((user) => user.id === args.data.author);
      if (!userExists) {
        throw new Error('User not found.');
      }
      const post = {
        id: uuidv4(),
        ...args.data
      };
      posts.push(post);
      return post;
    },
    deletePost: (parent, args, ctx, info) => {
      const postIndex = posts.findIndex((post) => post.id === args.id);
      if (postIndex === -1) {
        throw new Error('Post not found.');
      }
      const deletedPosts = posts.splice(postIndex, 1);
      comments = comments.filter((comment) => comment.post !== args.id);
      return deletedPosts[0];
    },
    createComment: (parent, args, ctx, info) => {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some((post) => post.id === args.data.post && post.published);
      if (!userExists || !postExists) {
        throw new Error('Unable to add comment.');
      }
      const comment = {
        id: uuidv4(),
        ...args.data
      };
      comments.push(comment);
      return comment;
    },
    deleteComment: (parent, args, ctx, info) => {
      const commentIndex = comments.findIndex((comment) => comment.id === args.id);
      if (commentIndex === -1) {
        throw new Error('Comment not found.');
      }
      const deletedComments = comments.splice(commentIndex, 1);
      return deletedComments[0];
    }
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post: (parent, args, ctx, info) => {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    }
  }
};

const schema = createSchema({
  typeDefs,
  resolvers
});
const yoga = createYoga({
  schema
});
const server = createServer(yoga)
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
});