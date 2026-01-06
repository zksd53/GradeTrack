import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import SemestersStack from "./SemestersStack";

const Tab = createBottomTabNavigator();

function Screen({ title }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22 }}>{title}</Text>
    </View>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home">
        {() => <Screen title="Home" />}
      </Tab.Screen>

      {/* ✅ THIS MUST BE A VALID COMPONENT */}
      <Tab.Screen
        name="Semesters"
        component={SemestersStack}
      />

      <Tab.Screen name="Settings">
        {() => <Screen title="Settings" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
