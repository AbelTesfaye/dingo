import React from 'react';
import { Text, View, Image, TouchableNativeFeedback } from 'react-native';
import {settings} from "../../BL/Database/settings"

export class ArtistItem extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const AppInstance = this.props.AppInstance;
		return (
			<TouchableNativeFeedback onPress={() => AppInstance.showPageArtistInfo(this.props.artistInfo.name)}>
				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						margin: 5,
					}}
				>
					<Image
						style={{
							borderRadius: 25,
							backgroundColor: '#ddd',
							width: 50,
							height: 50,
						}}
						source={{
							uri: settings.get('load_all_images') && this.props.artistInfo.images[0],
						}}
					/>
					<View
						style={{
							marginHorizontal: 10,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Text
							style={{
								fontSize: 15,
								color: 'black',
							}}
						>
							{this.props.artistInfo.name}
						</Text>
					</View>
				</View>
			</TouchableNativeFeedback>
		);
	}
}
