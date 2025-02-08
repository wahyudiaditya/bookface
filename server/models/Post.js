import { GraphQLError } from "graphql";
import { getDB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

export class Post {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("Posts");
    return collection;
  }

  static async addPost(payload, authorId) {
    const { content, tags, imgUrl } = payload;

    if (!content) {
      throw new GraphQLError("Content is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }
    if (!authorId) {
      throw new GraphQLError("AuthorId is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const collection = this.getCollection();

    await collection.insertOne({
      content,
      tags,
      imgUrl: imgUrl || "",
      authorId: new ObjectId(authorId),
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return "Success to add post";
  }

  static async getPost() {
    const collection = this.getCollection();

    const posts = await collection
      .aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
          },
        },
        {
          $project: {
            content: 1,
            tags: 1,
            imgUrl: 1,
            authorId: 1,
            createdAt: 1,
            updatedAt: 1,
            commentsCount: { $size: { $ifNull: ["$comments", []] } },
            likesCount: { $size: { $ifNull: ["$likes", []] } },
            author: 1,
          },
        },
      ])
      .toArray();

    if (posts.length > 0) {
      return posts;
    }

    return null;
  }

  static async getPostById(id) {
    const collection = this.getCollection();
    const posts = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
          },
        },
        {
          $project: {
            content: 1,
            tags: 1,
            imgUrl: 1,
            authorId: 1,
            createdAt: 1,
            updatedAt: 1,
            comments: 1,
            likes: 1,
            commentsCount: { $size: { $ifNull: ["$comments", []] } },
            likesCount: { $size: { $ifNull: ["$likes", []] } },
            author: 1,
          },
        },
      ])
      .toArray();

    if (posts.length > 0) {
      return posts[0];
    }

    return null;
  }

  static async addComment(payload, username) {
    const collection = this.getCollection();

    const { content, postId } = payload;

    if (!content) {
      throw new GraphQLError("Content is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    if (!postId) {
      throw new GraphQLError("PostId is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const post = await this.getPostById(postId);

    if (!post) {
      throw new GraphQLError("Post not found", {
        extensions: {
          code: "NOT FOUND",
        },
      });
    }

    const newComment = {
      content,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { _id: post._id },
      {
        $push: { comments: newComment },
      }
    );

    return "Success to add comment";
  }

  static async addLike(postId, username) {
    const collection = this.getCollection();

    if (!username) {
      throw new GraphQLError("Username is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const post = await this.getPostById(postId);

    if (!post) {
      throw new GraphQLError("Post not found", {
        extensions: {
          code: "NOT FOUND",
        },
      });
    }

    const existingLike = post.likes.find((like) => like.username === username);

    if (existingLike) {
      throw new GraphQLError("You have already liked this post", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const newLike = {
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { _id: post._id },
      {
        $push: { likes: newLike },
      }
    );

    return "Success to like post";
  }

  static async checkIsUserLikedPost(postId, username) {
    if (!username) {
      throw new GraphQLError("Username is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const post = await this.getPostById(postId);

    if (!post) {
      throw new GraphQLError("Post not found", {
        extensions: {
          code: "NOT FOUND",
        },
      });
    }

    const existingLike = post.likes.find((like) => like.username === username);

    if (existingLike) {
      return true;
    }

    return false;
  }

  static async unLikePost(postId, username) {
    const collection = this.getCollection();

    if (!username) {
      throw new GraphQLError("Username is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const post = await this.getPostById(postId);

    if (!post) {
      throw new GraphQLError("Post not found", {
        extensions: {
          code: "NOT FOUND",
        },
      });
    }

    const existingLike = post.likes.find((like) => like.username === username);

    if (!existingLike) {
      throw new GraphQLError("You haven't liked this post", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    await collection.updateOne(
      { _id: post._id },
      {
        $pull: { likes: { username } },
      }
    );

    return "Success to unlike post";
  }

  static async getPostByMyProfileId(myProfileId) {
    const collection = this.getCollection();

    const posts = await collection
      .aggregate([
        {
          $match: {
            authorId: new ObjectId(myProfileId),
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            content: 1,
            tags: 1,
            imgUrl: 1,
            createdAt: 1,
            updatedAt: 1,
            commentsCount: { $size: { $ifNull: ["$comments", []] } },
            likesCount: { $size: { $ifNull: ["$likes", []] } },
          },
        },
      ])
      .toArray();

    if (posts.length > 0) {
      return posts;
    }

    return null;
  }
}
