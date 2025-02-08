import { redis } from "../config/redis.js";
import { Post } from "../models/Post.js";

const postTypeDefs = `#graphql

  type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Author{
  _id: ID
  name: String
  username: String
  }

  type Post {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    comments: [Comment]
    commentsCount: Int
    likes: [Like]
    likesCount: Int
    author: Author
    createdAt: String
    updatedAt: String
  }

  type Posts {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    commentsCount: Int
    likesCount: Int
    author: Author
    createdAt: String
    updatedAt: String
  }

  type PostsForMyProfile {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String
    commentsCount: Int
    likesCount: Int
    createdAt: String
    updatedAt: String
  }

  input PostInput {
    content: String!
    tags: [String]
    imgUrl: String
  }

  input CommentInput {
    content: String!
    postId: ID!
  }

  type Mutation {
    addPost(payload: PostInput): String
    addComment(payload: CommentInput): String
    addLike(postId: ID): String
    unLike(postId: ID): String
  }
  
  type Query {
    getPosts: [Posts]
    getPostById(_id: ID): Post
    getPostByMyProfileId: [PostsForMyProfile]
    getPostByUserId(_id: ID): [PostsForMyProfile]
    isUserLikedPost(_id: ID): Boolean
  }
  `;

const postResolvers = {
  Query: {
    getPosts: async (_, __, contextValue) => {
      try {
        await contextValue.authentication();

        const chacedPosts = await redis.get("Posts");
        if (chacedPosts) {
          return JSON.parse(chacedPosts);
        }

        const posts = await Post.getPost();
        await redis.set("Posts", JSON.stringify(posts));

        return posts;
      } catch (error) {
        console.log("🚀 ~ getPost: ~ error:", error);
        return error;
      }
    },

    getPostById: async (_, args, contextValue) => {
      try {
        const { _id } = args;
        await contextValue.authentication();

        const post = await Post.getPostById(_id);

        if (!post) {
          throw new Error("Post not found");
        }

        return post;
      } catch (error) {
        console.log("🚀 ~ getPost: ~ error:", error);
        return error;
      }
    },

    getPostByMyProfileId: async (_, __, contextValue) => {
      try {
        const user = await contextValue.authentication();

        const post = await Post.getPostByMyProfileId(user._id);

        if (!post) {
          throw new Error("Post not found");
        }

        return post;
      } catch (error) {
        console.log("🚀 ~ getPost: ~ error:", error);
        return error;
      }
    },

    getPostByUserId: async (_, args, contextValue) => {
      try {
        const { _id } = args;

        await contextValue.authentication();

        const post = await Post.getPostByMyProfileId(_id);

        if (!post) {
          throw new Error("Post not found");
        }

        return post;
      } catch (error) {
        console.log("🚀 ~ getPost: ~ error:", error);
        return error;
      }
    },

    isUserLikedPost: async (_, args, contextValue) => {
      try {
        const { _id } = args;

        const user = await contextValue.authentication();

        const result = await Post.checkIsUserLikedPost(_id, user.username);
        return result;
      } catch (error) {
        console.log("🚀 ~ isUserLikedPost: ~ error:", error);
        return error;
      }
    },
  },

  Mutation: {
    addPost: async (_, args, contextValue) => {
      try {
        const { payload } = args;
        const user = await contextValue.authentication();

        const message = await Post.addPost(payload, user._id);
        await redis.del("Posts");

        return message;
      } catch (error) {
        console.log("🚀 ~ addPost:async ~ error:", error);
        return error;
      }
    },

    addComment: async (_, args, contextValue) => {
      try {
        const { payload } = args;
        const user = await contextValue.authentication();

        const message = await Post.addComment(payload, user.username);
        await redis.del("Posts");

        return message;
      } catch (error) {
        console.log("🚀 ~ addComment: ~ error:", error);
        return error;
      }
    },

    addLike: async (_, args, contextValue) => {
      try {
        const { postId } = args;
        const user = await contextValue.authentication();

        const message = await Post.addLike(postId, user.username);
        await redis.del("Posts");

        return message;
      } catch (error) {
        console.log("🚀 ~ addLike:async ~ error:", error);
        return error;
      }
    },

    unLike: async (_, args, contextValue) => {
      try {
        const { postId } = args;
        const user = await contextValue.authentication();

        const message = await Post.unLikePost(postId, user.username);
        await redis.del("Posts");

        return message;
      } catch (error) {
        console.log("🚀 ~ addLike:async ~ error:", error);
        return error;
      }
    },
  },
};

export { postTypeDefs, postResolvers };
