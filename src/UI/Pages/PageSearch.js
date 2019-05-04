import React from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import { TrackList } from '../Lists/ListTrack';
import { AlbumList } from '../Lists/ListAlbum';
import { ArtistList } from '../Lists/ListArtist';
import utils from '../../BL/Utils/utils';
import { database } from '../../BL/Database/database';
import ytdl from 'react-native-ytdl';
import { SearchBar } from '../CustomModules/JS/SearchBar';

const { width, height } = Dimensions.get('window');

export const PageSearch = props => {
	_handleSearchSubmit = q => {
		const query = q;
		if (ytdl.validateURL(query)) {
			const videoId = ytdl.getVideoID(query);
			AppInstance.startInPlayer([{ videoId }]);
		} else {
			AppInstance.startSearch(query);
		}

		database.insertSearchHistory(new Date().getTime(), query).catch(e => console.error(e));
	};
	const AppInstance = props.AppInstance;
	return (
		<ScrollView>
			<View style={{ minHeight: 0.75 * height }}>
				<SearchBar onSubmitEditing={q => _handleSearchSubmit(q)} />
				<View style={{ margin: 10 }}>
					<Text style={{ fontWeight: 'bold', margin: 10, fontSize: 20 }}>Artists</Text>

					<View style={{ marginHorizontal: 10 }}>
						<ArtistList
							data={
								AppInstance.state
									.screenStates_screenNavigatorStates_pageSearchStates_searchQueryArtistsResponse
							}
							AppInstance={AppInstance}
							maxItems={2}
						/>
					</View>

					<Text style={{ fontWeight: 'bold', margin: 10, fontSize: 20 }}>Albums</Text>
					<View style={{ marginHorizontal: 10 }}>
						<AlbumList
							data={
								AppInstance.state
									.screenStates_screenNavigatorStates_pageSearchStates_searchQueryAlbumsResponse
							}
							AppInstance={AppInstance}
							maxItems={4}
						/>
					</View>
					<Text style={{ fontWeight: 'bold', margin: 10, fontSize: 20 }}>Tracks</Text>
					<View style={{ marginHorizontal: 10 }}>
						<TrackList
							data={
								AppInstance.state
									.screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse
							}
							onTrackPress={(item, index) =>
								AppInstance.startInPlayer(
									utils.convertToTrackPlayerFormat(
										AppInstance.state.screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse.slice(
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
};
