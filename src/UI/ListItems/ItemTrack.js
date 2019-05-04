import React from 'react';
import { Text, View, Image, TouchableNativeFeedback } from 'react-native';
import {settings} from "../../BL/Database/settings"
export class TrackItem extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<TouchableNativeFeedback onPress={() => this.props.onTrackPress(this.props.item, this.props.index)}>
				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						margin: 5,
					}}
				>
					<Image
						style={{
							backgroundColor: '#ddd',
							width: 50,
							height: 50,
							borderRadius: 5,
						}}
						source={{
							uri: settings.get('load_all_images') && this.props.item.images[0],
						}}
					/>
					<View
						style={{
							marginHorizontal: 10,
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							flex: 1,
							alignSelf: 'center',
						}}
					>
						<Text
							style={{
								color: 'black',
							}}
						>
							{this.props.item.name}
						</Text>
						<Text style={{}}>{this.props.item.artistName}</Text>
					</View>
				</View>
			</TouchableNativeFeedback>
		);
	}
}
