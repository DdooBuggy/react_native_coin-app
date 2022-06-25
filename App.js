import AppLoading from "expo-app-loading";
import React from "react";
import * as Font from "expo-font";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAssets } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "react-query";
import StackNav from "./navs/Stack";

const client = new QueryClient();

export default function App() {
  const [assets] = useAssets([require("./assets/crypto.png")]);
  const [fonts] = Font.useFonts(FontAwesome5.font);
  if (!assets || !fonts) {
    return <AppLoading />;
  }
  return (
    <QueryClientProvider client={client}>
      <NavigationContainer>
        <StackNav />
        <StatusBar style={"light"} />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
