import React from 'react';
import { Text, View, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-ionicons';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { database } from '../../../BL/Database/database';

export class SearchBar extends React.Component {
	state = {
		searchQueryText: '',
		isFocused: false,
		searchSuggestions: [],
	};
	constructor(props) {
		super(props);
	}
	_showHistory = () => {
		database
			.getSearchHistory()
			.then(searchHistory => {
				this.setState({
					searchSuggestions: searchHistory,
				});
			})
			.catch(e => console.error(e));
	};

	_updateSearchSuggestions = (q, callback) => {
		if (q.length > 0)
			fetch(`http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${q}`)
				.then(res => res.json())
				.then(resJSON => {
					callback(resJSON);
				})
				.catch(e => console.error(e));
	};
	updateSearchQueryText = query => {
		this.setState({
			searchQueryText: query,
		});
	};
	render() {
		return (
			<View
				style={{
					zIndex: 999999,
				}}
			>
				<View>
					<TextInput
						onSubmitEditing={() => this.props.onSubmitEditing(this.state.searchQueryText)}
						style={{
							height: 40,
							margin: 10,
							backgroundColor: '#efefef',
						}}
						onFocus={() => {
							this.setState({
								isFocused: true,
							});
							if (this.state.searchQueryText.length === 0) this._showHistory();
						}}
						onBlur={() => {
							if (!this.isInsertingSuggestion) {
								this.setState({
									isFocused: false,
								});
							}

							this.isInsertingSuggestion = false
						}}
						onChangeText={text => {
							this.updateSearchQueryText(text);
							this._updateSearchSuggestions(text, newSuggestions => {
								this.setState({
									searchSuggestions: newSuggestions[1].slice(0, 5).map(item => ({
										search_text: item,
									})),
								});
							});
							if (text.length === 0) this._showHistory();
						}}
						placeholder="Search"
						value={this.state.searchQueryText}
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
						{this.state.searchQueryText.length > 0 && (
							<TouchableNativeFeedback onPress={() => this.updateSearchQueryText('')}>
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
				{this.state.isFocused ? (
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
							data={this.state.searchSuggestions}
							renderItem={({ item }) => {
								return (
									<View
										style={{
											flexDirection: 'row',
											flex: 1
										}}
									>
										<View
											style={{
												flex: 1,
												alignItems: 'stretch'
											}}
										>
											<TouchableNativeFeedback
												style={{
													flex: 1,
												}}
												onPress={() => {
													this.updateSearchQueryText(item.search_text);
													this.props.onSubmitEditing(item.search_text);
													this.setState({
														isFocused: false,
													});
												}}
											>

												<View
													style={{
														padding: 10,
														flex: 1,
													}}
												>

													<Text
														style={{
															fontWeight: 'bold',
														}}
													>
														{item.search_text}
													</Text>
												</View>
											</TouchableNativeFeedback>
										</View>

										<TouchableNativeFeedback
											onPress={() => {
												this.isInsertingSuggestion = true
												this.setState({
													searchQueryText: item.search_text,
													isFocused: true,
												});
												this._updateSearchSuggestions(item.search_text, newSuggestions => {
													this.setState({
														searchSuggestions: newSuggestions[1].slice(0, 5).map(item => ({
															search_text: item,
														})),
													});
												});
											}}
										>
											<View
												style={{
													padding: 10,
													flex: 1,
												}}
											>
												<Icon
													name={'arrow-round-back'}
													size={24}
													style={{
														transform: [
															{
																rotate: '45deg',
															},
														],
													}}
												/>
											</View>
										</TouchableNativeFeedback>
									</View>
								);
							}}
						/>
					</View>
				) : null}
			</View>
		);
	}
}
