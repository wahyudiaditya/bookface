import { FlatList, Image, ScrollView, Text, View } from "react-native";

export default function ComentsCompoent({ post }) {
  const comments = post?.comments;
  return (
    <>
      {comments?.map((item, index) => (
        <View key={index} className="px-4 py-2 ">
          <View className="flex-row gap-2">
            <Image
              className="w-[30] rounded-full h-[30] object-cover"
              source={{
                uri: `https://api.dicebear.com/9.x/avataaars/png?seed=${item?.username}`,
              }}
            />
            <ScrollView className="bg-gray-200 py-2 px-3 rounded-xl gap-1">
              <Text className="font-semibold text-sm">@{item?.username}</Text>
              <Text className="text-sm">{item?.content}</Text>
            </ScrollView>
          </View>
        </View>
      ))}
    </>
  );
}
