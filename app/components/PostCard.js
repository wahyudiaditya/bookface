import { useContext, useEffect, useState } from "react";
import { timeAgo } from "../helpers/convertTime";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_ALL_POST } from "../screens/feed/FeedScreen";
import { GET_POST_BY_ID } from "../screens/feed/PostDetailScreen";
import { errorGraphQL } from "../helpers/meesageToast";
import { AuthContext } from "../middlewares/auth";
import { GET_POST_USER_ID } from "../screens/users/UserProfileScreen";
import LottieView from "lottie-react-native";

const ADD_LIKE = gql`
  mutation AddLike($postId: ID) {
    addLike(postId: $postId)
  }
`;

const UNLIKE = gql`
  mutation Mutation($postId: ID) {
    unLike(postId: $postId)
  }
`;

export const GET_LIKE_STATUS = gql`
  query Query($id: ID) {
    isUserLikedPost(_id: $id)
  }
`;

export default function PostCard({
  imgUrl,
  name,
  username,
  createdAt,
  likesCount,
  commentsCount,
  content,
  tags,
  postId,
  authorId,
}) {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const navigation = useNavigation();
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${username}`;
  const [isLiked, setIsLiked] = useState(false);
  const context = useContext(AuthContext);

  const [likePost, { data, loading, error }] = useMutation(ADD_LIKE, {
    refetchQueries: [
      {
        query: GET_ALL_POST,
      },
      {
        query: GET_POST_BY_ID,
        variables: {
          id: postId,
        },
      },
      {
        query: GET_POST_USER_ID,
        variables: {
          id: authorId,
        },
      },
      {
        query: GET_POST_USER_ID,
      },
      {
        query: GET_LIKE_STATUS,
      },
    ],
    onCompleted: () => {
      setIsLiked(true);
    },
  });

  const [
    unLikePost,
    { data: unLikeData, loading: unLikeLoading, error: unLikeError },
  ] = useMutation(UNLIKE, {
    refetchQueries: [
      {
        query: GET_ALL_POST,
      },
      {
        query: GET_POST_BY_ID,
        variables: {
          id: postId,
        },
      },
      {
        query: GET_POST_USER_ID,
        variables: {
          id: authorId,
        },
      },
      {
        query: GET_POST_USER_ID,
      },
      {
        query: GET_LIKE_STATUS,
      },
    ],
    onCompleted: () => {
      setIsLiked(false);
    },
  });

  const {
    data: statusLikeData,
    loading: statusLikeLoading,
    error: statusLikeError,
    refetch,
  } = useQuery(GET_LIKE_STATUS, {
    variables: {
      id: postId,
    },
    fetchPolicy: "network-only",
  });

  const handleImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    setImageDimensions({ width, height });
  };

  const handleLike = () => {
    likePost({
      variables: {
        postId,
      },
    }).then(() => {
      setIsLiked(!isLiked);
      refetch();
    });
  };

  const handleUnLike = () => {
    unLikePost({
      variables: {
        postId,
      },
    }).then(() => {
      setIsLiked(false);
      refetch();
    });
  };

  const handleAuthorPress = () => {
    if (context.profileId && authorId) {
      if (context.profileId === authorId) {
        navigation.navigate("MyProfile");
      } else {
        navigation.navigate("UserProfile", {
          userId: authorId,
        });
      }
    }
  };

  useEffect(() => {
    if (statusLikeData) {
      setIsLiked(statusLikeData.isUserLikedPost);
    }
  }, [statusLikeData]);

  useEffect(() => {
    if (error) {
      errorGraphQL(error);
    }
    if (unLikeError) {
      errorGraphQL(unLikeError);
    }
  }, [error, unLikeError]);

  return (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate("PostDetail", {
            postId,
          })
        }
      >
        <View className="mx-auto font-bold w-[400] py-3">
          <View className="flex-row items-center w-fit">
            <Pressable onPress={handleAuthorPress}>
              <Image
                className="w-[50] rounded-full h-[50] object-cover"
                source={{
                  uri: avatarUrl,
                }}
              />
            </Pressable>
            <View className="pl-3">
              <Pressable onPress={handleAuthorPress}>
                <Text className="font-bold text-xl">
                  {name ? name : username}
                </Text>
              </Pressable>
              <View className="flex-row items-center py-1">
                <Text className="pr-2 text-gray-500 text-sm">
                  {timeAgo(createdAt)}
                </Text>
                <Fontisto name="earth" size={15} color="gray" />
              </View>
            </View>
          </View>
          <Text className="pt-4">{content}</Text>
          {tags && (
            <View className="flex-row gap-1">
              {tags.map((el, index) => (
                <Text
                  key={index}
                  className="font-semibold text-blue-500 text-sm self-start"
                >
                  {el}
                </Text>
              ))}
            </View>
          )}
        </View>
        {imgUrl && (
          <View className="py-2">
            <Image
              onLoad={handleImageLoad}
              style={{
                width: "100%",
                height:
                  imageDimensions.height > 0 ? imageDimensions.height : 300,
              }}
              source={{
                uri: imgUrl,
              }}
            />
          </View>
        )}
      </Pressable>
      {likesCount || commentsCount ? (
        <View className="flex-row mx-auto w-[400] items-center py-4">
          {likesCount == 0 || !likesCount ? (
            <Text className="me-auto"></Text>
          ) : (
            <>
              <AntDesign
                name="like1"
                size={12}
                color="white"
                className="bg-blue-500 rounded-full p-1"
              />
              <Text className="text-sm px-2 text-gray-500 me-auto">
                {likesCount}
              </Text>
            </>
          )}
          {commentsCount ? (
            <Text className="text-sm px-1 pt-1 text-gray-600">
              {commentsCount} Comments
            </Text>
          ) : (
            <Text></Text>
          )}
        </View>
      ) : (
        <Text></Text>
      )}

      <View className="border-t-hairline border-gray-300 py-4">
        <View className="flex-row items-center mx-auto w-[400] justify-between">
          {isLiked ? (
            <Pressable className="flex-row items-center" onPress={handleUnLike}>
              {unLikeLoading ? (
                <>
                  <LottieView
                    source={require("../assets/Animation.json")}
                    autoPlay
                    loop
                    style={{ width: 30, height: 25 }}
                  />
                  <Text className="px-2 pt-1">Like</Text>
                </>
              ) : (
                <>
                  <AntDesign name="like1" size={20} color="blue" />
                  <Text className="px-2 pt-1">Like</Text>
                </>
              )}
            </Pressable>
          ) : (
            <Pressable className="flex-row items-center" onPress={handleLike}>
              {loading ? (
                <>
                  <LottieView
                    source={require("../assets/Animation.json")}
                    autoPlay
                    loop
                    style={{ width: 30, height: 25 }}
                  />
                  <Text className="px-2 pt-1">Like</Text>
                </>
              ) : (
                <>
                  <AntDesign name="like2" size={20} color="gray" />
                  <Text className="px-2 pt-1">Like</Text>
                </>
              )}
            </Pressable>
          )}

          <Pressable
            onPress={() =>
              navigation.navigate("PostDetail", {
                postId,
              })
            }
            className="flex-row items-center"
          >
            <FontAwesome5
              name="comment-alt"
              size={20}
              color="gray"
              className="px-2"
            />
            <Text>Comment</Text>
          </Pressable>
          <View className="flex-row items-center">
            <FontAwesome
              name="send-o"
              size={20}
              color="gray"
              className="px-2"
            />
            <Text>Send</Text>
          </View>
          <View className="flex-row items-center">
            <AntDesign
              name="sharealt"
              size={20}
              color="gray"
              className="px-2"
            />
            <Text>Share</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
