import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View, Switch, Text } from 'react-native';
import { settings } from '../../BL/Database/settings';

const flattenMenu = settingsArr => {
	return settingsArr.map(i => (
		<View
			style={{
				padding: 10,
			}}
		>
			{(i.type === 'boolean' && (
				<View style={{ flexDirection: 'row' }}>
					<Text>{i.title}</Text>
					<Switch value={i.currentValue} />
				</View>
			)) ||
				(i.type === 'number' && (
					<View>
						<Text>{i.title}</Text>
						<TextInput
							placeholder={i.currentValue.toString()}
							keyboardType="decimal-pad"
							style={{
								backgroundColor: 'yellow',
							}}
						/>
					</View>
				)) ||
				(i.type === 'text' && (
					<View>
						<Text>{i.title}</Text>
						<TextInput
							placeholder={i.currentValue}
							keyboardType="default"
							style={{
								backgroundColor: 'orange',
							}}
						/>
					</View>
				)) ||
				(i.type === 'submenu' && (
					<View style={{ backgroundColor: 'green', paddingLeft: 10 }}>
						<Text>{i.title}</Text>
						<Text>{i.description}</Text>
						{flattenMenu(i.contents)}
					</View>
				)) ||
				(i.type === 'menu' && (
					<View style={{ backgroundColor: 'blue', paddingLeft: 10 }}>
						<Text>{i.title}</Text>
						<Text>{i.description}</Text>
						{flattenMenu(i.contents)}
					</View>
				)) || <Text style={{ backgroundColor: 'red' }}> Item type not found: {i.type}</Text>}
		</View>
	));
};

const renderSettings = settingsObj => {
	return settingsObj.settings && flattenMenu(settingsObj.settings);
};

export class PageSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settingsContent: {},
		};
	}
	componentDidMount() {
		this.setState({ settingsContent: settings.getAll() });
	}
	render() {
		return <View>{renderSettings(this.state.settingsContent)}</View>;
	}
}
