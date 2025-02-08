import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProfileComponent from "../../components/ProfileComponent";
import PostCard from "../../components/PostCard";
import { gql, useMutation, useQuery } from "@apollo/client";
import FollowButton from "../../components/FollowButton";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export const GET_USER_PROFILE_BY_ID = gql`
  query Query($getUserInfoId: ID) {
    getUserInfo(id: $getUserInfoId) {
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

export const GET_POST_USER_ID = gql`
  query GetPostByUserId($id: ID) {
    getPostByUserId(_id: $id) {
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

export default function UserProfileScreen({ route }) {
  const { userId } = route.params;

  const { data, loading, error } = useQuery(GET_USER_PROFILE_BY_ID, {
    variables: {
      getUserInfoId: userId,
    },
    fetchPolicy: "network-only",
  });

  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useQuery(GET_POST_USER_ID, {
    variables: {
      id: userId,
    },
  });

  const navigation = useNavigation();

  const posts = postData?.getPostByUserId;
  let postsCount;
  if (posts) {
    postsCount = posts.length;
  } else {
    postsCount = 0;
  }

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${data?.getUserInfo.username}`;

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
          <View className="flex-row gap-4 items-center px-4 py-4 bg-gray-100">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="gray" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">
              {data?.getUserInfo.name
                ? data?.getUserInfo.name
                : data?.getUserInfo.username}{" "}
              Profile
            </Text>
          </View>
          {posts ? (
            <FlatList
              ListHeaderComponent={
                <>
                  <ProfileComponent
                    user={data?.getUserInfo}
                    profileImg={avatarUrl}
                    postsCount={postsCount}
                  />
                  <FollowButton
                    followersUser={data?.getUserInfo.followers}
                    userId={data?.getUserInfo._id}
                  />
                </>
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
                    authorId={data?.getUserInfo._id}
                    postId={item._id}
                    imgUrl={item.imgUrl}
                    name={data?.getUserInfo.name}
                    username={data?.getUserInfo.username}
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
            <ScrollView>
              <ProfileComponent
                user={data?.getUserInfo}
                profileImg={avatarUrl}
                postsCount={postsCount}
              />
              <FollowButton
                followersUser={data?.getUserInfo.followers}
                userId={data?.getUserInfo._id}
              />
            </ScrollView>
          )}
        </View>
      )}
    </>
  );
}
