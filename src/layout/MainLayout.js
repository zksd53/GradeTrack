import { ScrollView, StyleSheet } from "react-native";

export default function MainLayout({ children, dark }) {
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: dark ? "#0B1020" : "#F7F8FC" },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120, // bottom tab space
  },
});
