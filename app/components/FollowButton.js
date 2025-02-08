import { Pressable, ScrollView, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { GET_USER_PROFILE_BY_ID } from "../screens/users/UserProfileScreen";
import { MY_PROFILE } from "../screens/home/MyProfileScreen";
import LottieView from "lottie-react-native";

const FOLLOW_USER_BY_ID = gql`
  mutation Mutation($followingId: ID) {
    follow(followingId: $followingId)
  }
`;

const UNFOLLOW_USER_BY_ID = gql`
  mutation UnFollow($followingId: ID) {
    unFollow(followingId: $followingId)
  }
`;

export default function FollowButton({ userId, followersUser }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [followUser, { data, loading, error }] = useMutation(
    FOLLOW_USER_BY_ID,
    {
      onCompleted: () => {
        setIsFollowing(true);
      },
      refetchQueries: [
        {
          query: GET_USER_PROFILE_BY_ID,
          variables: {
            getUserInfoId: userId,
          },
        },

        {
          query: MY_PROFILE,
        },
      ],
    }
  );

  const [
    unFollowUser,
    { data: unFollowData, loading: unFollowLoading, error: unFollowError },
  ] = useMutation(UNFOLLOW_USER_BY_ID, {
    onCompleted: () => {
      setIsFollowing(false);
    },
    refetchQueries: [
      {
        query: GET_USER_PROFILE_BY_ID,
        variables: {
          getUserInfoId: userId,
        },
      },

      {
        query: MY_PROFILE,
      },
    ],
  });

  const getProfileId = async () => {
    const id = await SecureStore.getItemAsync("profileId");
    setProfileId(id);
  };

  useEffect(() => {
    if (profileId && followersUser) {
      const found = followersUser?.find((item) => item._id === profileId);
      if (found) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    }
  }, [profileId, followersUser]);

  const handleFollow = () => {
    followUser({
      variables: {
        followingId: userId,
      },
    });
  };

  const handleUnFollow = () => {
    unFollowUser({
      variables: {
        followingId: userId,
      },
    });
  };

  useEffect(() => {
    getProfileId();
  }, []);

  return (
    <View className="flex-row pb-4 mx-auto w-[400] justify-center gap-2 items-center">
      {isFollowing ? (
        <Pressable
          className="flex-row rounded-md px-3 py-1 h-[35] w-1/2 bg-gray-400 gap-2 justify-center items-center"
          onPress={handleUnFollow}
        >
          {unFollowLoading ? (
            <LottieView
              source={require("../assets/loadingDot.json")}
              autoPlay
              loop
              style={{ width: 100, height: 20, text: "center" }}
            />
          ) : (
            <>
              <FontAwesome6 name="user-check" size={18} color="white" />
              <Text className="font-semibold text-white">Following</Text>
            </>
          )}
        </Pressable>
      ) : (
        <Pressable
          className="flex-row rounded-md px-3 py-1 h-[35] w-1/2 bg-blue-500 gap-2 justify-center items-center"
          onPress={handleFollow}
        >
          {loading ? (
            <LottieView
              source={require("../assets/loadingDot.json")}
              autoPlay
              loop
              style={{ width: 100, height: 20, text: "center" }}
            />
          ) : (
            <>
              <FontAwesome6 name="user-plus" size={18} color="white" />
              <Text className="font-semibold text-white">Follow</Text>
            </>
          )}
        </Pressable>
      )}
      <View className="flex-row rounded-md px-3 py-1 h-[35] w-1/2 bg-blue-500 gap-2 justify-center items-center">
        <FontAwesome5 name="facebook-messenger" size={18} color="white" />
        <Text className="font-semibold text-white">Message</Text>
      </View>
    </View>
  );
}
