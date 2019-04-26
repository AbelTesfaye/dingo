import React, { Component } from 'react';
import { Text, View, Image, TouchableNativeFeedback, Dimensions } from 'react-native';
import { MiniPlayerProgressBar } from './MiniPlayerProgressBar';
import TrackPlayer from 'react-native-track-player';

const { width, height } = Dimensions.get('window');

export class MiniPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			position: 0,
			bufferedPosition: 0,
			duration: 0,
		};
	}

	componentDidMount() {
		this._progressUpdates = true;
		this._updateProgress();
		this._timer = setInterval(this._updateProgress.bind(this), 1000);
	}

	componentWillUnmount() {
		this._progressUpdates = false;
		clearInterval(this._timer);
	}

	async _updateProgress() {
		try {
			const data = {
				position: await TrackPlayer.getPosition(),
				bufferedPosition: await TrackPlayer.getBufferedPosition(),
				duration: await TrackPlayer.getDuration(),
				track: await TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack()),
			};

			if (this._progressUpdates) {
				this.setState(data);
			}
		} catch (e) {
			// The player is probably not initialized yet, we'll just ignore it
		}
	}

	getProgress() {
		if (!this.state.duration || !this.state.position) return 0;

		return this.state.position / this.state.duration;
	}

	getBufferedProgress() {
		if (!this.state.duration || !this.state.bufferedPosition) return 0;

		return this.state.bufferedPosition / this.state.duration;
	}

	getCurrentTrack() {
		if (!this.state.track) return {};

		return this.state.track;
	}

	render() {
		const AppInstance = this.props.AppInstance;

		const track = this.getCurrentTrack();
		return Object.keys(track).length !== 0 ? (
			<TouchableNativeFeedback
				onPress={() => {
					AppInstance.setState({
						activeScreen: 'SCREEN_PLAYER',
						screenStates_screenNavigatorStates_newQueueItems: [],
					});
				}}
			>
				<View
					elevation={5}
					style={{
						width: width,
						height: 55,
						backgroundColor: 'white',
						zIndex: 1,
					}}
				>
					<MiniPlayerProgressBar
						progress={this.getProgress()}
						bufferedProgress={this.getBufferedProgress()}
					/>

					<View
						style={{
							height: 50,
							backgroundColor: '#fafafa',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<Image
							style={{
								height: 50,
								width: 50,
							}}
							source={{
								uri: track.artwork,
							}}
						/>

						<View
							style={{
								marginHorizontal: 10,
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
								flex: 1,
							}}
						>
							<Text
								numberOfLines={1}
								ellipsizeMode={'tail'}
								style={{
									fontWeight: 'bold',
								}}
							>
								{track.title}
							</Text>

							<Text numberOfLines={1} ellipsizeMode={'tail'} style={{}}>
								{track.artist}
							</Text>
						</View>
					</View>
				</View>
			</TouchableNativeFeedback>
		) : null;
	}
}
