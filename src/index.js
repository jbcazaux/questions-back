const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools');

const questions = [{id: '1', label: 'default question'}];
const typeDefs = `
  type Query { questions: [Question]! }
  type Question { id: String!, label: String! }
  type Mutation { addQuestion(label: String!): Question}
`;
const resolvers = {
    Query: {
        questions: () => questions
    },
    Mutation: {
        addQuestion: (root, args) => {
            const newQuestion = { label: args.label ,
                id: new Date().getTime()};
            questions.push(newQuestion);

            return newQuestion;
        },
    },
};
const schema = makeExecutableSchema({typeDefs, resolvers});

const app = express();

app.use('/graphql', cors({'methods': 'GET,POST',}), bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(4000, () => {
    console.log('Go to http://localhost:4000/graphiql to run queries!');
});