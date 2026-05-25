import { ActivityIndicator, View } from "react-native";

import { APP_ACCENT_COLOR } from "../shared/constants";

export const Loading = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator color={APP_ACCENT_COLOR} />
      
    </View>
  );
};
