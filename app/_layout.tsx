import { Slot } from 'expo-router';
import { AppProvider } from '../src/context/AppContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import BottomNavBar from '../src/components/BottomNavBar';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <AuthProvider>
      <AppProvider>
        <Content />
      </AppProvider>
    </AuthProvider>
  );
}

function Content() {
  const { token } = useAuth();
  if (!token) {
    return <LoginScreen />;
  }
  return (
    <SafeAreaView style={styles.wrapper}>
      <Slot />
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 60, // space for BottomNavBar height
  },
});
