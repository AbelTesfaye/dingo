import React from 'react';
import { Dimensions, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-ionicons';
import { TabView } from 'react-native-tab-view';
import { MiniPlayer } from '../CustomModules/JS/MiniPlayer';
import { PageHome } from '../Pages/PageHome';
import { PageLibrary } from '../Pages/PageLibrary';
import { PageSearch } from '../Pages/PageSearch';
import { PageSettings } from '../Pages/PageSettings';
import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export class ScreenNavigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			routes: [
				{ key: 'PAGE_HOME', icon: 'home', color: '#ff8400' },
				{ key: 'PAGE_SEARCH', icon: 'search', color: '#ff8400' },
				{ key: 'PAGE_LIBRARY', icon: 'ios-albums', color: '#ff8400' },
				{ key: 'PAGE_SETTINGS', icon: 'settings', color: '#ff8400' },
			],
		};
		this.AppInstance = this.props.AppInstance;
		this.disableAnimations = true;
	}

	_renderTabBar = props => {
		return (
			<View
				style={{
					justifyContent: 'center',
				}}
			>
				<MiniPlayer style={{}} AppInstance={this.AppInstance} />
				<View style={{ ...styles.tabbar }}>
					{props.navigationState.routes.map((route, index) => {
						return (
							<TouchableWithoutFeedback
								key={route.key}
								onPress={() => {
									this.disableAnimations = true;
									props.jumpTo(route.key);
									this.forceUpdate();
								}}
							>
								<View style={{ flex: 1 }}>
									{this._renderItem({ ...props, disableAnimations: this.disableAnimations })({
										route,
										index,
									})}
								</View>
							</TouchableWithoutFeedback>
						);
					})}
				</View>
			</View>
		);
	};

	_renderItem = props => ({ route, index }) => {
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
				return d === (0.49).toFixed(2) || d === (0.51).toFixed(2) || Math.round(x) !== index ? 0 : 1;
			}),
		});
		disableAnimations = props.disableAnimations;
		return (
			<View style={{ ...styles.tab, alignItems: 'center', justifyContent: 'center' }}>
				<Animated.View style={[styles.item]}>
					{
						<Animated.View
							style={[
								styles.indicator,
								{
									position: 'absolute',
									opacity: disableAnimations
										? props.navigationState.index === index
											? 1
											: 0
										: opacity,
									transform: [
										{
											scale: disableAnimations
												? index === props.navigationState.index
													? 2
													: 0
												: scale,
										},
									],
									backgroundColor: route.color,
								},
							]}
						/>
					}
					{this._renderIcon({ route })}
				</Animated.View>
			</View>
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
						renderTabBar={p => this._renderTabBar({ ...p, width: width })}
						tabBarPosition={'bottom'}
						onSwipeStart={() => {
							this.disableAnimations = false;
							this.forceUpdate();
						}}
						onSwipeEnd={() => {
							this.disableAnimations = true;
						}}
						renderScene={({ route }) => {
							switch (route.key) {
								case 'PAGE_HOME':
									return <PageHome AppInstance={this.AppInstance} />;
								case 'PAGE_SEARCH':
									return <PageSearch AppInstance={this.AppInstance} />;
								case 'PAGE_LIBRARY':
									return <PageLibrary AppInstance={this.AppInstance} />;
								case 'PAGE_SETTINGS':
									return <PageSettings AppInstance={this.AppInstance} />;
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

	indicator: {
		width: 48,
		height: 48,
		borderRadius: 24,
		margin: 6,
	},
	tabbar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#fafafa',
		height: 48,
		overflow: 'hidden',

		elevation: 4,
		shadowColor: 'black',
		shadowOpacity: 0.1,
		shadowRadius: StyleSheet.hairlineWidth,
		shadowOffset: {
			height: StyleSheet.hairlineWidth,
		},
		zIndex: 1,
	},
	tab: {
		flex: 1,
		alignItems: 'center',
	},
	item: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	activeItem: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	icon: {
		color: '#000',
	},
	label: {
		fontSize: 10,
		marginTop: 3,
		marginBottom: 1.5,
		backgroundColor: 'transparent',
	},
});
