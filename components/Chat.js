import React, { Component } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let name = this.props.route.params.name;

		this.props.navigation.setOptions({ title: name });

		return (
			<View>
				<Text>Welcome {name}</Text>
			</View>
		);
	}
}
