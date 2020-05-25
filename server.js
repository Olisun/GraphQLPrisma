const { GraphQLServer } = require('graphql-yoga');

let posts = [
  {
    id: 'post-0',
    title: 'Article one',
    content: 'This is Article One'
  },
  {
    id: 'post-1',
    title: 'Article Two',
    content: 'This is Article Two'
  },
  {
    id: 'post-2',
    title: 'Article Three',
    content: 'This is Article Three'
  }
];

let idCount = posts.length;

const typeDefs = `
  type Post {
    id: String!
    title: String!
    content: String!
  }

  type Query {
    allPosts: [Post]
    post(id: ID!): Post!
  }

  type Mutation {
    createPost(title: String!, content: String!): Post!
    deletePost(id: ID!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
  }
`;

const resolvers = {
  Query: {
    allPosts: () => {
      return posts;
    },
    post: (args, { id }) => {
      const post = posts.find(args => args.id === id);
      return post;
    }
  },

  Mutation: {
    createPost: (_, args) => {
      const newPost = {
        id: `user-${idCount++}`,
        title: args.title,
        content: args.content
      }

      posts = [...posts, newPost];
      return newPost;
    },
    deletePost: (_, { id }) => {
      const postToDelete = posts.find(args => args.id === id);
      posts = posts.filter(post => {
        return post.id !== postToDelete.id
      });
      return postToDelete
    },
    updatePost: (_, { id, title, content }) => {
      let updatedPost;
      posts = posts.map(post => {
        if (post.id === id) {
          updatedPost = {
            id: post.id,
            title: title !== undefined ? title : post.title,
            content: content !== undefined ? content : post.content,
          }
          return updatedPost;
        } else {
          return post;
        }
      });
      return updatedPost;
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log(`Server is running on localhost:4000`))