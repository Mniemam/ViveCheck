import { Stack } from 'expo-router';
import { AppProvider } from '../src/context/AppContext';

export default function Layout() {
  return (
    <AppProvider>
      <Stack />
    </AppProvider>
  );
}
