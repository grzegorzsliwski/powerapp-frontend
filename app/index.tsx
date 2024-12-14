import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";

const App = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text className="width-80p text-3xl font-bold text-white mt-7 text-center">
          Reach Your Peak Performace With {"\n"}
          Power App!
        </Text>
        <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
          Take Control Of Your Training!
        </Text>
        <CustomButton
          title="Continue with Email"
          handlePress={() => router.push("/sign-in")}
          containerStyle="w-90p mt-7"
        />
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default App;
