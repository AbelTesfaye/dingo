import React, { Component } from 'react';
import { Text, View, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { TrackList } from '../Lists/ListTrack';
import { AlbumList } from '../Lists/ListAlbum';
import { ArtistList } from '../Lists/ListArtist';
import utils from '../../BL/Utils/utils';
import { database } from '../../BL/Database/database';
import ytdl from 'react-native-ytdl';
import { SearchBar } from '../CustomModules/JS/SearchBar';
import shortid from 'shortid';

const { width, height } = Dimensions.get('window');

export class PageSearch extends Component {
	constructor(props){
		super(props)
		this.state = {
			searchQueryText: "",

			searchQueryArtistsResponse: null,
			searchQueryAlbumsResponse: null,
			searchQueryTracksResponse: null,
			searchQueryYouTubeResponse: null,	

			isSearchArtistsFinished: true,
			isSearchAlbumsFinished: true,
			isSearchTracksFinished: true,
			isSearchYouTubeFinished: true,

		}
		this.AppInstance = props.AppInstance;
	}

	_searchArtists = (query, callback) => {
		this.setState({isSearchArtistsFinished: false})
		utils.fetchFromLastFmWithoutParsing(`search/artists?q=${encodeURIComponent(query)}`,
			response => callback(response),
			(err)=>utils.showNetworkLoadingAlert("Couldn't search Artists", this.startSearch),
			()=>this.setState({isSearchArtistsFinished: true})
		);
	};
	_searchAlbums = (query, callback) => {
		this.setState({isSearchAlbumsFinished: false})
		utils.fetchFromEndpoint(`searchAlbum?q=${encodeURIComponent(query)}`,
		 responseJson => callback(responseJson),
			(err)=>utils.showNetworkLoadingAlert("Couldn't search Albums", this.startSearch),
			()=>this.setState({isSearchAlbumsFinished: true})
		 );
	};
	_searchTracks = (query, callback) => {
		this.setState({isSearchTracksFinished: false})
		utils.fetchFromLastFmWithoutParsing(`search/tracks?q=${encodeURIComponent(query)}`,
			response => callback(response),
			(err)=>utils.showNetworkLoadingAlert("Couldn't search Tracks", this.startSearch),
			()=>this.setState({isSearchTracksFinished: true})
		 );
	};
	_searchYouTube = (query, callback) => {
		this.setState({isSearchYouTubeFinished: false})
		utils.fetchFromEndpoint(`searchYouTube?q=${encodeURIComponent(query)}`, 
			responseJson => callback(responseJson),
			(err)=>utils.showNetworkLoadingAlert("Couldn't search YouTube", this.startSearch),
			()=>this.setState({isSearchYouTubeFinished: true})
		);
	};

	startSearch = q => {
		const query = q || this.state.searchQueryText;

		this.setState({searchQueryText: query})

		this._searchArtists(query, response => {
			const results = utils.getArtists(response)

			this.setState({
				searchQueryArtistsResponse: results,
			});
		});

		this._searchAlbums(query, responseJson => {
			const results = responseJson.result.map(i => ({
				...i,
				key: shortid.generate(),
			}));
			this.setState({
				searchQueryAlbumsResponse: results,
			});
		});

		this._searchTracks(query, response => {
			const results = utils.getTracks(response)
			this.setState({
				searchQueryTracksResponse: results,
			});
		});

		this._searchYouTube(query, responseJson => {
			const results = responseJson.results.map(i => ({
				...i,
				key: shortid.generate(),
			}));
			this.setState({
				searchQueryYouTubeResponse: results,
			});
		});
	};


	_handleSearchSubmit = q => {
		const query = q;
		if (ytdl.validateURL(query)) {
			const videoId = ytdl.getVideoID(query);
			this.AppInstance.startInPlayer([{ videoId }]);
		} else {
			this.startSearch(query);
		}

		database.insertSearchHistory(new Date().getTime(), query).catch(e => console.error(e));
	};
	render() {
		const AppInstance = this.AppInstance
		return (
			<ScrollView refreshControl={
				<RefreshControl
					refreshing={!this.state.isSearchArtistsFinished || !this.state.isSearchAlbumsFinished ||
								!this.state.isSearchTracksFinished || !this.state.isSearchYouTubeFinished}
					enabled={false}
					colors={['orange']}
				/>
			}>
				<View style={{ minHeight: 0.75 * height }}>
					<SearchBar onSubmitEditing={q => this._handleSearchSubmit(q)} />
					<View style={{ margin: 10 }}>
						<Text style={{ fontWeight: 'bold', margin: 10, fontSize: 20 }}>Artists</Text>

						<View style={{ marginHorizontal: 10 }}>
							<ArtistList
								data={
									this.state
										.searchQueryArtistsResponse
								}
								AppInstance={AppInstance}
								maxItems={2}
							/>
						</View>

						<Text style={{ fontWeight: 'bold', margin: 10, fontSize: 20 }}>Albums</Text>
						<View style={{ marginHorizontal: 10 }}>
							<AlbumList
								data={
									this.state
										.searchQueryAlbumsResponse
								}
								AppInstance={AppInstance}
								maxItems={4}
							/>
						</View>
						<Text style={{ fontWeight: 'bold', margin: 10, fontSize: 20 }}>Tracks</Text>
						<View style={{ marginHorizontal: 10 }}>
							<TrackList
								data={
									this.state
										.searchQueryTracksResponse
								}
								onTrackPress={(item, index) =>
									AppInstance.startInPlayer(
										utils.convertToTrackPlayerFormat(
											this.state.searchQueryTracksResponse.slice(
												index
											)
										)
									)
								}
								AppInstance={AppInstance}
								maxItems={10}
							/>
						</View>
						<Text style={{ fontWeight: 'bold', margin: 10, fontSize: 20 }}>YouTube</Text>
						<View style={{ marginHorizontal: 10 }}>
							<TrackList
								data={
									this.state
										.searchQueryYouTubeResponse
								}
								onTrackPress={(item, index) =>
									AppInstance.startInPlayer(
										utils.convertToTrackPlayerFormat(
											this.state.searchQueryYouTubeResponse.slice(
												index
											)
										)
									)
								}
								AppInstance={AppInstance}
								maxItems={5}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
};
