import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";
import { comparePasssword, hashPassword } from "../helpers/bcryptjs.js";
import { signToken } from "../helpers/jwt.js";
import { GraphQLError } from "graphql";
import EmailValidator from "email-validator";

export class User {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("Users");
    return collection;
  }

  static async register(input) {
    const { name, username, email, password } = input;

    const collection = this.getCollection();

    if (!username || username.trim() === "") {
      throw new Error("Username is required");
    }

    const isExistingUserByUsername = await collection.findOne({ username });
    if (isExistingUserByUsername) {
      throw new GraphQLError("Username already used", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    if (!email || email.trim() === "") {
      throw new GraphQLError("Email is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    if (!EmailValidator.validate(email)) {
      throw new GraphQLError("Invalid email format", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const isExistingUserByEmail = await collection.findOne({ email });
    if (isExistingUserByEmail) {
      throw new GraphQLError("Email already used", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    if (!password || password.trim() === "") {
      throw new GraphQLError("Password is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    if (password.trim().length < 5) {
      throw new GraphQLError("Password at least 5 characters long", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const hashPw = hashPassword(password);
    const newUser = {
      name: name || "",
      username,
      email,
      password: hashPw,
    };

    await collection.insertOne(newUser);
    return "Register is success";
  }

  static async login(input) {
    const { username, password } = input;
    const collection = this.getCollection();

    if (!username || username.trim() === "") {
      throw new GraphQLError("Username is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    if (!password || password.trim() === "") {
      throw new GraphQLError("Password is required", {
        extensions: {
          code: "BAD REQUEST",
        },
      });
    }

    const user = await collection.findOne({ username });
    if (!user) {
      throw new GraphQLError("Invalid username or password", {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    }

    const isValidPw = comparePasssword(password, user.password);
    if (!isValidPw) {
      throw new GraphQLError("Invalid username or password", {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    }

    const access_token = signToken({ id: user._id });
    console.log({ access_token, id: user._id });

    return { access_token, id: user._id };
  }

  static async findById(id) {
    const collection = this.getCollection();

    const user = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0, email: 0 } }
    );

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: {
          code: "NOT FOUND",
        },
      });
    }

    return user;
  }

  static async findUserInfoById(id) {
    const collection = this.getCollection();

    const user = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "Follows",
            localField: "_id",
            foreignField: "followerId",
            as: "followingData",
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "followingData.followingId",
            foreignField: "_id",
            as: "following",
          },
        },
        {
          $lookup: {
            from: "Follows",
            localField: "_id",
            foreignField: "followingId",
            as: "followersData",
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "followersData.followerId",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $project: {
            followingData: 0,
            password: 0,
            "following.email": 0,
            "following.password": 0,
            "followers.email": 0,
            "followers.password": 0,
          },
        },
      ])
      .toArray();

    if (user.length > 0) {
      return user[0];
    }

    return null;
  }

  static async serachUser(q) {
    const collection = this.getCollection();

    const regex = new RegExp(q, "i");
    const users = await collection
      .find({
        $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
      })
      .toArray();

    return users;
  }
}
