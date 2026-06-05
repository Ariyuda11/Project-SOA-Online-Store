const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const axios = require('axios');

const PRODUCT_SERVICE_URL = 'http://product-service:3002';

async function startServer() {
  const server = new ApolloServer({
    typeDefs: `
      type Product {
        id: ID
        name: String
        price: Int
        stock: Int
      }

      type Query {
        products: [Product]
        product(id: ID!): Product
      }
    `,
    resolvers: {
      Query: {
        products: async () => {
          const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
          return response.data;
        },

        product: async (_, { id }) => {
          const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${id}`);
          return response.data;
        }
      }
    }
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });

  console.log(`GraphQL Service running at ${url}`);
}

startServer();