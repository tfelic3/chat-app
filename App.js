import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import Chat from './components/Chat';
import Start from './components/Start';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	Alert,
	ScrollView,
} from 'react-native';

export default function App() {
	const Stack = createStackNavigator();

	return (
		<NavigationContainer style={styles.container}>
			<Stack.Navigator initialRouteName="Start">
				<Stack.Screen name="Start" component={Start} />
				<Stack.Screen name="Chat" component={Chat} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'none',
	},
});
