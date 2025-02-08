import { Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  Easing,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import FollowModal from "./FollowModal";
import { useState } from "react";

export default function ProfileComponent({ user, profileImg, postsCount }) {
  const [followingModalVisible, setFollowingModalVisible] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const translateY = useSharedValue(1000);

  const openFollowingModal = () => {
    setFollowingModalVisible(true);
    translateY.value = withDelay(
      500,
      withTiming(0, {
        duration: 2000,
        Easing: Easing.out(Easing.ease),
      })
    );
  };

  const closeFollowingModal = () => {
    translateY.value = withTiming(1000, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    setTimeout(() => setFollowingModalVisible(false), 300);
  };

  const openFollowersModal = () => {
    setFollowersModalVisible(true);
    translateY.value = withDelay(
      500,
      withTiming(0, {
        duration: 2000,
        Easing: Easing.out(Easing.ease),
      })
    );
  };

  const closeFollowersModal = () => {
    translateY.value = withTiming(1000, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    setTimeout(() => setFollowersModalVisible(false), 300);
  };
  return (
    <ScrollView className="flex-1 pb-6">
      <View className="relative">
        <Image
          source={{
            uri: "https://images.pexels.com/photos/30137357/pexels-photo-30137357.jpeg?auto=compress&cs=tinysrgb&w=600",
          }}
          className="w-full h-56"
        />
        <Image
          source={{
            uri: profileImg,
          }}
          className="absolute top-32 transform w-40 h-40 rounded-full border-4 border-gray-300 bg-gray-300"
        />
      </View>

      <View className="px-4 mt-20">
        <Text className="text-4xl font-bold text-gray-800">{user?.name}</Text>
        <Text className="text-sm text-gray-500 mt-1">@{user?.username}</Text>

        <View className="flex-row justify-between mt-4">
          <Pressable
            className="flex-1 items-center"
            onPress={openFollowingModal}
          >
            <Text className="font-semibold text-lg text-gray-700">
              {user?.following.length}
            </Text>
            <Text className="text-sm text-gray-400">Following</Text>
          </Pressable>
          <Pressable
            className="flex-1 items-center"
            onPress={openFollowersModal}
          >
            <Text className="font-semibold text-lg text-gray-700">
              {user?.followers.length}
            </Text>
            <Text className="text-sm text-gray-400">Followers</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="font-semibold text-lg text-gray-700">
              {postsCount}
            </Text>
            <Text className="text-sm text-gray-400">Post</Text>
          </View>
        </View>
        <FollowModal
          modalVisible={followingModalVisible}
          closeModal={closeFollowingModal}
          modalTitle={"Following"}
          data={user?.following}
        />

        <FollowModal
          modalVisible={followersModalVisible}
          closeModal={closeFollowersModal}
          modalTitle={"Followers"}
          data={user?.followers}
        />
      </View>
    </ScrollView>
  );
}
