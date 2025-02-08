import { FlatList, Image, Modal, Pressable, Text, View } from "react-native";

export default function FollowModal({
  modalVisible,
  closeModal,
  data,
  modalTitle,
}) {
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View className="flex-1 justify-end  p-4">
        <View className="bg-white rounded-t-xl p-4">
          <Text className="text-lg font-semibold mb-2">{modalTitle}</Text>

          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View className="flex-row items-center py-2">
                <Image
                  className="w-[30] rounded-full h-[30] object-cover"
                  source={{
                    uri: `https://api.dicebear.com/9.x/avataaars/png?seed=${item?.username}`,
                  }}
                />
                <Text className="text-sm px-3">@{item.username}</Text>
              </View>
            )}
            keyExtractor={(item) => item.username}
          />

          <Pressable
            className="mt-4 bg-blue-500 p-2 rounded"
            onPress={closeModal}
          >
            <Text className="text-white text-center">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
