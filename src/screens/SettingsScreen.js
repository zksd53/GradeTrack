import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Settings</Text>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Z</Text>
        </View>

        <View>
          <Text style={styles.name}>Zaki Saud</Text>
          <Text style={styles.email}>zakisaud2023@gmail.com</Text>

          <View style={styles.badge}>
            <Ionicons name="school-outline" size={14} color="#6C7CFF" />
            <Text style={styles.badgeText}>GradeTrack User</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat value="3" label="Semesters" />
        <Stat value="5" label="Courses" />
        <Stat value="19" label="Assessments" />
      </View>

      {/* Appearance */}
      <Section title="APPEARANCE">
        <Row
          icon="sunny-outline"
          title="Dark Mode"
          subtitle="Toggle dark theme"
          right={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          }
        />
      </Section>

      {/* Data */}
      <Section title="DATA">
        <Row
          icon="sync-outline"
          title="Sync Data"
          subtitle="Data syncs automatically"
        />
        <Row
          icon="trash-outline"
          title="Clear All Data"
          subtitle="Delete all semesters, courses, and assessments"
          danger
        />
      </Section>

      {/* Account */}
      <Section title="ACCOUNT">
        <Row icon="help-circle-outline" title="Help & Support" />
        <Row icon="shield-outline" title="Privacy" />
        <Row icon="log-out-outline" title="Sign Out" />
      </Section>
    </View>
  );
}

/* ---------- Small Components ---------- */

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({ icon, title, subtitle, right, danger }) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? "#E5484D" : "#6C7CFF"}
        />
        <View>
          <Text style={[styles.rowTitle, danger && { color: "#E5484D" }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.rowSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>

      {right ? right : <Ionicons name="chevron-forward" size={18} color="#9AA3B2" />}
    </Pressable>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F7F8FC",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6C7CFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    fontSize: 13,
    color: "#6B7280",
    marginVertical: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  badgeText: {
    marginLeft: 4,
    color: "#6C7CFF",
    fontSize: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F5",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
});
