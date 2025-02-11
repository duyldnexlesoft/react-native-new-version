import { Provider } from "react-redux";
import store from "app/store/store";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";

if (process.env.NODE_ENV === "development") {
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({name: "React Native"})
    .useReactNative()
    .connect();
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </Provider>
  );
}
