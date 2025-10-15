import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import ReportScreen from './src/screens/ReportScreen';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Tab.Navigator>
      {!isLoggedIn && <Tab.Screen name="Login" component={LoginScreen} />}
      {isLoggedIn && <Tab.Screen name="Reporte" component={ReportScreen} />}
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </AuthProvider>
  );
}
