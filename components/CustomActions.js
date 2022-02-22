import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import MapView from 'react-native-maps';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component {
	constructor(props) {
		super(props);
	}

	//Pick image from existing images

	pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		console.log(status);

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
		}).catch((error) => console.log(error));

		if (!result.cancelled) {
			const imageUrl = this.uploadImage(result.uri);
			this.props.onSend({ image: imageUrl });
		}
	};

	//pick image after taking photo
	takePhoto = async () => {
		const { status } = await Permissions.askAsync(
			Permissions.CAMERA_ROLL,
			Permissions.CAMERA
		);
		if (status === 'granted') {
			let result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
			}).catch((error) => console.log(error));
			if (!result.cancelled) {
				const imageUrl = await this.uploadImage(result.uri);
				this.props.onSend({ image: imageUrl });
			}
		}
	};

	//get location for user
	getLocation = async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status === 'granted') {
			let result = await Location.getCurrentPositionAsync({}).catch((error) =>
				console.log(error)
			);
			const longitude = JSON.stringify(result.coords.longitude);
			const latitude = JSON.stringify(result.coords.latitude);
			if (result) {
				this.props.onSend({
					location: {
						longitude: result.coords.longitude,
						latitude: result.coords.latitude,
					},
				});
			}
		}
	};
	// upload image to Storage with fetch() and blob()

	// upload image to Storage with XMLHttpRequest
	uploadImage = async (uri) => {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				console.log(e);
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', uri, true);
			xhr.send(null);
		});
		//this will make a unique file name for each image uploaded
		let uriParts = uri.split('/');
		let imageName = uriParts[uriParts.length - 1];

		const ref = firebase.storage().ref().child(`image/${imageName}`);
		const snapshot = await ref.put(blob);
		blob.close();
		const imageUrl = await snapshot.ref.getDownloadURL();
		return imageUrl;
	};

	onActionPress = () => {
		const options = [
			'Choose From Library',
			'Take Picture',
			'Send Location',
			'Cancel',
		];
		const cancelButtonIndex = options.length - 1;
		this.context.actionSheet().showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			async (buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						console.log('user wants to pick an image');
						return this.pickImage();
					case 1:
						console.log('user wants to take a picture');
						return this.takePhoto();
					case 2:
						console.log('user wants to get their location');
						return this.getLocation();
					default:
				}
			}
		);
	};

	render() {
		return (
			<TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
				<View style={[styles.wrapper, this.props.wrapperStyle]}>
					<Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},

	wrapper: {
		borderRadius: 13,
		borderColor: '#b2b2b2',
		borderWidth: 2,
		flex: 1,
	},

	iconText: {
		color: '#b2b2b2',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: 'transparent',
		textAlign: 'center',
	},
});

CustomActions.contextTypes = {
	actionSheet: PropTypes.func,
};
