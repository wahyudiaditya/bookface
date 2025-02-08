import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Touchable,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { errorGraphQL } from "../../helpers/meesageToast";
import PostCard from "../../components/PostCard";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import LottieView from "lottie-react-native";

export const GET_ALL_POST = gql`
  query GetPosts {
    getPosts {
      _id
      content
      tags
      imgUrl
      authorId
      commentsCount
      likesCount
      author {
        _id
        name
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export default function FeedScreen() {
  const navigation = useNavigation();

  const { data, loading, error, refetch } = useQuery(GET_ALL_POST);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation, refetch]);
  useEffect(() => {
    if (error) {
      errorGraphQL(error);
    }
  }, [error]);
  return (
    <>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <LottieView
            source={require("../../assets/loadingScreen.json")}
            autoPlay
            loop
            style={{ width: 250, height: 250, text: "center" }}
          />
        </View>
      ) : (
        <View className="flex-1 bg-gray-50 mt-12">
          <View className="flex-row justify-between items-center px-4 py-4 bg-gray-100">
            <Text className="text-4xl font-bold me-auto text-blue-500">
              bookface
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddPost")}
              className="px-4"
            >
              <AntDesign
                name="plus"
                size={18}
                color="gray"
                className="bg-gray-300 rounded-full p-2"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SearchUser")}>
              <Feather
                name="search"
                size={18}
                color="gray"
                className="bg-gray-300 rounded-full p-2"
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data?.getPosts}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <View
                className={`${
                  index === data?.getPosts.length - 1
                    ? ""
                    : "border-b-8 border-gray-300"
                }`}
              >
                <PostCard
                  authorId={item.authorId}
                  postId={item._id}
                  imgUrl={item.imgUrl}
                  name={item.author.name}
                  username={item.author.username}
                  createdAt={item.createdAt}
                  likesCount={item.likesCount}
                  commentsCount={item.commentsCount}
                  content={item.content}
                  tags={item.tags}
                />
              </View>
            )}
          />
        </View>
      )}
    </>
  );
}
