const Koa = require('koa')
const {ApolloServer, gql} = require('apollo-server-koa')

const questions = [{id: '1', label: 'default question'}]
const typeDefs = gql`
  type Query { questions: [Question]! }
  type Question { id: String!, label: String! }
  type Mutation { addQuestion(label: String!): Question}
`

const resolvers = {
  Query: {
    questions: () => questions
  },
  Mutation: {
    addQuestion: (root, args) => {
      const newQuestion = {
        label: args.label,
        id: new Date().getTime()
      }
      questions.push(newQuestion)

      return newQuestion
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers });
const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);