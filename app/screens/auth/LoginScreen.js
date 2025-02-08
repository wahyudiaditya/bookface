import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../middlewares/auth";
import * as SecureStore from "expo-secure-store";
import { errorGraphQL, successToastMessage } from "../../helpers/meesageToast";
import { MY_PROFILE } from "../home/MyProfileScreen";
import LottieView from "lottie-react-native";

const LOGIN = gql`
  mutation Mutation($input: LoginInput) {
    login(input: $input) {
      access_token
      id
    }
  }
`;

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const context = useContext(AuthContext);

  const [loginUser, { data, loading, error }] = useMutation(LOGIN, {
    refetchQueries: [
      {
        query: MY_PROFILE,
      },
    ],
    onCompleted: async (result) => {
      successToastMessage("Login successfully");
      await SecureStore.setItemAsync("access_token", result.login.access_token);
      await SecureStore.setItemAsync("profileId", result.login.id);
      const id = await SecureStore.getItemAsync("profileId");
      context.setProfileId(id);
      context.setIsLogin(true);
    },
  });
  useEffect(() => {
    if (error) {
      errorGraphQL(error);
    }
  }, [error]);

  const handleLogin = () => {
    loginUser({
      variables: {
        input: {
          username,
          password,
        },
      },
    });
  };
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 mt-12">
      <View className="h-1/2 justify-center items-center pt-20">
        <FontAwesome5
          name="facebook"
          size={60}
          color="blue"
          className="mx-auto"
        />
        <Text className="text-2xl pt-2 font-semibold text-blue-500 text-center">
          Login to bookface
        </Text>
        <LottieView
          source={require("../../assets/fb.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View className="h-1/2 gap-6">
        <TextInput
          className="w-[350] rounded-full border border-gray-300 bg-gray-200 px-4"
          placeholder="username"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          className="w-[350] rounded-full border border-gray-300 bg-gray-200 px-4 mb-4"
          placeholder="password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity
          className="rounded-full bg-blue-600 py-3 flex-row items-center justify-center"
          onPress={handleLogin}
        >
          {loading ? (
            <LottieView
              source={require("../../assets/loadingDot.json")}
              autoPlay
              loop
              style={{ width: 100, height: 20, text: "center" }}
            />
          ) : (
            <Text className="text-white font-semibold uppercase">Login</Text>
          )}
        </TouchableOpacity>

        <Text className="text-sm flex items-center text-center h-8">
          Don't have an account yet ?{" "}
          <Text
            className="text-sm font-bold text-blue-700  flex-row h-fit justify-center items-center"
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
}
