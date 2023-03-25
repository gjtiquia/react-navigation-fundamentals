import * as React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
  NativeStackHeaderProps
} from '@react-navigation/native-stack';

import { getHeaderTitle } from '@react-navigation/elements';

import {
  Text,
  Button,
  Appbar,
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

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

type RootStackParamList = {
  Home: undefined; // undefined => optional route.params
  Details: { itemId: any, otherParam?: any };
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ route, navigation }: HomeScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <Text variant="bodyMedium">Home Screen</Text>
      <Button mode="contained"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here'
          });
        }}
      >
        Go to Details
      </Button>
    </View>
  );
}

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

function DetailsScreen({ route, navigation }: DetailsScreenProps) {
  /* 2. Get the param */
  const { itemId, otherParam } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <Text variant="bodyMedium">Details Screen</Text>
      <Text variant="bodyMedium">itemId: {JSON.stringify(itemId)}</Text>
      <Text variant="bodyMedium">otherParam: {JSON.stringify(otherParam)}</Text>
      <Button mode="contained"
        // navigation.navigate('Details') will do nothing as we are already in the Details screen
        // using navigation.push('Details') will allow us to add a new route to the navigation stack
        onPress={() => navigation.push('Details', { itemId: Math.floor(Math.random() * 100) })}
      >
        Go to Details... again
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Home')} >Go to Home</Button>
      <Button mode="contained" onPress={() => navigation.goBack()} >Go back</Button>
      <Button mode="contained" onPress={() => navigation.popToTop()}>Go back to first screen in stack</Button>
    </View>
  );
}

function CustomNavigationBar(props: NativeStackHeaderProps) {
  const title = getHeaderTitle(props.options, props.route.name);

  return (
    <Appbar.Header elevated={true}>
      {props.back ? <Appbar.BackAction onPress={props.navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <NavigationContainer theme={CombinedDarkTheme}>
        <StatusBar style='auto'></StatusBar>

        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: (props) => <CustomNavigationBar {...props} />,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Overview',
              headerRight: () => (
                <Button mode="contained" onPress={() => alert('This is a button!')}>Info</Button>
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