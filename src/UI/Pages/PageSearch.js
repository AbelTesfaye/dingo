import React, { Component } from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
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
			searchQueryArtistsResponse: null,
			searchQueryAlbumsResponse: null,
			searchQueryTracksResponse: null,
			searchQueryYouTubeResponse: null,	
		}
		this.AppInstance = props.AppInstance;
	}

	_searchArtists = (query, callback) => {
		utils.fetchFromLastFmWithoutParsing(`search/artists?q=${encodeURIComponent(query)}`, response => {
			callback(response);
		});
	};
	_searchAlbums = (query, callback) => {
		utils.fetchFromEndpoint(`searchAlbum?q=${encodeURIComponent(query)}`, responseJson => {
			callback(responseJson);
		});
	};
	_searchTracks = (query, callback) => {
		utils.fetchFromLastFmWithoutParsing(`search/tracks?q=${encodeURIComponent(query)}`, response => {
			callback(response);
		});
	};
	_searchYouTube = (query, callback) => {
		utils.fetchFromEndpoint(`searchYouTube?q=${encodeURIComponent(query)}`, responseJson => {
			callback(responseJson);
		});
	};

	startSearch = q => {
		const query = q || this.state.searchQueryText;

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
			<ScrollView>
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
					</View>
				</View>
			</ScrollView>
		);
	}
};
