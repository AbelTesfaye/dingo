import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import TrackPlayer from 'react-native-track-player';
import shortid from 'shortid';
import { ScreenDetail } from './src/UI/Screens/ScreenDetail';
import { ScreenNavigator } from './src/UI/Screens/ScreenNavigator';
import ScreenPlayer from './src/UI/Screens/ScreenPlayer';
import SplashScreen from './src/UI/CustomModules/Native/SplashScreen';
import utils from './src/BL/Utils/utils';

var db = openDatabase(
	{ name: 'sqlite.db', createFromLocation: '~sqlite.db' },
	() => {
		console.log('db opened');
	},
	err => {
		console.log('SQL Error: ' + err);
	}
);

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeScreen: null,
			screenAndPageStack: [],

			screenStates_screenNavigatorStates_newQueueItems: [],

			screenStates_screenNavigatorStates_pageHomeStates_topTracksChartResponse: null,
			screenStates_screenNavigatorStates_pageHomeStates_similarAlbumsResponse: null,
			screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse: null,

			screenStates_screenNavigatorStates_pageSearchStates_searchQueryText: '',
			screenStates_screenNavigatorStates_pageSearchStates_searchIsFocused: false,
			screenStates_screenNavigatorStates_pageSearchStates_searchSuggestions: [],
			screenStates_screenNavigatorStates_pageSearchStates_searchQueryArtistsResponse: null,
			screenStates_screenNavigatorStates_pageSearchStates_searchQueryAlbumsResponse: null,
			screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse: null,
			screenStates_screenNavigatorStates_pageSearchStates_searchQueryYouTubeResponse: null,

			screenStates_screenNavigatorStates_pageLibraryStates_generatedPlaylistIsLoading: false,
			screenStates_screenNavigatorStates_pageLibraryStates_recentTracksUniqueResponse: false,

			screenStates_screenPlayerStates_pageQueueStates_tracksInQueue: [],
			screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack: {},
			screenStates_screenPlayerStates_pageQueueStates_playerState: '',
			screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex: 0,

			screenStates_screenDetailStates_activePage: null,
			screenStates_screenDetailStates_pageArtistInfoStates_artistName: null,
			screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName: null,
			screenStates_screenDetailStates_pageArtistListStates_artists: null,
			screenStates_screenDetailStates_pageAlbumListStates_albums: null,
			screenStates_screenDetailStates_pageTrackListStates_tracks: null,
		};
	}

	getRecentTracks = callback => {
		recentTracks = [];
		db.transaction(tx => {
			tx.executeSql('SELECT * FROM recent ORDER BY timestamp DESC limit 100', [], (tx, results) => {
				console.log('Read from recent tracks successfully');

				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);

					recentTracks.push({
						id: row.timestamp,
						name: row.trackName,
						artistName: row.artistName,
						images: [row.image || ''],
					});
				}

				callback(recentTracks);
			});
		});
	};

	_getRecentTracksAndPutThemInState = () => {
		this.getRecentTracks(recentTracks => {
			this.setState({
				screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse: recentTracks,
				screenStates_screenNavigatorStates_pageLibraryStates_recentTracksUniqueResponse: utils.getUnique(
					recentTracks,
					'name'
				),
			});
			this.getSimilarAlbumsAndPutThemInState();
		});
	};

	componentDidMount = () => {
		SplashScreen.hide();

		this.getChartTopTracksAndPutThemInState();

		this._getRecentTracksAndPutThemInState();

		this._onTrackChanged = TrackPlayer.addEventListener('playback-track-changed', async data => {
			if (globals.shouldUIRespondToEvents) {
				if (data.nextTrack) {
					const track = await TrackPlayer.getTrack(data.nextTrack);

					this.setState({
						screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack: track,
					});
				}
				this.getTrackPlayerQueueToState();
				this.updateCurrentPlayingTrackState();
			}
		});

		this._onStateChanged = TrackPlayer.addEventListener('playback-state', data => {
			if (globals.shouldUIRespondToEvents) {
				this.setState({
					screenStates_screenPlayerStates_pageQueueStates_playerState: data.state,
				});

				this.getTrackPlayerQueueToState();
			}
		});
	};

	componentWillUnmount() {
		this._onTrackChanged.remove();
		this._onStateChanged.remove();
	}

	_getCurrentTrackId = callback => {
		TrackPlayer.getCurrentTrack()
			.then(trackid => {
				callback(trackid);
			})
			.catch(e => console.error(e));
	};

	getTrackPlayerQueueToState = () => {
		TrackPlayer.getQueue()
			.then(tracks => {
				this.setState({
					screenStates_screenPlayerStates_pageQueueStates_tracksInQueue: tracks,
				});
			})
			.catch(e => console.error(e));
	};

	_updateIndexOfCurrentPlayingItemState = () => {
		this.state.screenStates_screenPlayerStates_pageQueueStates_tracksInQueue.map((item, index) => {
			if (item.id === this.state.screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack.id) {
				this.setState({
					screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex: index,
				});
			}
		});
	};

	updateCurrentPlayingTrackState = () => {
		this._getCurrentTrackId(trackid => {
			TrackPlayer.getTrack(trackid)
				.then(track => {
					this.setState({
						screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack: track,
					});
					this._updateIndexOfCurrentPlayingItemState();
				})
				.catch(e => console.log(e));
		});
	};

	updateSearchQueryText = query => {
		this.setState({
			screenStates_screenNavigatorStates_pageSearchStates_searchQueryText: query,
		});
	};

	_searchArtists = (query, callback) => {
		utils.fetchFromEndpoint(`searchArtist?q=${encodeURIComponent(query)}`, responseJson => {
			callback(responseJson);
		});
	};
	_searchAlbums = (query, callback) => {
		utils.fetchFromEndpoint(`searchAlbum?q=${encodeURIComponent(query)}`, responseJson => {
			callback(responseJson);
		});
	};
	_searchTracks = (query, callback) => {
		utils.fetchFromEndpoint(`searchTrack?q=${encodeURIComponent(query)}`, responseJson => {
			callback(responseJson);
		});
	};
	_searchYouTube = (query, callback) => {
		utils.fetchFromEndpoint(`searchYouTube?q=${encodeURIComponent(query)}`, responseJson => {
			callback(responseJson);
		});
	};

	_getChartTopTracks = callback => {
		utils.fetchFromEndpoint(`getChartTopTracks`, responseJson => {
			callback(responseJson);
		});
	};
	getChartTopTracksAndPutThemInState = () => {
		this._getChartTopTracks(responseJson => {
			const results = responseJson.result;
			this.setState({
				screenStates_screenNavigatorStates_pageHomeStates_topTracksChartResponse: results,
			});
		});
	};

	_getSimilarAlbums = (tag, callback) => {
		utils.fetchFromEndpoint(`tagTopAlbums?tag=${encodeURIComponent(tag)}`, responseJson => {
			callback(responseJson);
		});
	};
	getSimilarAlbumsAndPutThemInState = () => {
		recentItems = this.state.screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse;

		if (recentItems) {
			randomTrack = recentItems[Math.floor(Math.random() * recentItems.length)];
			bigTag = randomTrack.artistName.split(' ');
			tag = bigTag[Math.floor(Math.random() * bigTag.length)];
			this._getSimilarAlbums(tag, responseJson => {
				const albums = responseJson.album;

				this.setState({
					screenStates_screenNavigatorStates_pageHomeStates_similarAlbumsResponse: utils.convertAlbumFromTagResultToAppFormat(
						albums
					),
				});
			});
		}
	};

	_getVideo = (artistName, songName, callback) => {
		utils.fetchFromEndpointWithoutParsing(
			`getVideo?artist=${encodeURIComponent(artistName)}&song=${encodeURIComponent(songName)}`,
			response => {
				callback(response);
			}
		);
	};

	_onSearchTracksPress = (track, index) => {
		// playlistItems = [track];
		playlistItems = this.state.screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse;
		playlistItems = playlistItems;

		playlistItems = utils.convertToTrackPlayerFormat(playlistItems);
		this.startInPlayer(playlistItems.slice(index));
	};
	startInPlayer = tracks => {
		this.setState({
			screenStates_screenNavigatorStates_newQueueItems: tracks,
			activeScreen: 'SCREEN_PLAYER',
		});
	};
	startSearch = q => {
		const query = q || this.state.screenStates_screenNavigatorStates_pageSearchStates_searchQueryText;

		this._searchArtists(query, responseJson => {
			const results = responseJson.result.map(i => ({
				...i,
				key: shortid.generate(),
			}));

			this.setState({
				screenStates_screenNavigatorStates_pageSearchStates_searchQueryArtistsResponse: results,
			});
		});

		this._searchAlbums(query, responseJson => {
			const results = responseJson.result.map(i => ({
				...i,
				key: shortid.generate(),
			}));
			this.setState({
				screenStates_screenNavigatorStates_pageSearchStates_searchQueryAlbumsResponse: results,
			});
		});

		this._searchTracks(query, responseJson => {
			const results = responseJson.result.map(i => ({
				...i,
				key: shortid.generate(),
			}));
			this.setState({
				screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse: results,
			});
		});

		this._searchYouTube(query, responseJson => {
			const results = responseJson.results.map(i => ({
				...i,
				key: shortid.generate(),
			}));
			this.setState({
				screenStates_screenNavigatorStates_pageSearchStates_searchQueryYouTubeResponse: results,
			});
		});
	};

	showPageArtistInfo = artistName => {
		this.setState({
			activeScreen: 'SCREEN_DETAIL',
			screenStates_screenDetailStates_activePage: 'PAGE_ARTIST_INFO',

			screenStates_screenDetailStates_pageArtistInfoStates_artistName: artistName,
		});
	};

	showPageAlbumInfo = (artistName, albumName) => {
		this.setState({
			activeScreen: 'SCREEN_DETAIL',
			screenStates_screenDetailStates_activePage: 'PAGE_ALBUM_INFO',

			screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName: {
				artistName,
				albumName,
			},
		});
	};

	openArtistListPage = artists => {
		this.setState({
			activeScreen: 'SCREEN_DETAIL',
			screenStates_screenDetailStates_activePage: 'PAGE_ARTIST_LIST',

			screenStates_screenDetailStates_pageArtistListStates_artists: artists,
		});
	};

	openAlbumListPage = albums => {
		this.setState({
			activeScreen: 'SCREEN_DETAIL',
			screenStates_screenDetailStates_activePage: 'PAGE_ALBUM_LIST',

			screenStates_screenDetailStates_pageAlbumListStates_albums: albums,
		});
	};

	openTrackListPage = tracks => {
		this.setState({
			activeScreen: 'SCREEN_DETAIL',
			screenStates_screenDetailStates_activePage: 'PAGE_TRACK_LIST',

			screenStates_screenDetailStates_pageTrackListStates_tracks: tracks,
		});
	};

	render() {
		const AppInstance = this;
		return (
			<View style={{ flex: 1 }}>
				{this.state.activeScreen == 'SCREEN_NAVIGATOR' || this.state.activeScreen == null ? (
					<ScreenNavigator AppInstance={AppInstance} />
				) : this.state.activeScreen == 'SCREEN_PLAYER' ? (
					<ScreenPlayer
						AppInstance={AppInstance}
						tracks={this.state.screenStates_screenNavigatorStates_newQueueItems}
					/>
				) : this.state.activeScreen == 'SCREEN_DETAIL' ? (
					<ScreenDetail AppInstance={AppInstance} />
				) : (
					<Text style={styles.welcome}>Unknown screen</Text>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},

	viewPagerItem: {
		backgroundColor: 'white',
		height: 50,
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center',
	},
	backgroundImage: {
		flex: 1,
		resizeMode: 'cover', // or 'stretch'
	},
	tabbar: {
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	icon: {
		backgroundColor: 'transparent',
		color: '#000',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.8,
	},

	badge: {
		marginTop: 4,
		marginRight: 32,
		backgroundColor: '#f44336',
		height: 24,
		width: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 4,
	},
	count: {
		color: '#fff',
		fontSize: 12,
		fontWeight: 'bold',
		marginTop: -2,
	},
});
