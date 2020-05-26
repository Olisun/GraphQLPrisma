const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
  Query: {
    notes: async (_, args, context, info) => {
      const notes = await context.db.query.notes(null, info);
      return notes
    }
  },
  Mutation: {
    createNote: async (_, args, context, info) => {
      const note = await context.db.mutation.createNote({
        data: {
          title: args.data.title,
          content: args.data.content,
          subject: args.data.subject,
          author: args.data.author
        }
      }, info);
      return note;
    },
    updateNote: async (_, args, context, info) => {
      const note = await context.db.mutation.updateNote({
        where: { id: args.where.id },
        data: {
          title: args.data.title,
          content: args.data.content,
          subject: args.data.subject,
          author: args.data.author
        }
      }, info);
      return note;
    },
    deleteNote: async (_, args, context, info) => {
      const note = await context.db.mutation.deleteNote({
        where: { id: args.where.id }
      }, info);
      return note;
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/generated/prisma.graphql',
  resolvers,
  context: {
    db: new Prisma({
      typeDefs: './src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/oliver-sun-5ea12a/note-app/dev'
    })
  }
});

server.start(() => console.log(`Server is running on localhost:4000`))