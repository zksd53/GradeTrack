import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewSemesterSheet from "../components/NewSemesterSheet";
import { Alert } from "react-native";

/* ---------- Constants ---------- */

const TERM_ORDER = {
  Winter: 1,
  Summer: 2,
  Spring: 3,
  Fall: 4,
};

const STORAGE_KEY = "SEMESTERS";

/* ---------- Screen ---------- */

export default function SemestersScreen({ semesters, onOpenSemester, onAddSemester, }) {
  const [showNewSemester, setShowNewSemester] = useState(false);



  /* ---------- Add Semester ---------- */

  const handleAddSemester = (newSemester) => {
    onAddSemester(newSemester);
  };


  /* ---------- UI ---------- */

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!showNewSemester}
      >
        <Text style={styles.header}>Semesters</Text>

        <Pressable
          style={styles.addButton}
          onPress={() => setShowNewSemester(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addText}>Add New Semester</Text>
        </Pressable>

        {semesters.map((s) => (
          <SemesterCard
            key={s.id}
            gpa={s.gpa}
            title={`${s.term} ${s.year}`}
            courses={s.courses}
            credits={s.credits}
            status={s.status}
            current={s.current}
            onPress={() =>
              onOpenSemester({
                id: s.id,
                term: s.term,
                year: s.year,
              })
            }

          />
        ))}
      </ScrollView>

      <NewSemesterSheet
        visible={showNewSemester}
        onClose={() => setShowNewSemester(false)}
        onCreate={handleAddSemester}
      />

    </SafeAreaView>
  );
}

/* ---------- Semester Card ---------- */

function SemesterCard({
  gpa,
  title,
  courses,
  credits,
  status,
  current,
  onPress,
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.gpaCircle}>
        <Text style={styles.gpaText}>{gpa}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          {current && <Badge text="Current" />}
        </View>

        <Text style={styles.meta}>
          {courses} · {credits}
        </Text>

        <StatusBadge text={status} />
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9AA3B2" />
    </Pressable>
  );
}

/* ---------- Badges ---------- */

function Badge({ text }) {
  return (
    <View style={styles.currentBadge}>
      <Text style={styles.currentText}>{text}</Text>
    </View>
  );
}

function StatusBadge({ text }) {
  const isProgress = text === "In Progress";
  return (
    <View
      style={[
        styles.statusBadge,
        isProgress ? styles.progress : styles.completed,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          isProgress ? styles.progressText : styles.completedText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FC" },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 140 },

  header: { fontSize: 24, fontWeight: "700", marginBottom: 16 },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C6CF2",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 8,
  },
  addText: { color: "#FFF", fontSize: 15, fontWeight: "600" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  gpaCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 6,
    borderColor: "#E6B84C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  gpaText: { fontSize: 15, fontWeight: "700" },

  info: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 13, color: "#6B7280", marginVertical: 4 },

  currentBadge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentText: {
    fontSize: 11,
    color: "#4F46E5",
    fontWeight: "600",
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  progress: { backgroundColor: "#E0ECFF" },
  completed: { backgroundColor: "#E7F8ED" },
  statusText: { fontSize: 12, fontWeight: "600" },
  progressText: { color: "#2563EB" },
  completedText: { color: "#15803D" },
});
