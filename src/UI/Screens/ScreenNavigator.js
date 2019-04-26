import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Icon from 'react-native-ionicons';
import { TabBar, TabView } from 'react-native-tab-view';
import { MiniPlayer } from '../CustomModules/JS/MiniPlayer';
import { PageHome } from '../Pages/PageHome';
import { PageLibrary } from '../Pages/PageLibrary';
import { PageSearch } from '../Pages/PageSearch';
import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export class ScreenNavigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			routes: [
				{ key: 'PAGE_HOME', icon: 'home', color: [255, 132, 0] },
				{ key: 'PAGE_SEARCH', icon: 'search', color: [255, 132, 0] },
				{ key: 'PAGE_LIBRARY', icon: 'ios-albums', color: [255, 132, 0] },
			],
		};
		this.AppInstance = this.props.AppInstance;
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
		const inputRange = [0, 0.48, 0.49, 0.51, 0.52, 1, 1.48, 1.49, 1.51, 1.52, 2];

		const scale = Animated.interpolate(position, {
			inputRange,
			outputRange: inputRange.map(x => (Math.trunc(x) === x ? 2 : 0.1)),
		});

		const opacity = Animated.interpolate(position, {
			inputRange,
			outputRange: inputRange.map(x => {
				const d = x - Math.trunc(x);
				return d === 0.49 || d === 0.51 ? 0 : 1;
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
