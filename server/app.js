import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from "./schemas/userSchema.js";
import { verifyToken } from "./helpers/jwt.js";
import { User } from "./models/User.js";
import { postResolvers, postTypeDefs } from "./schemas/postSchema.js";
import { followResolvers, followTypeDefs } from "./schemas/followSchema.js";

const server = new ApolloServer({
  typeDefs: [userTypeDefs, followTypeDefs, postTypeDefs],
  resolvers: [userResolvers, followResolvers, postResolvers],
  introspection: true,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req, res }) => {
    const authN = async () => {
      const getToken = req.headers.authorization;

      if (!getToken) {
        throw new Error("Unauthorized");
      }
      const [type, token] = getToken.split(" ");

      const isValidToken = verifyToken(token);

      if (!isValidToken) {
        throw new Error("Unauthorized");
      }
      const user = await User.findById(isValidToken.id);

      return user;
    };

    return {
      authentication: () => authN(),
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
