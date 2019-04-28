import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View, Switch, Text } from 'react-native';
import { database } from '../../BL/Utils/database';

const getObject = (obj, k_v) => {
	var result = null;
	if (obj instanceof Array) {
		for (var i = 0; i < obj.length; i++) {
			result = getObject(obj[i], k_v);
			if (result) {
				break;
			}
		}
	} else {
		for (var prop in obj) {
			if (prop == 'setting_key' && k_v == obj['setting_key']) {
				return obj;
			}
			if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
				result = getObject(obj[prop], k_v);
				if (result) {
					break;
				}
			}
		}
	}
	return result;
};

const saveSetting = (key, value) => {
	return (getObject(json, key).currentValue = value);
};
const getSetting = key => {
	return getObject(json, key);
};

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
		database.getSettings().then(s =>
			this.setState({
				settingsContent: s,
			})
		);
	}
	render() {
		return <View>{renderSettings(this.state.settingsContent)}</View>;
	}
}
