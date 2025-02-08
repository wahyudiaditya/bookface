import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import ProfileComponent from "../../components/ProfileComponent";
import { AuthContext } from "../../middlewares/auth";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import AntDesign from "@expo/vector-icons/AntDesign";
import PostCard from "../../components/PostCard";
import LottieView from "lottie-react-native";

export const MY_PROFILE = gql`
  query GetProfileInfo {
    getProfileInfo {
      _id
      name
      username
      following {
        _id
        name
        username
      }
      followers {
        _id
        name
        username
      }
    }
  }
`;

export const GET_POST_MY_PROFILE = gql`
  query GetPostByMyProfileId {
    getPostByMyProfileId {
      _id
      content
      tags
      imgUrl
      commentsCount
      likesCount
      createdAt
      updatedAt
    }
  }
`;

export default function MyProfileScree() {
  const context = useContext(AuthContext);

  const { data, loading, error } = useQuery(MY_PROFILE, {
    fetchPolicy: "network-only",
  });

  const {
    data: postProfileData,
    loading: postProfileLoading,
    error: postProfileError,
  } = useQuery(GET_POST_MY_PROFILE, {
    fetchPolicy: "network-only",
  });

  const handleLogout = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to logout ?",
      [
        {
          text: "No",
          onPress: () => console.log("Logout dibatalkan"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await SecureStore.deleteItemAsync("access_token");
            await SecureStore.deleteItemAsync("userId");
            context.setProfileId("");
            context.setIsLogin(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const posts = postProfileData?.getPostByMyProfileId;
  let postsCount;
  if (posts) {
    postsCount = posts.length;
  } else {
    postsCount = 0;
  }

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${data?.getProfileInfo.username}`;

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
            <Text className="text-xl font-bold text-gray-800">My Profile</Text>
            <TouchableOpacity onPress={handleLogout}>
              <AntDesign name="logout" size={22} color="red" />
            </TouchableOpacity>
          </View>
          {posts ? (
            <FlatList
              ListHeaderComponent={
                <ProfileComponent
                  user={data?.getProfileInfo}
                  profileImg={avatarUrl}
                  postsCount={postsCount}
                />
              }
              data={posts}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <View
                  className={`${
                    index === posts.length - 1
                      ? ""
                      : "border-b-8 border-gray-300"
                  }`}
                >
                  <PostCard
                    authorId={data?.getProfileInfo._id}
                    postId={item._id}
                    imgUrl={item.imgUrl}
                    name={data?.getProfileInfo.name}
                    username={data?.getProfileInfo.username}
                    createdAt={item.createdAt}
                    likesCount={item.likesCount}
                    commentsCount={item.commentsCount}
                    content={item.content}
                    tags={item.tags}
                  />
                </View>
              )}
            />
          ) : (
            <ProfileComponent
              user={data?.getProfileInfo}
              postsCount={postsCount}
              profileImg={avatarUrl}
            />
          )}
        </View>
      )}
    </>
  );
}
