import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AIButton from './components/AIButton';
import AIChatPage from './components/AIChatPage';
import Options from './components/Options';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={AIButton} />
        <Stack.Screen name="AIChatPage" component={AIChatPage} />
        <Stack.Screen name="Options" component={Options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;