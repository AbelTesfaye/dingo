import React from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { TrackList } from '../Lists/ListTrack';
import utils from '../../BL/Utils/utils';
export class PageLibrary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refreshing: false,
			loadingPlaylist: false,
		};

		this.AppInstance = props.AppInstance;
	}

	_onRefresh = () => {
		this.setState({ refreshing: true });
		this.AppInstance.getRecentTracksAndPutThemInState().then(() => {
			this.setState({ refreshing: false });
		});
	};
	render() {
		return (
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing || this.state.loadingPlaylist}
						onRefresh={this._onRefresh}
						colors={['orange']}
					/>
				}
			>
				{
					<View style={{ flex: 1 }}>
						<View
							style={{
								flex: 1,
								backgroundColor: 'white',
								margin: 10,
							}}
						>
							<View style={{}}>
								<View
									style={{
										margin: 3,
									}}
								>
									<Text
										style={{
											fontWeight: 'bold',
											fontSize: 15,
										}}
									>
										Playlist Generator
									</Text>
									<Text
										style={{
											fontSize: 13,
										}}
									>
										Pick a song to generate playlist
									</Text>
								</View>
								<View
									style={{
										backgroundColor: 'blue',
									}}
								>
									{this.state.refreshing || (
										<TrackList
											maxItems={100}
											AppInstance={this.AppInstance}
											onTrackPress={(item, index) => {
												this.setState({
													loadingPlaylist: true,
												});
												utils.fetchFromEndpoint(
													`getPlaylistUsingTrack?name=${encodeURIComponent(
														item.name
													)}&artistName=${encodeURIComponent(item.artistName)}`,
													responseJson => {
														this.setState({
															loadingPlaylist: false,
														});
														const tracks = responseJson.track;
														if (tracks.length < 1) {
															alert(
																`Playlist could not be generated for: ${
																	item.artistName
																} - ${item.name}`
															);
														} else {
															const newPlaylist = utils
																.convertToTrackPlayerFormat([item])
																.concat(
																	utils.convertToTrackPlayerFormatFromGeneratedPlaylist(
																		tracks
																	)
																);
															this.AppInstance.startInPlayer(
																newPlaylist.map((item, index) => {
																	return {
																		...item,
																		id: index.toString(),
																	};
																})
															);
														}
													}
												);
											}}
											data={
												this.AppInstance.state
													.screenStates_screenNavigatorStates_pageLibraryStates_recentTracksUniqueResponse
											}
										/>
									)}
								</View>
							</View>
						</View>
					</View>
				}
			</ScrollView>
		);
	}
}
