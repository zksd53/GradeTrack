import { View, Text, StyleSheet } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import MainLayout from "./src/layout/MainLayout";
import BottomTabBar from "./src/components/BottomTabBar";
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Grader is running ✅</Text>
      {/* <BottomTabBar/> */}
      <MainLayout />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
});
