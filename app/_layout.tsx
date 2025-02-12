import { Provider } from "react-redux";
import store from "app/store/store";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import "../global.css";
import "locales/i18next";
import { useEffect } from "react";
import ErrorBoundary from "./errors/ErrorBoundary";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    enableAppHangTracking: false,
  });
}

if (process.env.NODE_ENV === "development") {
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({ name: "React Native" })
    .useReactNative()
    .connect();
}

export default function RootLayout() {
  useEffect(() => {
    Sentry.captureMessage("App Started! 🚀");
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Stack screenOptions={{ headerShown: false }} />
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
}
