import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useMemo, useState } from "react";
import { ThemeContext } from "../theme";
import { auth, functions } from "../firebase";
import { httpsCallable } from "firebase/functions";

export default function SettingsScreen({
  semesters = [],
  user,
  billing,
  onClearAll,
  onSignOut,
}) {
  const { darkMode, setDarkMode, theme } = useContext(ThemeContext);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(null);
  const displayName =
    user?.displayName?.trim() ||
    (user?.email ? user.email.split("@")[0] : "GradeTrack User");
  const displayEmail = user?.email || "Not signed in";
  const avatarLetter = displayName ? displayName[0]?.toUpperCase() : "G";
  const planLabel = (() => {
    if (billing?.status === "active") {
      if (billing.plan === "monthly") return "Pro (Monthly)";
      if (billing.plan === "4month") return "Pro (4-Month)";
      return "Pro";
    }
    return "Free";
  })();
  const planStatus = billing?.status === "active" ? "Active" : "Free";

  const handleUpgrade = async (plan) => {
    if (!auth.currentUser) {
      Alert.alert("Sign in required", "Please sign in to upgrade.");
      return;
    }
    try {
      setUpgradeLoading(plan);
      const createCheckoutSession = httpsCallable(
        functions,
        "createCheckoutSession"
      );
      const response = await Promise.race([
        createCheckoutSession({ plan }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Request timed out. Please try again.")),
            12000
          )
        ),
      ]);
      const url = response?.data?.url;
      if (!url) {
        Alert.alert("Error", "Unable to start checkout.");
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", error?.message || "Checkout failed.");
    } finally {
      setUpgradeLoading(null);
    }
  };

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
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>

          <View>
            <Text style={[styles.name, { color: theme.text }]}>
              {displayName}
            </Text>
            <Text style={[styles.email, { color: theme.muted }]}>
              {displayEmail}
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

        <Section title="PLANS" theme={theme}>
          <View style={[styles.currentPlan, { backgroundColor: theme.card }]}>
            <View>
              <Text style={[styles.currentPlanLabel, { color: theme.muted }]}>
                Current Plan
              </Text>
              <Text style={[styles.currentPlanValue, { color: theme.text }]}>
                {planLabel}
              </Text>
            </View>
            <View style={[styles.planStatus, { backgroundColor: theme.cardAlt }]}>
              <Text style={[styles.planStatusText, { color: theme.muted }]}>
                {planStatus}
              </Text>
            </View>
          </View>
          <Row
            icon="pricetag-outline"
            title="Our Plans"
            theme={theme}
            onPress={() => setShowPlans((prev) => !prev)}
            right={
              <Ionicons
                name={showPlans ? "chevron-up" : "chevron-down"}
                size={18}
                color={theme.muted}
              />
            }
            last={!showPlans}
          />
          {showPlans && (
            <View style={styles.planGrid}>
            <View style={[styles.planCard, { backgroundColor: theme.card }]}>
                <View style={styles.planHeader}>
                  <Text style={[styles.planTitle, { color: theme.text }]}>
                    Free
                  </Text>
                  <View
                    style={[
                      styles.planTag,
                      { borderColor: theme.border, backgroundColor: theme.cardAlt },
                    ]}
                  >
                    <Text style={[styles.planTagText, { color: theme.muted }]}>
                      Your basic plan
                    </Text>
                  </View>
                </View>
                <Text style={[styles.planPrice, { color: theme.text }]}>
                  $0
                  <Text style={[styles.planPeriod, { color: theme.muted }]}>
                    /forever
                  </Text>
                </Text>
                <View style={styles.planList}>
                  <PlanItem
                    text="Up to 3 semesters"
                    theme={theme}
                    included
                  />
                  <PlanItem
                    text="Limited analytics"
                    theme={theme}
                    included
                  />
                  <PlanItem
                    text="Normal email support"
                    theme={theme}
                    included
                  />
                </View>
              </View>

            <View style={[styles.planCard, { backgroundColor: theme.card }]}>
              <View style={styles.planHeader}>
                <Text style={[styles.planTitle, { color: theme.text }]}>Pro</Text>
                <Pressable
                  style={[
                    styles.planButton,
                    { backgroundColor: theme.accent },
                  ]}
                  onPress={() => handleUpgrade("monthly")}
                  disabled={upgradeLoading === "monthly"}
                >
                  <Text style={styles.planButtonText}>
                    {upgradeLoading === "monthly"
                      ? "Loading..."
                      : "Upgrade to Pro"}
                  </Text>
                </Pressable>
              </View>
              <Text style={[styles.planPrice, { color: theme.text }]}>
                $2.99
                <Text style={[styles.planPeriod, { color: theme.muted }]}>
                    /month
                  </Text>
                </Text>
                <View style={styles.planList}>
                  <PlanItem
                    text="Unlimited semesters"
                    theme={theme}
                    included
                  />
                  <PlanItem
                    text="Full analytics access"
                    theme={theme}
                    included
                  />
                  <PlanItem
                    text="Priority email support"
                    theme={theme}
                    included
                  />
                </View>
              </View>

            <View style={[styles.planCard, { backgroundColor: theme.card }]}>
              <View style={styles.planHeader}>
                <Text style={[styles.planTitle, { color: theme.text }]}>
                  4-Month
                </Text>
                <View style={styles.planHeaderRight}>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveBadgeText}>Save 20%+</Text>
                  </View>
                  <Pressable
                    style={[
                      styles.planButton,
                      { backgroundColor: theme.accent },
                    ]}
                    onPress={() => handleUpgrade("4month")}
                    disabled={upgradeLoading === "4month"}
                  >
                    <Text style={styles.planButtonText}>
                      {upgradeLoading === "4month"
                        ? "Loading..."
                        : "Upgrade to Pro"}
                    </Text>
                  </Pressable>
                </View>
              </View>
              <Text style={[styles.planPrice, { color: theme.text }]}>
                $9.49
                <Text style={[styles.planPeriod, { color: theme.muted }]}>
                    /4 months
                  </Text>
                </Text>
                <View style={styles.planList}>
                  <PlanItem
                    text="Unlimited semesters"
                    theme={theme}
                    included
                  />
                  <PlanItem
                    text="Full analytics access"
                    theme={theme}
                    included
                  />
                  <PlanItem
                    text="Priority email support"
                    theme={theme}
                    included
                  />
                </View>
              </View>
            </View>
          )}
        </Section>

        <Section title="DATA" theme={theme}>
          <Row
            icon="trash-outline"
            title="Clear All Data"
            subtitle="Delete all semesters, courses, and assessments"
            danger
            theme={theme}
            last
            onPress={() => setShowClearConfirm(true)}
          />
        </Section>

        <Section title="ACCOUNT" theme={theme}>
          <Row
            icon="help-circle-outline"
            title="Help & Support"
            theme={theme}
            onPress={() => setShowHelp((prev) => !prev)}
            right={
              <Ionicons
                name={showHelp ? "chevron-up" : "chevron-down"}
                size={18}
                color={theme.muted}
              />
            }
          />
          {showHelp && (
            <View style={[styles.expandCard, { backgroundColor: theme.cardAlt }]}>
              <Text style={[styles.expandTitle, { color: theme.text }]}>
                Contact Support
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                If you need help or have questions about GradeTrack, you can
                contact us anytime.
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                Email: support@gradetrack.app
              </Text>

              <Text style={[styles.expandTitle, { color: theme.text }]}>
                FAQs
              </Text>
              <Text style={[styles.expandLabel, { color: theme.text }]}>
                How is GPA calculated?
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                GradeTrack calculates GPA based on the grading scale you select
                and the weight of each assessment.
              </Text>
              <Text style={[styles.expandLabel, { color: theme.text }]}>
                Can I edit my grades later?
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                Yes. You can edit or delete semesters, courses, assessments, and
                grades at any time.
              </Text>
              <Text style={[styles.expandLabel, { color: theme.text }]}>
                Is my data stored locally or synced?
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                Your academic data is stored locally on your device. If Sync is
                enabled, your data is securely synced to your account.
              </Text>
              <Text style={[styles.expandLabel, { color: theme.text }]}>
                What happens if I delete the app?
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                If Sync is disabled, deleting the app removes all local data. If
                Sync is enabled, your data can be restored by signing in again.
              </Text>

              <Text style={[styles.expandTitle, { color: theme.text }]}>
                Report a Bug
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                Found an issue or want to share feedback?
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                Email: support@gradetrack.app
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                Subject: Bug Report - GradeTrack
              </Text>
            </View>
          )}
          <Row
            icon="shield-outline"
            title="Privacy"
            subtitle="See how your data is handled"
            theme={theme}
            onPress={() => setShowPrivacy((prev) => !prev)}
            right={
              <Ionicons
                name={showPrivacy ? "chevron-up" : "chevron-down"}
                size={18}
                color={theme.muted}
              />
            }
          />
          {showPrivacy && (
            <View style={[styles.expandCard, { backgroundColor: theme.cardAlt }]}>
              <Text style={[styles.expandTitle, { color: theme.text }]}>
                Privacy Policy
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                Your privacy matters to us. GradeTrack is designed to give you
                full control over your data.
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                You can view our full Privacy Policy at:
              </Text>
              <Pressable
                style={[styles.linkButton, { backgroundColor: theme.card }]}
                onPress={() =>
                  Linking.openURL(
                    "https://github.com/zksd53/Grader-info/blob/main/README.md"
                  )
                }
              >
                <Ionicons name="link-outline" size={16} color={theme.accent} />
                <Text style={[styles.linkButtonText, { color: theme.accent }]}>
                  Open Privacy Policy
                </Text>
              </Pressable>

              <Text style={[styles.expandTitle, { color: theme.text }]}>
                Data Usage
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                GradeTrack collects only the data required to provide GPA
                calculation and academic tracking features.
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                Your academic data is stored locally on your device. If Sync is
                enabled, your data is securely stored and linked to your account.
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                We do not sell, share, or use your data for advertising.
              </Text>

              <Text style={[styles.expandTitle, { color: theme.text }]}>
                Delete Data / Delete Account
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                You can delete all your academic data at any time using the
                \"Clear All Data\" option in the app.
              </Text>
              <Text style={[styles.expandText, { color: theme.muted }]}>
                To request account deletion and removal of all associated data,
                please contact: support@gradetrack.app
              </Text>
            </View>
          )}
          <Row
            icon="log-out-outline"
            title="Sign Out"
            theme={theme}
            onPress={onSignOut}
            last
          />
        </Section>

      </ScrollView>
      <ConfirmModal
        visible={showClearConfirm}
        theme={theme}
        onCancel={() => setShowClearConfirm(false)}
        onDelete={() => {
          setShowClearConfirm(false);
          if (onClearAll) onClearAll();
        }}
      />
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

function ConfirmModal({ visible, theme, onCancel, onDelete }) {
  if (!visible) return null;
  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modal, { backgroundColor: theme.card }]}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>
          Delete all data?
        </Text>
        <Text style={[styles.modalText, { color: theme.muted }]}>
          This will permanently delete all semesters, courses, and assessments.
          This action cannot be undone.
        </Text>
        <Pressable
          style={[styles.modalDelete, { backgroundColor: theme.danger }]}
          onPress={onDelete}
        >
          <Text style={styles.modalDeleteText}>Delete</Text>
        </Pressable>
        <Pressable
          style={[styles.modalCancel, { borderColor: theme.border }]}
          onPress={onCancel}
        >
          <Text style={[styles.modalCancelText, { color: theme.text }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ icon, title, subtitle, right, danger, theme, last, onPress }) {
  const iconColor = danger ? theme.danger : theme.accent;
  const iconBg = danger ? theme.dangerBg : theme.cardAlt;
  return (
    <Pressable
      style={[
        styles.row,
        { borderBottomColor: theme.border },
        last && styles.rowLast,
      ]}
      onPress={onPress}
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

function PlanItem({ text, theme, included }) {
  const icon = included ? "checkmark-circle" : "close-circle";
  const color = included ? theme.success : theme.danger;
  return (
    <View style={styles.planItem}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.planItemText, { color: theme.muted }]}>{text}</Text>
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  modalDelete: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  modalDeleteText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  modalCancel: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  privacyCard: {
    padding: 16,
  },
  privacyTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  privacyNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },
  expandCard: {
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  expandTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 6,
  },
  expandLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  expandText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  linkButton: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  linkButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  planGrid: {
    gap: 12,
  },
  planCard: {
    borderRadius: 16,
    padding: 16,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 6,
  },
  planHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  planPeriod: {
    fontSize: 13,
    fontWeight: "500",
  },
  planList: {
    gap: 8,
  },
  planItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planItemText: {
    fontSize: 12,
  },
  planTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  planTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  planButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  planButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  saveBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F56BB8",
  },
  saveBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  currentPlan: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currentPlanLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  currentPlanValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  planStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  planStatusText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
