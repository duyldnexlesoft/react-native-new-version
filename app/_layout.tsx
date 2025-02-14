import { Provider } from 'react-redux';
import store from 'app/store/store';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from "@sentry/react-native";
import '../global.css';
import 'locales/i18next';
import { useEffect } from 'react';
import ErrorBoundary from './errors/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Dimensions, StatusBar } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
let deviceHeight = Dimensions.get('screen').height;
let windowHeight = Dimensions.get('window').height;

if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

if (process.env.NODE_ENV === 'development') {
  Reactotron.setAsyncStorageHandler(AsyncStorage).configure({ name: 'React Native' }).useReactNative().connect();
}

export default function RootLayout() {
  const navHeight = deviceHeight - windowHeight - (StatusBar.currentHeight || 0);
  useEffect(() => {
    Sentry.captureMessage('App Started! 🚀');
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView
          style={{
            flex: 1,
            paddingBottom: navHeight > 20 ? navHeight : 0,
            backgroundColor: 'black',
          }}
        >
          <ErrorBoundary>
            <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}>
              <Stack screenOptions={{ headerShown: false }} />
            </StripeProvider>
          </ErrorBoundary>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
}
