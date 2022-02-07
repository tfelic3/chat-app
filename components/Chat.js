import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
	constructor() {
		super();

		const firebaseConfig = {
			apiKey: 'AIzaSyAkzOxFYnQM5oUTB-aBm_NQdHmmw9JKAWs',
			authDomain: 'test-af2eb.firebaseapp.com',
			projectId: 'test-af2eb',
			storageBucket: 'test-af2eb.appspot.com',
			messagingSenderId: '576102253398',
			appId: '1:576102253398:web:0f77bd9e9d477569f70cf7',
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
				user: {
					user: data.user,
				},
			});
		});
	};

	renderInputToolbar = (props) => {
		if (this.state.isConnected === false) {
		  return <InputToolbar {...props} />;
		}
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

	render() {
		let name = this.props.route.params.name;
		let color = this.props.route.params.color;

		this.props.navigation.setOptions({ title: name });

		return (
			<View style={{ height: '100%', width: '100%', backgroundColor: color }}>
				<Text>{this.state.isLoggedIn}</Text>
				<GiftedChat
					renderBubble={this.renderBubble.bind(this)}
					renderInputToolbar={this.renderInputToolbar}
					messages={this.state.messages}
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
