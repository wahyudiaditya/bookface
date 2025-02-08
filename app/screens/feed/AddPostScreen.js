import React, { useEffect, useState } from "react";
import { TextInput, Image, View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_ALL_POST } from "./FeedScreen";
import { useNavigation } from "@react-navigation/native";
import { errorGraphQL } from "../../helpers/meesageToast";
import LottieView from "lottie-react-native";

const ADD_POST = gql`
  mutation AddPost($payload: PostInput) {
    addPost(payload: $payload)
  }
`;

const MY_PROFILE_ADD_POST = gql`
  query GetProfileInfo {
    getProfileInfo {
      name
      username
    }
  }
`;

export default function AddPostScreen() {
  const [postText, setPostText] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://img.freepik.com/free-photo/beautiful-shot-grassy-hills-covered-trees-near-mountains-dolomites-italy_181624-24400.jpg?uid=R159622897&semt=ais_hybrid"
  );

  const navigation = useNavigation();

  const [addPost, { data, loading, error }] = useMutation(ADD_POST, {
    refetchQueries: [
      {
        query: GET_ALL_POST,
      },
    ],
    onCompleted: () => {
      navigation.navigate("AppNavigator");
    },
  });

  const {
    data: dataMyProfile,
    loading: loadingMyProfile,
    error: errorMyProfile,
  } = useQuery(MY_PROFILE_ADD_POST, {
    fetchPolicy: "network-only",
  });

  const handlePost = () => {
    const postData = {
      content: postText,
      tags: tags.split(",").map((tag) => tag.trim()),
      imgUrl: imageUrl,
    };

    addPost({
      variables: {
        payload: postData,
      },
    });
  };
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${dataMyProfile?.getProfileInfo.username}`;

  const handleBack = () => {
    setPostText("");
    setTags("");
    setImageUrl("");
    navigation.goBack();
  };

  useEffect(() => {
    if (error) {
      errorGraphQL(error);
    }
  }, [error]);

  return (
    <View className="flex-1 bg-gray-100 mt-12 mx-auto w-[400]">
      <View className="flex-row justify-between items-center py-4 bg-gray-100">
        <Pressable onPress={handleBack}>
          <Fontisto name="close-a" size={24} color="gray" />
        </Pressable>
        <Text className="font-bold text-xl">Create Post</Text>
      </View>
      <View className="flex-row items-center py-4 bg-transparent">
        <Image
          className="w-[50] rounded-full h-[50] object-cover"
          source={{
            uri: avatarUrl,
          }}
        />
        <Text className="ml-3 text-lg font-bold">
          {dataMyProfile?.getProfileInfo.name
            ? dataMyProfile?.getProfileInfo.name
            : dataMyProfile?.getProfileInfo.username}
        </Text>
      </View>
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4 text-lg h-[150]"
        placeholder="What's on your mind?"
        multiline={true}
        value={postText}
        onChangeText={setPostText}
        style={{ textAlignVertical: "top" }}
      />

      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4 h-[50] text-lg"
        placeholder="Add tags (comma separated)"
        value={tags}
        onChangeText={setTags}
      />

      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4 h-[50] text-lg"
        placeholder="Enter image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <View className="flex-row justify-center items-center">
        <Pressable
          onPress={handlePost}
          className="bg-blue-600 p-3 rounded-lg w-40 justify-center items-center"
        >
          {loading ? (
            <LottieView
              source={require("../../assets/loadingDot.json")}
              autoPlay
              loop
              style={{ width: 100, height: 20 }}
            />
          ) : (
            <Text className="text-white text-center font-semibold ">POST</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
