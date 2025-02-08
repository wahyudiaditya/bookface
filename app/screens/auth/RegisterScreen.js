import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { gql, useMutation } from "@apollo/client";
import { errorGraphQL, successToastMessage } from "../../helpers/meesageToast";
import LottieView from "lottie-react-native";

const REGISTER = gql`
  mutation Register($input: RegisterInput) {
    register(input: $input)
  }
`;

export default function RegisterScreen() {
  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [isNext, setIsNext] = useState(false);
  const navigation = useNavigation();

  const [registerUser, { data, loading, error }] = useMutation(REGISTER, {
    onCompleted: () => {
      successToastMessage("Register successfully");
      navigation.navigate("Login");
    },
  });

  const handleNextRegister = () => {
    if (!input.username || input.username.trim() === "") {
      return Toast.show({
        type: "error",
        position: "bottom",
        text1: "Username is Required",
        visibilityTime: 2000,
      });
    }
    setIsNext(true);
  };

  const handleRegister = () => {
    registerUser({
      variables: {
        input: input,
      },
    });
  };

  useEffect(() => {
    if (error) {
      errorGraphQL(error);
    }
  }, [error]);

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
          Register Account
        </Text>
        <LottieView
          source={require("../../assets/fb.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View className="h-1/2 gap-6">
        {!isNext ? (
          <>
            <TextInput
              className="w-[350] rounded-full border border-gray-300 bg-gray-200 px-4"
              value={input.name}
              onChangeText={(item) =>
                setInput({
                  ...input,
                  name: item,
                })
              }
              placeholder="name"
            />
            <TextInput
              className="w-[350] rounded-full border border-gray-300 bg-gray-200 px-4 mb-4"
              placeholder="username"
              onChangeText={(item) =>
                setInput({
                  ...input,
                  username: item,
                })
              }
              value={input.username}
            />

            <TouchableOpacity
              className="rounded-full bg-blue-600 py-3"
              onPress={handleNextRegister}
            >
              <Text className="text-white font-semibold text-center uppercase">
                Next
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              className="w-[350] rounded-full border border-gray-300 bg-gray-200 px-4"
              placeholder="email"
              onChangeText={(item) =>
                setInput({
                  ...input,
                  email: item,
                })
              }
              value={input.email}
            />
            <TextInput
              className="w-[350] rounded-full border mb-4 border-gray-300 bg-gray-200 px-4"
              placeholder="password"
              onChangeText={(item) =>
                setInput({
                  ...input,
                  password: item,
                })
              }
              value={input.password}
              secureTextEntry
            />

            <TouchableOpacity
              className="rounded-full bg-blue-600 py-3 flex-row items-center justify-center"
              onPress={handleRegister}
            >
              {loading ? (
                <LottieView
                  source={require("../../assets/loadingDot.json")}
                  autoPlay
                  loop
                  style={{ width: 100, height: 20, text: "center" }}
                />
              ) : (
                <Text className="text-white font-semibold uppercase">
                  Register
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <Text className="text-sm flex items-center text-center h-8">
          Already have an account ?{" "}
          <Text
            className="text-sm font-bold text-blue-700  flex-row h-fit justify-center items-center"
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}
