import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { AlbumItem } from '../ListItems/ItemAlbum';

export class AlbumList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const AppInstance = this.props.AppInstance;

		return (
			<FlatList
				ListFooterComponent={() => {
					return this.props.data && this.props.maxItems <= this.props.data.length ? (
						<TouchableWithoutFeedback
							onPress={() => {
								AppInstance.openAlbumListPage(this.props.data);
							}}
						>
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Text>Show more</Text>
							</View>
						</TouchableWithoutFeedback>
					) : null;
				}}
				keyExtractor={(item, index) => index.toString()}
				horizontal={true}
				style={{
					backgroundColor: 'white',
				}}
				data={this.props.data ? this.props.data.slice(0, this.props.maxItems) : null}
				renderItem={({ item }) => {
					return <AlbumItem AppInstance={this.props.AppInstance} albumInfo={item} />;
				}}
			/>
		);
	}
}
