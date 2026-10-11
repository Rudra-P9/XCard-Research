import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useXCard } from '@/store/xcard-store';
import { useResponsive } from '@/hooks/use-responsive';
import { ResponsiveContainer } from '@/components/responsive-container';

interface InfoModalState {
  visible: boolean;
  title: string;
  subtitle: string;
  details: { label: string; value: string }[];
}

export default function SettingsScreen() {
  const { apiUrl, setApiUrl, checkServerHealth, serverOnline, checkingServer, isDarkMode, setDarkMode, theme } = useXCard();
  const { isDesktop, isSmallMobile } = useResponsive();

  const [localUrl, setLocalUrl] = useState(apiUrl);
  const [preferPoints, setPreferPoints] = useState(false);
  const [rotatingCategories, setRotatingCategories] = useState(true);
  const [highValueAlerts, setHighValueAlerts] = useState(true);
  const [pingResult, setPingResult] = useState<string | null>(null);

  // Detail Modal State for Navigable Rows
  const [modalState, setModalState] = useState<InfoModalState>({
    visible: false,
    title: '',
    subtitle: '',
    details: [],
  });

  const handleTestConnection = async () => {
    setApiUrl(localUrl);
    const start = Date.now();
    const isOnline = await checkServerHealth();
    const duration = Date.now() - start;

    if (isOnline) {
      setPingResult(`Connected in ${duration}ms (HTTP 200 OK)`);
      Alert.alert('Connection Successful', `Connected to XCard backend API at ${localUrl}`);
    } else {
      setPingResult(`Unreachable (${duration}ms timeout)`);
      Alert.alert(
        'Server Notice',
        `Could not reach ${localUrl}. The app will continue using the local recommendation rules engine.`
      );
    }
  };

  const openInfoModal = (type: string) => {
    switch (type) {
      case 'profile':
        setModalState({
          visible: true,
          title: 'Researcher Profile',
          subtitle: 'StoneCap Team Individual Research Portfolio',
          details: [
            { label: 'Name', value: 'Rudra Patel' },
            { label: 'Role', value: 'Lead Technology Researcher' },
            { label: 'Affiliation', value: 'StoneCap / University of South Carolina' },
            { label: 'Research Focus', value: 'Credit Card Reward Optimization Algorithms' },
          ],
        });
        break;
      case 'accounts':
        setModalState({
          visible: true,
          title: 'Connected Accounts',
          subtitle: 'Active financial institutions and card data',
          details: [
            { label: 'Chase Bank', value: '2 Cards Linked (Freedom Flex, Sapphire Preferred)' },
            { label: 'Capital One', value: '1 Card Linked (Savor Rewards)' },
            { label: 'Data Source', value: 'PostgreSQL Database (Supabase)' },
            { label: 'Sync Status', value: serverOnline ? 'Live Connection' : 'Cached Local Data' },
          ],
        });
        break;
      case 'privacy':
        setModalState({
          visible: true,
          title: 'Privacy Policy',
          subtitle: 'Data governance and handling rules',
          details: [
            { label: 'Data Storage', value: 'Local storage & Supabase PostgreSQL with RLS' },
            { label: 'Telemetry', value: 'Zero external telemetry or tracking scripts' },
            { label: 'Merchant Queries', value: 'Anonymized merchant name & amount evaluation' },
            { label: 'Authentication', value: 'Row Level Security protection on cards & rules' },
          ],
        });
        break;
      case 'security':
        setModalState({
          visible: true,
          title: 'Security Architecture',
          subtitle: 'Encryption and server safeguards',
          details: [
            { label: 'Row Level Security', value: 'Enabled on both cards and reward_rules tables' },
            { label: 'API Communication', value: 'Express TypeScript REST with strict JSON validation' },
            { label: 'Credentials', value: 'Secure environment variables (.env), no hardcoded keys' },
            { label: 'Input Sanitization', value: 'Parameterized SQL queries preventing injection' },
          ],
        });
        break;
      case 'prototype':
        setModalState({
          visible: true,
          title: 'XCard Research Prototype',
          subtitle: 'Milestone project specification',
          details: [
            { label: 'Version', value: '1.0.0 (Research Milestone)' },
            { label: 'Team', value: 'StoneCap Technology Evaluation' },
            { label: 'Purpose', value: 'Demonstrate full stack integration of selected technologies' },
            { label: 'Verified Endpoints', value: 'GET /, POST /recommend, GET /cards' },
          ],
        });
        break;
      case 'techstack':
        setModalState({
          visible: true,
          title: 'Technology Stack',
          subtitle: 'Full-stack technologies demonstrated',
          details: [
            { label: 'Mobile Client', value: 'React Native, Expo Router, TypeScript' },
            { label: 'Backend Server', value: 'Node.js, Express, TypeScript' },
            { label: 'Database', value: 'PostgreSQL hosted on Supabase' },
            { label: 'Testing Suite', value: 'Vitest automated test runner' },
          ],
        });
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.screenWrapper, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: isSmallMobile ? 40 : 56, paddingBottom: 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ResponsiveContainer>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.brandSubtitle, { color: theme.bronze }]}>CONFIGURATION</Text>
            <Text style={[styles.title, { color: theme.textPrimary }, isSmallMobile && { fontSize: 24 }]}>
              Settings
            </Text>
          </View>

          {/* Responsive Layout */}
          <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
            {/* Left Column: Appearance & Preferences & Server */}
            <View style={[styles.column, isDesktop && styles.columnLeft]}>
              {/* Appearance Section */}
              <Text style={[styles.sectionTitle, { color: theme.bronze }]}>APPEARANCE</Text>
              <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.settingRow}>
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Dark Mode</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                      {isDarkMode ? 'Using luxury dark bronze theme' : 'Using warm light neutral theme'}
                    </Text>
                  </View>
                  <Switch
                    value={isDarkMode}
                    onValueChange={(val) => setDarkMode(val)}
                    trackColor={{ false: theme.border, true: theme.bronze }}
                    thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              </View>

              {/* Preferences Section */}
              <Text style={[styles.sectionTitle, { color: theme.bronze }]}>PREFERENCES</Text>
              <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.settingRow}>
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Reward Type Preference</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                      {preferPoints ? 'Points Preferred (1.5x Multiplier)' : 'Cash Back Preferred (Direct $)'}
                    </Text>
                  </View>
                  <Switch
                    value={preferPoints}
                    onValueChange={setPreferPoints}
                    trackColor={{ false: theme.border, true: theme.bronze }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

                <View style={styles.settingRow}>
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Quarterly Category Rotation</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                      Track Chase Freedom Flex 5% quarterly rotating categories
                    </Text>
                  </View>
                  <Switch
                    value={rotatingCategories}
                    onValueChange={setRotatingCategories}
                    trackColor={{ false: theme.border, true: theme.bronze }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

                <View style={styles.settingRow}>
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Suboptimal Purchase Alerts</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                      Highlight purchases where missed rewards exceed $1.00
                    </Text>
                  </View>
                  <Switch
                    value={highValueAlerts}
                    onValueChange={setHighValueAlerts}
                    trackColor={{ false: theme.border, true: theme.bronze }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* Backend Server Configuration */}
              <Text style={[styles.sectionTitle, { color: theme.bronze }]}>BACKEND SERVER & DATABASE</Text>
              <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.statusRow}>
                  <View style={{ flexShrink: 1, paddingRight: 8 }}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>API Connection</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>Express API + PostgreSQL (Supabase)</Text>
                  </View>
                  <View style={[styles.statusBadge, serverOnline ? styles.statusOnline : styles.statusOffline]}>
                    <Text style={[styles.statusText, serverOnline ? styles.textOnline : styles.textOffline]}>
                      {serverOnline ? 'CONNECTED' : 'OFFLINE MODE'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Backend Base URL</Text>
                <TextInput
                  value={localUrl}
                  onChangeText={setLocalUrl}
                  placeholder="http://localhost:3000"
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {pingResult && <Text style={[styles.pingText, { color: theme.textSecondary }]}>{pingResult}</Text>}

                <Pressable
                  style={({ pressed }) => [
                    styles.testButton,
                    { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
                    pressed && styles.pressed,
                  ]}
                  onPress={handleTestConnection}
                  disabled={checkingServer}
                >
                  <Text style={[styles.testButtonText, { color: theme.bronze }]}>
                    {checkingServer ? 'Testing Server...' : 'Test Connection'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Right Column: Account, Privacy & Security, About */}
            <View style={[styles.column, isDesktop && styles.columnRight]}>
              {/* Account Section */}
              <Text style={[styles.sectionTitle, { color: theme.bronze }]}>ACCOUNT</Text>
              <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Pressable
                  style={({ pressed }) => [styles.navRow, pressed && styles.pressed]}
                  onPress={() => openInfoModal('profile')}
                >
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Profile</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>Rudra Patel • Lead Researcher</Text>
                  </View>
                  <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
                </Pressable>

                <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

                <Pressable
                  style={({ pressed }) => [styles.navRow, pressed && styles.pressed]}
                  onPress={() => openInfoModal('accounts')}
                >
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Connected Accounts</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>Chase, Capital One (3 active cards)</Text>
                  </View>
                  <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
                </Pressable>
              </View>

              {/* Privacy & Security Section */}
              <Text style={[styles.sectionTitle, { color: theme.bronze }]}>PRIVACY & SECURITY</Text>
              <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Pressable
                  style={({ pressed }) => [styles.navRow, pressed && styles.pressed]}
                  onPress={() => openInfoModal('privacy')}
                >
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Privacy</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>Data storage & anonymous evaluation</Text>
                  </View>
                  <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
                </Pressable>

                <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

                <Pressable
                  style={({ pressed }) => [styles.navRow, pressed && styles.pressed]}
                  onPress={() => openInfoModal('security')}
                >
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Security</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>Row Level Security & HTTPS safeguards</Text>
                  </View>
                  <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
                </Pressable>
              </View>

              {/* About Section */}
              <Text style={[styles.sectionTitle, { color: theme.bronze }]}>ABOUT</Text>
              <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Pressable
                  style={({ pressed }) => [styles.navRow, pressed && styles.pressed]}
                  onPress={() => openInfoModal('prototype')}
                >
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>XCard Research Prototype</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>Version 1.0.0 • StoneCap Milestone</Text>
                  </View>
                  <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
                </Pressable>

                <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

                <Pressable
                  style={({ pressed }) => [styles.navRow, pressed && styles.pressed]}
                  onPress={() => openInfoModal('techstack')}
                >
                  <View style={styles.settingTexts}>
                    <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Technology Stack</Text>
                    <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                      React Native, Expo, TypeScript, Express, PostgreSQL
                    </Text>
                  </View>
                  <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ResponsiveContainer>
      </ScrollView>

      {/* Navigable Row Detail Modal */}
      <Modal visible={modalState.visible} transparent animationType={isDesktop ? 'fade' : 'slide'}>
        <View style={[styles.modalOverlay, isDesktop && styles.modalOverlayDesktop]}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.surface, borderColor: theme.border },
              isDesktop && styles.modalContentDesktop,
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{modalState.title}</Text>
            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>{modalState.subtitle}</Text>

            <View style={styles.modalDetailsList}>
              {modalState.details.map((d) => (
                <View
                  key={d.label}
                  style={[
                    styles.modalDetailItem,
                    { backgroundColor: theme.surfaceSecondary, borderColor: theme.borderLight },
                  ]}
                >
                  <Text style={[styles.modalDetailLabel, { color: theme.bronze }]}>{d.label}</Text>
                  <Text style={[styles.modalDetailValue, { color: theme.textPrimary }]}>{d.value}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={[styles.modalCloseButton, { backgroundColor: theme.bronze }]}
              onPress={() => setModalState({ ...modalState, visible: false })}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    width: '100%',
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  mainLayout: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  column: {
    width: '100%',
  },
  columnLeft: {
    flex: 1.1,
  },
  columnRight: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 14,
  },
  settingsGroup: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    width: '100%',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingTexts: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusOnline: {
    backgroundColor: '#142A19',
  },
  statusOffline: {
    backgroundColor: '#2A1F14',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textOnline: {
    color: '#4ECA77',
  },
  textOffline: {
    color: '#E5A93C',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 8,
    width: '100%',
  },
  pingText: {
    fontSize: 12,
    marginBottom: 10,
  },
  testButton: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  testButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalOverlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    width: '100%',
  },
  modalContentDesktop: {
    maxWidth: 500,
    borderRadius: 24,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    marginBottom: 20,
  },
  modalDetailsList: {
    gap: 10,
    marginBottom: 20,
  },
  modalDetailItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  modalDetailLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalDetailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalCloseButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#0B0A08',
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.8,
  },
});
