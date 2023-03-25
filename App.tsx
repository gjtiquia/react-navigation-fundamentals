import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from '@react-navigation/native-stack';

import {
  adaptNavigationTheme,
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';

import merge from 'deepmerge';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3DarkTheme, LightTheme);
const CombinedDarkTheme = merge(MD3LightTheme, DarkTheme);

type RootStackParamList = {
  Home: undefined; // undefined => optional route.params
  Details: { itemId: any, otherParam?: any };
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ route, navigation }: HomeScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here'
          });
        }}
      />
    </View>
  );
}

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

function DetailsScreen({ route, navigation }: DetailsScreenProps) {
  /* 2. Get the param */
  const { itemId, otherParam } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"

        // navigation.navigate('Details') will do nothing as we are already in the Details screen
        // using navigation.push('Details') will allow us to add a new route to the navigation stack
        onPress={() => navigation.push('Details', { itemId: Math.floor(Math.random() * 100) })}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <NavigationContainer theme={CombinedDarkTheme}>
        <StatusBar style='auto'></StatusBar>

        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Overview',
              headerRight: () => (
                <Button
                  onPress={() => alert('This is a button!')}
                  title="Info"
                />
              )
            }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            initialParams={{ itemId: 42 }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;