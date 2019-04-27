import React from 'react';
import { Text, View, TextInput, ScrollView, FlatList, Dimensions } from 'react-native';
import { TrackList } from '../Lists/ListTrack';
import { AlbumList } from '../Lists/ListAlbum';
import { ArtistList } from '../Lists/ListArtist';
import utils from '../../BL/Utils/utils';
import Icon from 'react-native-ionicons';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import ytdl from 'react-native-ytdl';

const { width, height } = Dimensions.get('window');

var db = openDatabase(
	{ name: 'sqlite.db', createFromLocation: '~sqlite.db' },
	() => {
		console.log('db opened');
	},
	err => {
		console.log('SQL Error: ' + err);
	}
);

export const PageSearch = props => {
	_updateSearchSuggestions = (q, callback) => {
		if (q.length > 0)
			fetch(`http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${q}`)
				.then(res => res.json())
				.then(resJSON => {
					callback(resJSON);
				})
				.catch(e => console.error(e));
	};
	_handleSearchSubmit = q => {
		const query =
			q !== undefined ? q : AppInstance.state.screenStates_screenNavigatorStates_pageSearchStates_searchQueryText;

		if (ytdl.validateURL(query)) {
			const videoId = ytdl.getVideoID(query);
			AppInstance.startInPlayer([{ videoId }]);
		} else {
			AppInstance.startSearch(query);
		}

		db.transaction(tx => {
			tx.executeSql(
				'INSERT INTO search_history (timestamp,search_text) VALUES (?,?)',
				[new Date().getTime(), query],
				(tx, results) => {
					console.log('Inserted into search_history successfully');
				}
			);
		});
	};
	_showHistory = () => {
		searchHistory = [];
		db.transaction(tx => {
			tx.executeSql('SELECT * FROM search_history ORDER BY timestamp DESC limit 5', [], (tx, results) => {
				console.log('Read from search_history successfully');

				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);

					searchHistory.push({
						timestamp: row.timestamp,
						search_text: row.search_text,
					});
				}

				AppInstance.setState({
					screenStates_screenNavigatorStates_pageSearchStates_searchSuggestions: searchHistory,
				});
			});
		});
	};
	const AppInstance = props.AppInstance;
	return (
		<ScrollView>
			<View style={{ minHeight: 0.75 * height }}>
				<View
					style={{
						zIndex: 999999,
					}}
				>
					<View>
						<TextInput
							onSubmitEditing={() => {
								_handleSearchSubmit();
							}}
							style={{
								height: 40,
								margin: 10,
								backgroundColor: '#efefef',
							}}
							onFocus={() => {
								AppInstance.setState({
									screenStates_screenNavigatorStates_pageSearchStates_searchIsFocused: true,
								});
								if (
									AppInstance.state
										.screenStates_screenNavigatorStates_pageSearchStates_searchQueryText.length ===
									0
								)
									_showHistory();
							}}
							onBlur={() => {
								AppInstance.setState({
									screenStates_screenNavigatorStates_pageSearchStates_searchIsFocused: false,
								});
							}}
							onChangeText={text => {
								AppInstance.updateSearchQueryText(text);
								_updateSearchSuggestions(text, newSuggestions => {
									AppInstance.setState({
										screenStates_screenNavigatorStates_pageSearchStates_searchSuggestions: newSuggestions[1]
											.slice(0, 5)
											.map(item => ({ search_text: item })),
									});
								});
								if (text.length === 0) _showHistory();
							}}
							placeholder="Search"
							value={
								AppInstance.state.screenStates_screenNavigatorStates_pageSearchStates_searchQueryText
							}
						/>
						<View
							style={{
								color: '#333',
								position: 'absolute',
								right: 0,
								bottom: 0,
								top: 0,
								justifyContent: 'center',
							}}
						>
							{AppInstance.state.screenStates_screenNavigatorStates_pageSearchStates_searchQueryText
								.length > 0 && (
								<TouchableNativeFeedback onPress={() => AppInstance.updateSearchQueryText('')}>
									<Icon
										name="backspace"
										size={25}
										style={{
											marginHorizontal: 10,
											right: 5,
										}}
									/>
								</TouchableNativeFeedback>
							)}
						</View>
					</View>
					{AppInstance.state.screenStates_screenNavigatorStates_pageSearchStates_searchIsFocused ? (
						<View
							style={{
								backgroundColor: 'white',
								position: 'absolute',
								top: 50,
								left: 10,
								right: 10,
								borderBottomWidth: 1,
								borderBottomColor: '#eee',
								flex: 1,
							}}
						>
							<FlatList
								keyExtractor={(item, index) => index.toString()}
								style={{}}
								data={
									AppInstance.state
										.screenStates_screenNavigatorStates_pageSearchStates_searchSuggestions
								}
								renderItem={({ item }) => {
									return (
										<TouchableNativeFeedback
											onPress={() => {
												AppInstance.updateSearchQueryText(item.search_text);
												_handleSearchSubmit(item.search_text);
												AppInstance.setState({
													screenStates_screenNavigatorStates_pageSearchStates_searchIsFocused: false,
												});
											}}
										>
											<View style={{ padding: 10, flexDirection: 'row', flex: 1 }}>
												<View style={{ flex: 1, justifyContent: 'flex-start' }}>
													<Text style={{ fontWeight: 'bold' }}>{item.search_text}</Text>
												</View>

												<Icon
													name={'arrow-round-back'}
													size={24}
													style={{ transform: [{ rotate: '45deg' }] }}
												/>
											</View>
										</TouchableNativeFeedback>
									);
								}}
							/>
						</View>
					) : null}
				</View>

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
