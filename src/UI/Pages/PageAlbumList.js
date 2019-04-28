import React from 'react';
import { AlbumListGrid } from '../Lists/ListAlbumGrid';

export class AlbumListPage extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const AppInstance = this.props.AppInstance;
		return <AlbumListGrid AppInstance={AppInstance} data={this.props.data} />;
	}
}
