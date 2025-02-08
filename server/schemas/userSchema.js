import { User } from "../models/User.js";

const userTypeDefs = `#graphql

  type User {
    _id:ID
    name: String
    username: String!
    email: String!
    password: String!
  }

  input RegisterInput {
    name: String
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }
  
  type LoginInfo {
    access_token: String
    id: ID
  }

  type Following {
    _id: ID
    name: String
    username: String
  }

  type Followers {
    _id: ID
    name: String
    username: String  
  }

  type UserInfo {
    _id:ID
    name: String
    username: String
    following: [Following]
    followers: [Followers]
  }

  type SearchUsers {
  _id: ID
  name: String
  username: String
  }

  type Mutation {
    register(input: RegisterInput): String
    login(input: LoginInput): LoginInfo
  }
    
  type Query {
    getUserInfo(id:ID): UserInfo
    getProfileInfo: UserInfo
    searchUsers(q: String): [SearchUsers]
  }
  `;

const userResolvers = {
  Query: {
    getUserInfo: async (_, args, contextValue) => {
      try {
        await contextValue.authentication();
        const { id } = args;

        const user = await User.findUserInfoById(id);
        return user;
      } catch (error) {
        console.log("🚀 ~ getUserInfo: ~ error:", error);
        return error;
      }
    },
    getProfileInfo: async (_, __, contextValue) => {
      try {
        const user = await contextValue.authentication();

        const userProfile = await User.findUserInfoById(user._id);
        return userProfile;
      } catch (error) {
        console.log("🚀 ~ getProfileInfo:async ~ error:", error);
        return error;
      }
    },
    searchUsers: async (_, args, contextValue) => {
      try {
        await contextValue.authentication();
        const { q } = args;

        const users = await User.serachUser(q);

        return users;
      } catch (error) {
        console.log("🚀 ~ searchUsers: ~ error:", error);
      }
    },
  },

  Mutation: {
    register: async (_, args) => {
      try {
        const { input } = args;

        const message = await User.register(input);

        return message;
      } catch (error) {
        console.log("🚀 ~ registerUser: ~ error:", error);
        return error;
      }
    },

    login: async (_, args) => {
      try {
        const { input } = args;

        const loginInfo = await User.login(input);
        return loginInfo;
      } catch (error) {
        console.log("🚀 ~ login:async ~ error:", error);
        return error;
      }
    },
  },
};

export { userTypeDefs, userResolvers };
