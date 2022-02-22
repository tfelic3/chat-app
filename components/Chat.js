import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import { MapView } from 'react-native-maps';
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
	constructor() {
		super();

		const firebaseConfig = {
			apiKey: 'AIzaSyAZvXIqgta_v5eXFRKnR1pjoIYRi4IGqb8',
			authDomain: 'test-9955f.firebaseapp.com',
			projectId: 'test-9955f',
			storageBucket: 'test-9955f.appspot.com',
			messagingSenderId: '416915161341',
			appId: '1:416915161341:web:9b106453243d65f4ddfe94',
		};

		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}

		this.referenceMessages = firebase.firestore().collection('messages');

		this.state = { messages: [], LoggedInText: 'Not logged in', uid: 0 };
	}

	async getMessages() {
		let messages = '';
		try {
			messages = (await AsyncStorage.getItem('messages')) || [];
			this.setState({
				messages: JSON.parse(messages),
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	componentDidMount() {
		//Check to see if user is off or online
		NetInfo.fetch().then((connection) => {
			if (connection.isConnected) {
				console.log('online');
			} else {
				console.log('offline');
			}
		});

		this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
			if (!user) {
				await firebase.auth().signInAnonymously();
			}

			this.getMessages();

			this.setState({
				uid: user.uid,
				messages: [],
			});

			this.referenceMessageUser = firebase
				.firestore()
				.collection('messages')
				.where('uid', '==', this.state.uid);

			this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(
				this.onCollectionUpdate
			);
		});

		this.setState({
			messages: [
				{
					_id: 2,
					text: this.props.route.params.name + ' has entered the chat',
					createdAt: new Date(),
					system: true,
				},
			],
		});
		this.unsubscribe = this.referenceMessages
			.orderBy('createdAt', 'desc')
			.onSnapshot(this.onCollectionUpdate);
	}

	componentWillUnmount() {
		this.authUnsubscribe();
		this.unsubscribeMessageUser();
		this.unsubscribe();
	}

	get user() {
		return {
			name: this.props.route.params.name,
			_id: this.state._id,
			id: this.state.uid,
		};
	}

	onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		// go through each document
		querySnapshot.forEach((doc) => {
			// get the QueryDocumentSnapshot's data
			var data = doc.data();
			messages.push({
				_id: data.id,
				text: data.text || '',
				createdAt: data.createdAt.toDate(),
				image: data.image || '',
				location: data.location || null,
				user: {
					user: data.user,
				},
			});
		});
	};

	renderCustomActions = (props) => {
		return <CustomActions {...props} />;
	};

	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#000',
					},
				}}
			/>
		);
	}

	addMessage = () => {
		this.referenceMessages.add({
			_id: this.state.messages[0]._id,
			text: this.state.messages[0].text,
			createdAt: this.state.messages[0].createdAt,
			user: this.state.messages[0].user,
			uid: this.state.uid,
			image: this.state.messages[0].image || '',
			location: this.state.messages[0].location || null,
		});
	};

	async saveMessages() {
		try {
			await AsyncStorage.setItem(
				'messages',
				JSON.stringify(this.state.messages)
			);
		} catch (error) {
			console.log(error.message);
		}
	}

	async deleteMessages() {
		try {
			await AsyncStorage.removeItem('messages');
			this.setState({
				messages: [],
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	onSend(messages = []) {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				this.addMessage();
				this.saveMessages();
			}
		);
	}

	renderCustomView(props) {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	}

	render() {
		let name = this.props.route.params.name;
		let color = this.props.route.params.color;

		this.props.navigation.setOptions({ title: name });

		return (
			<View style={{ height: '100%', width: '100%', backgroundColor: color }}>
				<Text>{this.state.isLoggedIn}</Text>
				<GiftedChat
					renderBubble={this.renderBubble.bind(this)}
					renderActions={this.renderCustomActions}
					messages={this.state.messages}
					renderCustomView={this.renderCustomView}
					onSend={(messages) => this.onSend(messages)}
					user={{ _id: 1 }}
				/>

				{Platform.OS === 'android' ? (
					<KeyboardAvoidingView behavior="height" />
				) : null}
			</View>
		);
	}
}
