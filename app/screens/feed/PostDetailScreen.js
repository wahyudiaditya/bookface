import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { errorGraphQL } from "../../helpers/meesageToast";
import PostCard from "../../components/PostCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Easing,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import LikedPostModal from "../../components/LikedPostModal";
import ComentsCompoent from "../../components/ComentsCompoent";
import LottieView from "lottie-react-native";
import { GET_ALL_POST, GET_POST } from "./FeedScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export const GET_POST_BY_ID = gql`
  query GetPost($id: ID) {
    getPostById(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      commentsCount
      likesCount
      author {
        _id
        name
        username
      }
      createdAt
      updatedAt
      likes {
        username
        createdAt
        updatedAt
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($payload: CommentInput) {
    addComment(payload: $payload)
  }
`;

export default function PostDetail({ route }) {
  const { postId } = route.params;
  const [comment, setComment] = useState("");
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: {
      id: postId,
    },
    fetchPolicy: "network-only",
  });

  const [addComent, { loading: addCommentLoading }] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: {
          id: postId,
        },
      },
      {
        query: GET_ALL_POST,
      },
    ],
    onError: (error) => {
      errorGraphQL(error);
    },
    onCompleted: (data) => {
      setComment("");
      console.log("Comment added:", data);
    },
  });

  const post = data?.getPostById;
  const date = post?.createdAt;
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${post?.username}`;
  const [modalVisible, setModalVisible] = useState(false);
  const likedUsers = post?.likes || [];
  const navigation = useNavigation();

  const translateY = useSharedValue(1000);

  const openLikedModal = () => {
    setModalVisible(true);
    translateY.value = withDelay(
      500,
      withTiming(0, {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      })
    );
  };

  const closeLikedModal = () => {
    translateY.value = withTiming(1000, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    setTimeout(() => setModalVisible(false), 300);
  };

  const handleAddComment = () => {
    addComent({
      variables: {
        payload: {
          content: comment,
          postId,
        },
      },
    });
  };

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
        <>
          <View className="flex-row gap-4 items-center px-4 py-4 mt-12 bg-gray-100">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="gray" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">
              {post?.author.name ? post?.author.name : post?.author.username}{" "}
              Post
            </Text>
          </View>
          <ScrollView>
            <PostCard
              authorId={post?.authorId}
              postId={post?._id}
              imgUrl={post?.imgUrl}
              name={post?.author.name}
              username={post?.author.username}
              createdAt={+date}
              content={post?.content}
              tags={post?.tags}
            />
            <ScrollView className="mx-auto w-[400] pb-2">
              {post?.likesCount !== 0 ? (
                <>
                  <Pressable className="flex-row" onPress={openLikedModal}>
                    <AntDesign
                      name="like1"
                      size={11}
                      color="white"
                      className="bg-blue-500 rounded-full p-1"
                    />
                    <Text className="text-sm px-2 text-blue-500 font-semibold me-auto">
                      {post?.likesCount}
                    </Text>
                  </Pressable>
                  <LikedPostModal
                    likedUsers={likedUsers}
                    modalVisible={modalVisible}
                    closeModal={closeLikedModal}
                    avatarUrl={avatarUrl}
                  />
                </>
              ) : (
                <></>
              )}
            </ScrollView>
            <ComentsCompoent post={post} />
          </ScrollView>

          <View className="border-t-2 py-4 border-gray-300">
            <View className="flex-row gap-2 w-[400] mx-auto ">
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Tulis komentar..."
                className="border border-gray-300 rounded-lg p-3 mb-4 text-base w-3/4 h-[40]"
              />
              <Pressable
                className="bg-blue-500 rounded-lg py-1 px-4 items-center justify-center w-1/4 h-[40]"
                onPress={handleAddComment}
              >
                {addCommentLoading ? (
                  <LottieView
                    source={require("../../assets/loadingDot.json")}
                    autoPlay
                    loop
                    style={{ width: 100, height: 20, text: "center" }}
                  />
                ) : (
                  <Text className="text-white font-semibold">Send</Text>
                )}
              </Pressable>
            </View>
          </View>
        </>
      )}
    </>
  );
}
