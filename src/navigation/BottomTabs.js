import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";

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
    <Tab.Navigator>
      <Tab.Screen name="Home">
        {() => <Screen title="Home" />}
      </Tab.Screen>
      <Tab.Screen name="Semesters">
        {() => <Screen title="Semesters" />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {() => <Screen title="Settings" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
