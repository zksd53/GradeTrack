import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useMemo } from "react";
import { ThemeContext } from "../theme";

export default function SettingsScreen({ semesters = [] }) {
  const { darkMode, setDarkMode, theme } = useContext(ThemeContext);

  const stats = useMemo(() => {
    const semestersCount = semesters.length;
    const courses = semesters.flatMap((s) =>
      Array.isArray(s.courses) ? s.courses : []
    );
    const coursesCount = courses.length;
    const assessmentsCount = courses.reduce((sum, course) => {
      const assessments = Array.isArray(course.assessments)
        ? course.assessments
        : [];
      return sum + assessments.length;
    }, 0);
    return { semestersCount, coursesCount, assessmentsCount };
  }, [semesters]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

        <View style={[styles.card, { backgroundColor: theme.card }]}> 
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}> 
            <Text style={styles.avatarText}>Z</Text>
          </View>

          <View>
            <Text style={[styles.name, { color: theme.text }]}>Zaki Saud</Text>
            <Text style={[styles.email, { color: theme.muted }]}> 
              zakisaud2023@gmail.com
            </Text>

            <View style={styles.badge}>
              <Ionicons name="school-outline" size={14} color={theme.accent} />
              <Text style={[styles.badgeText, { color: theme.accent }]}>
                GradeTrack User
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat value={stats.semestersCount} label="Semesters" theme={theme} />
          <Stat value={stats.coursesCount} label="Courses" theme={theme} />
          <Stat
            value={stats.assessmentsCount}
            label="Assessments"
            theme={theme}
          />
        </View>

        <Section title="APPEARANCE" theme={theme}>
          <Row
            icon="sunny-outline"
            title="Dark Mode"
            subtitle="Toggle dark theme"
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{
                  false: theme.cardAlt,
                  true: theme.accent,
                }}
                thumbColor="#FFFFFF"
              />
            }
            theme={theme}
            last
          />
        </Section>

        <Section title="DATA" theme={theme}>
          <Row
            icon="sync-outline"
            title="Sync Data"
            subtitle="Data syncs automatically"
            theme={theme}
          />
          <Row
            icon="trash-outline"
            title="Clear All Data"
            subtitle="Delete all semesters, courses, and assessments"
            danger
            theme={theme}
            last
          />
        </Section>

        <Section title="ACCOUNT" theme={theme}>
          <Row
            icon="help-circle-outline"
            title="Help & Support"
            theme={theme}
          />
          <Row icon="shield-outline" title="Privacy" theme={theme} />
          <Row icon="log-out-outline" title="Sign Out" theme={theme} last />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children, theme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>{title}</Text>
      <View
        style={[styles.sectionCard, { backgroundColor: theme.card }]}
      >
        {children}
      </View>
    </View>
  );
}

function Row({ icon, title, subtitle, right, danger, theme, last }) {
  const iconColor = danger ? theme.danger : theme.accent;
  const iconBg = danger ? theme.dangerBg : theme.cardAlt;
  return (
    <Pressable
      style={[
        styles.row,
        { borderBottomColor: theme.border },
        last && styles.rowLast,
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, { backgroundColor: iconBg }]}> 
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <View>
          <Text
            style={[
              styles.rowTitle,
              { color: danger ? theme.danger : theme.text },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.rowSubtitle, { color: theme.muted }]}> 
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {right ? right : (
        <Ionicons name="chevron-forward" size={18} color={theme.muted} />
      )}
    </Pressable>
  );
}

function Stat({ value, label, theme }) {
  return (
    <View style={[styles.stat, { backgroundColor: theme.card }]}> 
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 140,
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },

  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    marginVertical: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  stat: {
    flex: 1,
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
    marginTop: 4,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
