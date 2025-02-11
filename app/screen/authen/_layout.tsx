import { Slot, Stack } from "expo-router";
import { View } from "react-native";
export default function ScreenLayout() {
  return (
    <>
      <View className="h-12 w-12 bg-red-400"></View>
      <Slot />
    </>
  );
}
