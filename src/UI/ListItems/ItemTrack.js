import React from 'react';
import { Text, View, Image, TouchableNativeFeedback } from 'react-native';
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
							uri: this.props.item.images[0],
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
								fontWeight: 'bold',
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
