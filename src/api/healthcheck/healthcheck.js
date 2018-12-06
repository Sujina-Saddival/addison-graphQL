'use strict';

const Handlers = require('./healthcheck-handlers.js');
const routes = [];
const GraphQL  = require('hapi-graphql');
const  {GraphQLSchema, GraphQLObjectType, GraphQLString } =  require('graphql');

const TestSchema = new GraphQLSchema({});

// const { apolloHapi, graphiqlHapi } = require('apollo-server');

exports.register = function (server, options, next) {
  server.register({
    register: GraphQL,
    options: {
      schema: TestSchema,
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          author: {
            type: GraphQLString,
            resolve: (source, args, context, info) => {
              return 'Thomas Reggi'
            }
          }
        }
      }),
      route: {
        path: '/graphql',
        config: {}
      }
    }
  }).catch((err)=>{
    debugger
  })
  routes.forEach(route => server.route(route));
  next();
};

exports.register.attributes = require('./package');

routes.push({
  method: 'GET',
  path: '/healthcheck',
  config: {
    description: 'Health check endpoint',
    notes: 'Can be used to monitor health check of application, e.g. with Sitescope',
    security: {
      xframe: 'sameorigin',
    },
    cache: {
      otherwise: 'no-cache, no-store, must-revalidate',
    },
  },
  handler: Handlers.healthcheck,
});
