import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import Toast from "react-native-toast-message";
import AppNavigator from "./navigators/AppNavigator";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import { AuthContext } from "./middlewares/auth";
import { useEffect, useState } from "react";
import PostDetail from "./screens/feed/PostDetailScreen";
import UserProfileScreen from "./screens/users/UserProfileScreen";
import AddPostScreen from "./screens/feed/AddPostScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [profileId, setProfileId] = useState("");
  useEffect(() => {
    isTokenValid();
    getProfileId();
  }, []);

  const isTokenValid = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      setIsLogin(true);
    }
  };

  const getProfileId = async () => {
    const getId = await SecureStore.getItemAsync("profileId");
    setProfileId(getId);
  };
  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setIsLogin,
        profileId,
        setProfileId,
      }}
    >
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator>
            {isLogin ? (
              <>
                <Stack.Screen
                  name="AppNavigator"
                  component={AppNavigator}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="UserProfile"
                  component={UserProfileScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="PostDetail"
                  component={PostDetail}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="AddPost"
                  component={AddPostScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              </>
            )}
          </Stack.Navigator>
          <Toast />
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}
