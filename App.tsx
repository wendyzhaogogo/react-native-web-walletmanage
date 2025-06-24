import 'react-native-get-random-values';
// Buffer polyfill for React Native
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { MainScreen } from "./src/screens/MainScreen";
import { CreateWalletScreen } from "./src/screens/CreateWalletScreen";
import { BackupWalletScreen } from "./src/screens/BackupWalletScreen";
import { ImportWalletScreen } from "./src/screens/ImportWalletScreen";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";

enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerStyle: {
                backgroundColor: "#6200ee",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ title: "钱包管理" }}
            />
            <Stack.Screen
              name="CreateWallet"
              component={CreateWalletScreen}
              options={{ title: "创建钱包" }}
            />
            <Stack.Screen
              name="BackupWallet"
              component={BackupWalletScreen}
              options={{ title: "备份验证" }}
            />
            <Stack.Screen
              name="ImportWallet"
              component={ImportWalletScreen}
              options={{ title: "导入钱包" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
