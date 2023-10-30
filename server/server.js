const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// const routes = require('./routes'); //this is what's different --do we still need this?

const PORT = process.env.PORT || 3001; 
const app = express();
const server = new ApolloServer({ //typeDefs and resolvers define the schema that our ApolloServer uses to answer queries made to /Graphql
  typeDefs,
  resolvers,
});


// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes); //this is what's different --do we still need this? I don't think so since we just have one route-one point for all queries/mutations - /graphql


// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });


const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist'))); //client/build or client/dist?
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  
  //any client requests that begin with /graphql will be handled by Apollo Server
  app.use('/graphql', expressMiddleware(server, {context: authMiddleware })); //we have just one entry point - one API route handled by our Apollo Server

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();