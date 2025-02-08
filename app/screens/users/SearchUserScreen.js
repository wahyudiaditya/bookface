import React, { useContext, useState } from "react";
import {
  TextInput,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";
import { AuthContext } from "../../middlewares/auth";

const SEARCH = gql`
  query SearchUsers($q: String) {
    searchUsers(q: $q) {
      _id
      name
      username
    }
  }
`;

export default function SearchUserScreen() {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();
  const context = useContext(AuthContext);

  const { data, loading, error } = useQuery(SEARCH, {
    variables: {
      q: query,
    },
    skip: query === "",
  });

  const handleAuthorPress = (userId) => {
    if (context.profileId && userId) {
      if (context.profileId === userId) {
        navigation.navigate("MyProfile");
      } else {
        navigation.navigate("UserProfile", {
          userId: userId,
        });
      }
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-2 px-8 flex-row items-center bg-gray-200 rounded-full mx-4 mt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="gray" />
        </TouchableOpacity>
        <TextInput
          className="ml-4 flex-1 bg-transparent"
          placeholder="Search"
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        <Feather name="search" size={20} color="gray" />
      </View>

      <FlatList
        className="mt-4"
        data={data?.searchUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            className="flex-row items-center p-4 border-b border-gray-300"
            onPress={() => handleAuthorPress(item._id)}
          >
            <Image
              source={{
                uri: `https://api.dicebear.com/9.x/avataaars/png?seed=${item?.username}`,
              }}
              className="w-12 h-12 rounded-full"
            />
            <Text className="ml-4 text-lg font-semibold">{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
