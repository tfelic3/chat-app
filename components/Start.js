import React from 'react';
import {
	View,
	Text,
	Button,
	TextInput,
	TouchableHighlight,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '', color: '' };
	}
	render() {
		return (
			<ImageBackground
				style={{ flex: 1 }}
				source={require('../assets/siblings.jpg')}
			>
				<View style={styles.container}>
					<View style={styles.titleView}>
						<Text style={styles.title}>Family Chat</Text>
					</View>

					<View style={styles.mainView}>
						<TextInput
							style={{
								borderColor: 'rgb(149,145,159)',
								borderWidth: 2,
								fontSize: 18,
								width: '88%',

								alignSelf: 'center',
								height: 70,
								padding: 0,
								borderRadius: 3,
								marginBottom: 30,
								marginTop: 30,
								color: 'rgb(88,81,219)',
								fontSize: 20,
							}}
							onChangeText={(name) => this.setState({ name })}
							value={this.state.name}
							accessible={true}
							accessibilityLabel="Input name"
							placeholderTextColor="rgb(210,207,215)"
							placeholder="Your name"
							fontWeight="300"
						/>
						<Text style={styles.backGroundColorText}>
							Choose Background Color:
						</Text>

						<View style={styles.colorSelection}>
							<TouchableOpacity
								style={styles.highLight1}
								onPress={() => this.setState({ color: 'rgb(0,0,0)' })}
							>
								<View></View>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.highLight2}
								onPress={() => this.setState({ color: 'rgb(63, 56, 75)' })}
							>
								<View></View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => this.setState({ color: 'rgb(125,138,154)' })}
							>
								<View style={styles.highLight3}></View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => this.setState({ color: 'rgb(175, 190, 166)' })}
							>
								<View style={styles.highLight4}></View>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate('Chat', {
									name: this.state.name,
									color: this.state.color,
								})
							}
							underlayColor="rgb(64,93,230)"
							display="flex"
						>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.button}
									accessible={true}
									accessibilityLabel="start chatting"
									title="Start Chatting"
									onPress={() =>
										this.props.navigation.navigate('Chat', {
											name: this.state.name,
										})
									}
								>
									<Text style={styles.buttonText}> Start Chatting</Text>
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		color: 'red',
		display: 'flex',
		flexDirection: 'column',

		alignItems: 'center',
		marginBottom: 20,
		height: '44%',
	},

	title: {
		textAlign: 'center',
		fontWeight: '600',
		marginBottom: 100,
		marginTop: 30,
		fontSize: 50,

		color: 'rgb(255,255,255)',
	},

	mainView: {
		backgroundColor: 'rgb(255, 255, 255)',
		width: '88%',
		alignContent: 'flex-end',
	},

	text: {
		color: 'blue',
	},

	backGroundColorText: {
		color: 'rgb(202,200,208)',
		fontSize: 20,
		marginLeft: 15,
	},

	highLight1: {
		backgroundColor: 'rgb(0,0,0)',
		width: 50,
		height: 50,
		marginRight: 15,
		borderRadius: 50 / 2,
	},

	highLight2: {
		backgroundColor: 'rgb(63, 56, 75)',
		width: 50,
		height: 50,
		marginRight: 15,
		borderRadius: 50 / 2,
	},

	highLight3: {
		backgroundColor: 'rgb(125,138,154)',
		width: 50,
		height: 50,
		marginRight: 15,
		borderRadius: 50 / 2,
	},

	highLight4: {
		backgroundColor: 'rgb(175, 190, 166)',
		width: 50,
		height: 50,
		borderRadius: 50 / 2,
	},

	colorSelection: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		padding: 15,
	},

	buttonContainer: {
		height: 70,
	},

	buttonText: {
		color: 'white',
		fontWeight: '700',
	},
	button: {
		alignItems: 'center',
		backgroundColor: 'rgb(105,101,119)',

		padding: 15,
		width: '88%',
		alignSelf: 'center',
	},
});
