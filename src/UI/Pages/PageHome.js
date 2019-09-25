import React from 'react';
import { Text, View, ScrollView, RefreshControl, TouchableNativeFeedback, Linking } from 'react-native';
import { TrackList } from '../Lists/ListTrack';
import { AlbumList } from '../Lists/ListAlbum';
import utils from '../../BL/Utils/utils';
export class PageHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			topTracksChartResponse: null,
			isGetChartTopTracksFinished: true,
			isGetRecentTracksAndPutThemInStateFinished: true,
		};

		this.AppInstance = props.AppInstance;
	}
	componentDidMount(){
		this.getChartTopTracksAndPutThemInState();
	}

	_onRefresh = () => {
		this.getChartTopTracksAndPutThemInState()

		this.setState({ isGetRecentTracksAndPutThemInStateFinished: false });
		this.AppInstance.getRecentTracksAndPutThemInState().then(() => {
			this.setState({ isGetRecentTracksAndPutThemInStateFinished: true });
		});
	};

	_getChartTopTracks = callback => {
		this.setState({isGetChartTopTracksFinished: false})
		utils.fetchFromLastFmWithoutParsing(
			`charts`, response => callback(response),
			(err) => utils.showNetworkLoadingAlert("Couldn't get Top Tracks", this.getChartTopTracksAndPutThemInState),
			()=>this.setState({isGetChartTopTracksFinished: true})
		);
	};
	getChartTopTracksAndPutThemInState = () => {
		this._getChartTopTracks(response => {
			const results = utils.getTopTracks(response);
			this.setState({
				topTracksChartResponse: results,
			});
		});
	};

	handleLinkClick = () => this._openUrl("https://t.me/dingoCommunity")

	_openUrl = (url) => Linking.openURL(url);

	render() {
		return (
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={!this.state.isGetRecentTracksAndPutThemInStateFinished ||
									!this.state.isGetChartTopTracksFinished}
						onRefresh={this._onRefresh}
						colors={['orange']}
					/>
				}
			>
				<View
					style={{
						flex: 1,
					}}
				>
					<View
						style={{
							flex: 1,
							backgroundColor: 'white',
							margin: 10,
						}}
					>
						<View style={{}}>
							<Text
								style={{
									fontWeight: 'bold',
									margin: 10,
									fontSize: 15,
								}}
							>
								From Last Time
							</Text>
							<View>
								{this.state.refreshing || (
									<TrackList
										maxItems={5}
										AppInstance={this.AppInstance}
										onTrackPress={(item, index) =>
											this.AppInstance.startInPlayer(
												utils.convertToTrackPlayerFormat(
													this.AppInstance.state.screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse.slice(
														index
													)
												)
											)
										}
										data={
											this.AppInstance.state
												.screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse
										}
									/>
								)}
							</View>
						</View>

						<View style={{}}>
							<Text
								style={{
									fontWeight: 'bold',
									margin: 10,
									fontSize: 15,
								}}
							>
								Similar Albums
							</Text>
							<View
								style={{
									backgroundColor: 'blue',
								}}
							>
								<AlbumList
									data={
										this.AppInstance.state
											.screenStates_screenNavigatorStates_pageHomeStates_similarAlbumsResponse
									}
									AppInstance={this.AppInstance}
									maxItems={5}
								/>
							</View>
						</View>

						<View style={{}}>
							<Text
								style={{
									fontWeight: 'bold',
									margin: 10,
									fontSize: 15,
								}}
							>
								Top Tracks Chart
							</Text>
							<View
								style={{
									backgroundColor: 'blue',
								}}
							>
								<TrackList
									maxItems={10}
									AppInstance={this.AppInstance}
									onTrackPress={(item, index) =>
										this.AppInstance.startInPlayer(
											utils.convertToTrackPlayerFormat(
												this.state.topTracksChartResponse.slice(
													index
												)
											)
										)
									}
									data={
										this.state
											.topTracksChartResponse
									}
								/>
							</View>
						</View>
					</View>
				</View>

				<TouchableNativeFeedback onPress={this.handleLinkClick}>
					<View>
						<Text
							style={{
								textAlign: 'center',
								color: '#ddd',
								margin: 5,
							}}
						>
							For any comments, suggestions or (thank you)s click here to find us on our Telegram group:
						</Text>
						<Text
							style={{
								textAlign: 'center',
								color: '#ddd',
								margin: 5,
							}}
						>
							https://t.me/dingoCommunity
						</Text>
					</View>
				</TouchableNativeFeedback>
			</ScrollView>
		);
	}
}
