import React, { Component } from 'react';
import {
	NativeEventEmitter,
	BackHandler,
	Dimensions,
	FlatList,
	Image,
	ImageBackground,
	Platform,
	StyleSheet,
	Text,
	TouchableNativeFeedback,
	View,
	ActivityIndicator,
} from 'react-native';
import ImageButton from '../CustomModules/JS/ImageButton';
import ProgressBar from '../CustomModules/JS/ProgressBar';
import SlidingPanel from '../CustomModules/JS/SlidingPanel';
import { settings } from '../../BL/Database/settings';
import Icon from 'react-native-ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import utils from '../../BL/Utils/utils';
import PIPVideoPlayer from '../CustomModules/Native/PIPVideoPlayer'
import { database } from '../../BL/Database/database';
import {FloatingAction} from 'react-native-floating-action'
import AndroidYouTubePlayer from '../CustomModules/Native/AndroidYouTubePlayer'

const { width, height } = Dimensions.get('window');

export default class ScreenPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			webViewVideoId: "",
			isPIPVideoPlayerActive: false
		}
		this.AppInstance = this.props.AppInstance;

		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}
	componentDidMount() {
		let tracksToPlay = this.props.tracks;
		const indexToPlay = 0;

		if (tracksToPlay.length > 0) { // if not started from miniplayer

			this._putTracksFromPropToState(()=>this.playItemInTrackQueue(indexToPlay));

		}

		const PIPVideoPlayerEventEmitter = new NativeEventEmitter(PIPVideoPlayer);
		PIPVideoPlayerEventEmitter.removeAllListeners('PIPVideoPlayer')
		PIPVideoPlayerEventEmitter.addListener('PIPVideoPlayer', (event) => {
			console.log(event)
			if(event.state)
				this.handlePlayerState(event.state)

		})

		const AndroidYouTubePlayerEventEmitter = new NativeEventEmitter(AndroidYouTubePlayer);
		AndroidYouTubePlayerEventEmitter.removeAllListeners('AndroidYouTubePlayer')
		AndroidYouTubePlayerEventEmitter.addListener('AndroidYouTubePlayer', (event) => {
			console.log("AndroidYouTubePlayer",event)
			if(event.state)
				this.handlePlayerState(event.state)
		 })

	}


	handlePlayerState = (state)=>{
		switch(state){
			case "UNKNOWN": break;
			case "UNSTARTED": break;
			case "ENDED": this._skipToNext(); break;
			case "PLAYING": break;
			case "PAUSED": break;
			case "BUFFERING": break;
			case "VIDEO_CUED": break;

			case "DESTROYED":this.setState({ isPIPVideoPlayerActive: false });break;
		}
		this.setState({playerState:state})

	}

	writeRecentTrack = (timestamp, trackName, artistName, image, youtube_id) => {
		database.insertRecentTrack(timestamp, trackName, artistName, image, youtube_id).catch(e => console.error(e));
	};


	play = (videoId) => {
		if(this.state.isPIPVideoPlayerActive)
			PIPVideoPlayer.open(videoId)
		else
			this.setState({webViewVideoId:videoId})
	}

	playItemInTrackQueue = (index) => {
		const trackQueue = this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_tracksInQueue
		
		const track = trackQueue[index]
		if(!trackQueue[index].videoId){
			this.getVideoIdForTrack(track,(id)=>{
				this.play(id)
	
				const trackQueue = this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_tracksInQueue
				trackQueue[index].videoId = id
				this.AppInstance.setState({screenStates_screenPlayerStates_pageQueueStates_tracksInQueue:trackQueue})
			})
		}else{
			this.play(track.videoId)
		}	

		this.writeRecentTrack(
			new Date().getTime(),
			track.title,
			track.artist,
			track.artwork,
			track.videoId
		);

		const trackToRight = trackQueue[index + 1]
		if(trackToRight && !trackToRight.videoId)
			this.getAndUpdateVideoId(trackToRight, index + 1)

		const trackToLeft = trackQueue[index - 1]
		if(trackToLeft && !trackToLeft.videoId)
			this.getAndUpdateVideoId(trackToLeft, index - 1)

	}

	getAndUpdateVideoId = (track,index) => {
		this.getVideoIdForTrack(track,(id)=>{
			const trackQueue = this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_tracksInQueue
			trackQueue[index].videoId = id
			this.AppInstance.setState({screenStates_screenPlayerStates_pageQueueStates_tracksInQueue:trackQueue})
		})
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		this.AppInstance.setState({
			activeScreen: 'SCREEN_NAVIGATOR',
		});
		return true;
	}

	scrollToIndex = (index) => {
		if(this.flatListRef)
			this.flatListRef.scrollToIndex({animated: true,index:(index > 0 ? index - 1 : 0)});
	}

	_skipToNext = () => {
		const trackQueue = this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_tracksInQueue
		const currentIndex = this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex

		const newIndex = currentIndex + 1
		if(newIndex < trackQueue.length){
			this.scrollToIndex(newIndex)

			this.playItemInTrackQueue(newIndex)
			this.AppInstance.setState({
				screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex: newIndex,
			})
		}
	};

	_skipToPrevious = () => {
		const currentIndex = this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex

		const newIndex = currentIndex - 1
		if(newIndex > -1){
			this.scrollToIndex(newIndex)

			this.playItemInTrackQueue(newIndex)
			this.AppInstance.setState({
				screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex: newIndex,
			})
		}
	};
	_stopPlaybackAndResetQueue = () => {
		console.log("reset","clicked")

	};

	_updateTracksInState = (tracks,callback) => {
		this.AppInstance.setState({
			screenStates_screenPlayerStates_pageQueueStates_tracksInQueue: tracks,
		},callback);
	};

	_putTracksFromPropToState = (callback) => {
		this._updateTracksInState(this.props.tracks,callback);
	};
	_onPlaylistItemPress = (item, index) => {
		const indexInState = this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex;
		
		this.AppInstance.setState({
			screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex: index,
		}, this.playItemInTrackQueue(index));
		
	};

	getVideoIdForTrack = (item,callback)=>{
		if (!item.url || item.url.length <= 'http://'.length) {
			if (item.title && item.artist) {
				utils.fetchFromEndpoint(
					`getHighestQualityAudioUsingArtistAndSong?artist=${encodeURIComponent(
						item.artist
					)}&song=${encodeURIComponent(item.title)}`,
					response => {
						callback(response.videoId)
					}
				);
			}
		}

	}

	render() {
		return (
			<View style={{ ...styles.container, width: width }}>
				<AndroidYouTubePlayer
					style={{
						width: width,
						height: width * (9 / 16)
					}}
					videoId={this.state.webViewVideoId}
					showYouTubeButton={false}
					showFullScreenButton={false}
				/>
				<View style={{ ...styles.bodyViewStyle, flex: 1 }}>
					<View style={{ marginHorizontal: 10, flex: 1 }}>
						<FlatList
							keyExtractor={(item, index) => index.toString()}
							ref={(ref) => { this.flatListRef = ref; }}
							style={{
								backgroundColor: 'white',
								flex: 1,
								width: width,
							}}
							data={this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_tracksInQueue}
							renderItem={({ item, index }) => {
								return (
									<TouchableNativeFeedback onPress={() => this._onPlaylistItemPress(item, index)}>
										<View
											style={{
												backgroundColor: 'white',
												flexDirection: 'row',
												margin: 5,
												backgroundColor:
													this.AppInstance.state
														.screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex ===
													index
														? '#ffb74d'
														: '#fff',
											}}
										>
											<View
												style={{
													width: 24,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												<Text
													style={{
														textAlign: 'center',
														fontSize: 20,
														fontWeight: 'bold',
														color:
															item.videoId
																? 'red'
																: 'grey',
													}}
												>
													•
												</Text>
											</View>
											<Image
												style={{
													backgroundColor: '#ddd',
													width: 50,
													height: 50,
												}}
												source={{ uri: settings.get('load_all_images') && item.artwork }}
											/>
											<View
												style={{
													marginHorizontal: 10,
													justifyContent: 'flex-start',
													alignItems: 'flex-start',
													flex: 1,
												}}
											>
												<Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
												<Text style={{}}>{item.artist}</Text>
											</View>
										</View>
									</TouchableNativeFeedback>
								);
							}}
						/>
					</View>
				</View>

				<FloatingAction 
					color="red"
					onPressMain={
						() => {
							this.setState({ isPIPVideoPlayerActive: true })
							PIPVideoPlayer.open(this.state.webViewVideoId)
						}
					}
					showBackground={false}
					visible={!this.state.isPIPVideoPlayerActive}
					floatingIcon={<Icon size={24} color="white" name={"contract"} />}

				/>


			</View>
		);
	}
}

const styles = StyleSheet.create({
	bodyViewStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerLayoutStyle: {
		width,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	slidingPanelLayoutStyle: {
		flex: 1,
		width,
		height,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	commonTextStyle: {
		color: 'white',
		fontSize: 18,
	},
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		resizeMode: 'cover',
	},
	view: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#2b2b2b',
	},
	artwork: {
		width: '100%',
		height: 200,
	},
	artworkLandscape: {
		//TODO
	},
	header: {
		marginTop: Platform.OS == 'ios' ? 20 : 24,
		padding: 1,
		height: 56,
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerIcon: {
		width: 24,
		height: 24,
		margin: 15,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '400',
		color: '#ffffff',
		marginHorizontal: 16,
	},
	info: {
		flexDirection: 'column',
		alignItems: 'center',
		margin: 20,
	},
	title: {
		color: '#e6e6e6',
		fontSize: 19,
		fontWeight: '500',
	},
	artist: {
		color: '#9a9a9a',
		fontSize: 16,
		fontWeight: '400',
	},
	controls: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		padding: 25,
	},
	controlIcon: {
		color: 'black',
		fontSize: 32, // icon size
	},
	playPause: {
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
