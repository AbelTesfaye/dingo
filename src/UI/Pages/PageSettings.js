import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View, Switch, Text, ToastAndroid } from 'react-native';
import { settings } from '../../BL/Database/settings';

export class PageSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settingsContent: {},
		};
	}
	writeSettings = newSettingsContent => {
		settings
			.updateAll(newSettingsContent, true)
			.then(s => {
				ToastAndroid.show('Settings Saved!', ToastAndroid.SHORT);
			})
			.catch(e => console.error(e));
	};
	_handleOnTextChange = (i, text) => {
		const newSettingsContent = { ...this.state.settingsContent };
		settings.getSettingByKeyValue(newSettingsContent, i.setting_key).currentValue = text;

		this.setState({ settingsContent: newSettingsContent });
	};
	_handleOnValueChange = i => {
		const newSettingsContent = { ...this.state.settingsContent };
		const c = settings.getSettingByKeyValue(newSettingsContent, i.setting_key);
		c.currentValue = !c.currentValue;

		this.setState({ settingsContent: newSettingsContent });

		this.writeSettings(newSettingsContent);
	};
	flattenMenu = settingsArr => {
		return settingsArr.map(i => (
			<View
				style={{
					padding: 10,
				}}
			>
				{(i.type === 'boolean' && (
					<View style={{ flexDirection: 'row' }}>
						<Text>{i.title}</Text>
						<Switch
							onValueChange={() => {
								this._handleOnValueChange(i);
							}}
							value={i.currentValue}
						/>
					</View>
				)) ||
					(i.type === 'number' && (
						<View>
							<Text>{i.title}</Text>
							<TextInput
								value={i.currentValue.toString()}
								onChangeText={text => {
									this._handleOnTextChange(i, text);
								}}
								onSubmitEditing={() => {
									this.writeSettings(this.state.settingsContent);
								}}
								placeholder={i.defaultValue.toString()}
								keyboardType="decimal-pad"
								style={{
									backgroundColor: '#eee',
								}}
							/>
						</View>
					)) ||
					(i.type === 'text' && (
						<View>
							<Text>{i.title}</Text>
							<TextInput
								value={i.currentValue}
								onChangeText={text => {
									this._handleOnTextChange(i, text);
								}}
								onSubmitEditing={() => {
									this.writeSettings(this.state.settingsContent);
								}}
								placeholder={i.defaultValue}
								keyboardType="default"
								style={{
									backgroundColor: '#eee',
								}}
							/>
						</View>
					)) ||
					(i.type === 'submenu' && (
						<View style={{ borderLeftWidth: 5, borderColor: '#f57f17', paddingLeft: 10 }}>
							<Text style={{ fontWeight: 'bold' }}>{i.title}</Text>
							<Text>{i.description}</Text>
							{this.flattenMenu(i.contents)}
						</View>
					)) ||
					(i.type === 'menu' && (
						<View style={{ borderLeftWidth: 5, borderColor: '#fbc02d', paddingLeft: 5 }}>
							<Text style={{ fontWeight: 'bold' }}>{i.title}</Text>
							<Text>{i.description}</Text>
							{this.flattenMenu(i.contents)}
						</View>
					)) || <Text style={{ backgroundColor: 'red' }}> Item type not found: {i.type}</Text>}
			</View>
		));
	};

	renderSettings = settingsObj => {
		return settingsObj.settings && this.flattenMenu(settingsObj.settings);
	};

	componentDidMount() {
		this.setState({ settingsContent: settings.getAll() });
	}
	render() {
		return <View>{this.renderSettings(this.state.settingsContent)}</View>;
	}
}
