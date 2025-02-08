import { Follow } from "../models/Follow.js";

const followTypeDefs = `#graphql
  type Follow {
    id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  type Mutation {
    follow(followingId: ID): String
    unFollow(followingId: ID): String
  }
`;

const followResolvers = {
  Mutation: {
    follow: async (_, args, contextValue) => {
      try {
        const user = await contextValue.authentication();

        const { followingId } = args;
        const message = await Follow.followUser({
          followerId: user._id,
          followingId,
        });

        return message;
      } catch (error) {
        console.log("🚀 ~ follow:async ~ error:", error);
        return error;
      }
    },

    unFollow: async (_, args, contextValue) => {
      try {
        const user = await contextValue.authentication();

        const { followingId } = args;

        const message = await Follow.unFollowUser(user._id, followingId);

        return message;
      } catch (error) {
        console.log("🚀 ~ unFollow: ~ error:", error);
        return error;
      }
    },
  },
};

export { followTypeDefs, followResolvers };
