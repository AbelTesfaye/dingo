import React from 'react';
import { Dimensions, StyleSheet, View, Switch, Text } from 'react-native';
import Icon from 'react-native-ionicons';
import { TabBar, TabView } from 'react-native-tab-view';
import { MiniPlayer } from '../CustomModules/JS/MiniPlayer';
import { PageHome } from '../Pages/PageHome';
import { PageLibrary } from '../Pages/PageLibrary';
import { PageSearch } from '../Pages/PageSearch';
import Animated from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';
import {database} from "../../BL/Utils/database"

const { width, height } = Dimensions.get('window');
getObject = (obj, k_v) => {
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
	return settingsObj.settings &&  flattenMenu(settingsObj.settings);
};

export class ScreenNavigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			routes: [
				{ key: 'PAGE_HOME', icon: 'home', color: [255, 132, 0] },
				{ key: 'PAGE_SEARCH', icon: 'search', color: [255, 132, 0] },
				{ key: 'PAGE_LIBRARY', icon: 'ios-albums', color: [255, 132, 0] },
				{ key: 'PAGE_SETTINGS', icon: 'settings', color: [255, 132, 0] },
			],
			settingsContent:{},
		};
		this.AppInstance = this.props.AppInstance;
	}
	componentDidMount(){
		database.getSettings().then(s=>this.setState({
			settingsContent:s
		}))
	}

	_renderTabBar = props => (
		<TabBar
			{...props}
			renderIcon={this._renderIcon}
			renderIndicator={this._renderIndicator}
			style={styles.tabbar}
			useNativeDriver={true}
		/>
	);
	_renderIndicator = props => {
		const { width, position, navigationState } = props;
		const inputRange = [0, 0.48, 0.49, 0.51, 0.52, 1, 1.48, 1.49, 1.51, 1.52, 2, 2.48, 2.49, 2.51, 2.52, 3];

		const scale = Animated.interpolate(position, {
			inputRange,
			outputRange: inputRange.map(x => (Math.trunc(x) === x ? 2 : 0.1)),
		});

		const opacity = Animated.interpolate(position, {
			inputRange,
			outputRange: inputRange.map(x => {
				const d = (x - Math.trunc(x)).toFixed(2);
				return d === (0.49).toFixed(2) || d === (0.51).toFixed(2) ? 0 : 1;
			}),
		});

		const translateX = Animated.interpolate(position, {
			inputRange: inputRange,
			outputRange: inputRange.map(x => Math.round(x) * width),
		});

		const backgroundColor = Animated.interpolate(position, {
			inputRange,
			outputRange: inputRange.map(x => Animated.color(...navigationState.routes[Math.round(x)].color)),
		});

		return (
			<Animated.View
				style={[
					styles.container,
					{
						width: `${100 / navigationState.routes.length}%`,
						transform: [{ translateX }],
					},
				]}
			>
				<Animated.View style={[styles.indicator, { opacity, backgroundColor, transform: [{ scale }] }]} />
			</Animated.View>
		);
	};

	_renderIcon = ({ route }) => <Icon name={route.icon} size={24} style={styles.icon} />;
	render() {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: 'white',
				}}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: 'white',
					}}
				>
					<TabView
						navigationState={this.state}
						renderTabBar={this._renderTabBar}
						renderScene={({ route }) => {
							switch (route.key) {
								case 'PAGE_HOME':
									return <PageHome AppInstance={this.AppInstance} />;
								case 'PAGE_SEARCH':
									return <PageSearch AppInstance={this.AppInstance} />;
								case 'PAGE_LIBRARY':
									return <PageLibrary AppInstance={this.AppInstance} />;
								case 'PAGE_SETTINGS':
									return <View>{renderSettings(this.state.settingsContent)}</View>;
								default:
									return null;
							}
						}}
						onIndexChange={index =>
							this.setState({
								index,
							})
						}
						initialLayout={{
							width: width,
						}}
						useNativeDriver={true}
					/>
				</View>

				<MiniPlayer AppInstance={this.AppInstance} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFF',
	},

	tabbar: {
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	icon: {
		backgroundColor: 'transparent',
		color: '#000',
	},
	indicator: {
		width: 48,
		height: 48,
		borderRadius: 24,
		margin: 6,
	},
});
