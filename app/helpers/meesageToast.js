import Toast from "react-native-toast-message";

export const errorGraphQL = (error) => {
  const errorMessage = error.message || "Terjadi kesalahan";

  const graphQLErrors = error.graphQLErrors?.[0]?.message;
  const displayMessage = graphQLErrors || errorMessage;

  Toast.show({
    type: "error",
    position: "bottom",
    text1: displayMessage,
    visibilityTime: 2000,
  });
};

export const successToastMessage = (message) => {
  Toast.show({
    type: "success",
    position: "top",
    text1: message,
    visibilityTime: 2000,
  });
};
