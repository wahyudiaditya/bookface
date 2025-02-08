import { GraphQLError } from "graphql";
import { getDB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

export class Follow {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("Follows");
    return collection;
  }

  static async followUser({ followerId, followingId }) {
    const collection = this.getCollection();

    if (!followerId || !followingId) {
      throw new GraphQLError("Follower or following id required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    if (followerId === followingId) {
      throw new GraphQLError("You cant follow yourself", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const isFollowed = await collection.findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });

    if (isFollowed) {
      throw new GraphQLError("Already following this user", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    await collection.insertOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return "Success to follow this user";
  }

  static async unFollowUser(followerId, followingId) {
    const collection = this.getCollection();

    if (!followerId || !followingId) {
      throw new GraphQLError("Follower or following id required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    if (followerId === followingId) {
      throw new GraphQLError("You cant unfollow yourself", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const isFollowed = await collection.findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });

    if (!isFollowed) {
      throw new GraphQLError("You havent following this user", {
        extensions: {
          code: "NOT FOUND",
        },
      });
    }

    await collection.deleteOne({
      _id: isFollowed._id,
    });

    return "Success to unfollow this user";
  }
}
