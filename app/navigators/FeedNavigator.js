import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../screens/feed/FeedScreen";
import SearchUserScreen from "../screens/users/SearchUserScreen";
const Stack = createNativeStackNavigator();

export default function FeedNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchUser"
        component={SearchUserScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
