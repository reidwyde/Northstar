import App from './app';
export default App;

// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Drawer } from 'expo-router/drawer';
// import {
//   // DrawerScreenProps,
//   createDrawerNavigator,
// } from '@react-navigation/drawer';
//
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';
//
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// type DrawerParamList = Record<string, { questIdx: number }>;
// const Drawer = createDrawerNavigator<DrawerParamList>();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });
//
//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);
//
//   if (!loaded) {
//     return null;
//   }
//
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }
//
// export default function Layout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer>
//         <Drawer.Screen
//           name="index" // This is the name of the page and must match the url from root
//           options={{
//             drawerLabel: 'Home',
//             title: 'overview',
//           }}
//         />
//         <Drawer.Screen
//           name="user/[id]" // This is the name of the page and must match the url from root
//           options={{
//             drawerLabel: 'User',
//             title: 'overview',
//           }}
//         />
//       </Drawer>
//     </GestureHandlerRootView>
//   );
// }
