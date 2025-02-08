import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "@expo/vector-icons/Feather";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MyProfileScree from "../screens/home/MyProfileScreen";
import FeedNavigator from "./FeedNavigator";
import Entypo from "@expo/vector-icons/Entypo";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="FeedNavigator"
        component={FeedNavigator}
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
        tabBarOptions={{
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScree}
        options={{
          tabBarIcon: ({ color }) => (
            <EvilIcons name="user" size={32} color={color} />
          ),
        }}
        tabBarOptions={{
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
        }}
      />
    </Tab.Navigator>
  );
}
