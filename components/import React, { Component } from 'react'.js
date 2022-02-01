import React, { Component } from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
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

	componentDidMount() {
		this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
			if (!user) {
				await firebase.auth().signInAnonymously();
			}

			this.setState({
				uid: user.uid,
				loggedInText: 'Hello there!',
				messages: [
					{
						_id: 1,
						text: 'Hello Developer',
						createdAt: new Date(),
						user: {
							_id: 2,
							name: 'React Native',
							avatar: 'https://placeimg.com/140/140/any',
						},
					},
					{
						_id: 2,
						text: 'Welcome to the chat, ' + this.props.route.params.name + '!',
						createdAt: new Date(),
						system: true,
					},
				],
			});

			this.referenceMessageUser = firebase
				.firestore()
				.collection('messages')
				.where('uid', '==', this.state.uid);

			this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(
				this.onCollectionUpdate
			);
		});

		this.referenceMessages = firebase.firestore().collection('messages');

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
		this.unsubscribe();
	}

	get user() {
		return {
			name: this.props.route.params.name,
			_id: this.state.uid,
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
				text: data.text,
				createdAt: new Date(),
				user: {
					user: data.user,
				},
			});
		});
		this.setState({
			messages,
		});
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

	onSend(messages = []) {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				this.addMessage();
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
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
					user={this.state.user}
				/>

				{Platform.OS === 'android' ? (
					<KeyboardAvoidingView behavior="height" />
				) : null}
			</View>
		);
	}
}
