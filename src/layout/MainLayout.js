// src/layout/MainLayout.js
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function MainLayout({ children }) {
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#0B1020',
    },
    scroll: {
        padding: 16,
        paddingBottom: 120, // IMPORTANT: space for bottom tab bar
    },
});
