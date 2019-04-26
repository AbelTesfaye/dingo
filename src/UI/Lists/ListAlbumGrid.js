import React from 'react';
import { FlatList } from 'react-native';
import { AlbumListItemGrid as AlbumListGridItem } from '../ListItems/ItemAlbumGrid';
export class AlbumListGrid extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const AppInstance = this.props.AppInstance;
		return (
			<FlatList
				keyExtractor={(item, index) => index.toString()}
				style={{
					backgroundColor: 'white',
				}}
				data={this.props.data}
				numColumns={2}
				renderItem={({ item }) => {
					return <AlbumListGridItem AppInstance={AppInstance} albumInfo={item} />;
				}}
			/>
		);
	}
}
