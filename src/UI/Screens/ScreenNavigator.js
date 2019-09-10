import React from 'react';
import { Dimensions, View } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { PageHome } from '../Pages/PageHome';
import { PageLibrary } from '../Pages/PageLibrary';
import { PageSearch } from '../Pages/PageSearch';
import { PageSettings } from '../Pages/PageSettings';
import {TabBar} from '../CustomModules/JS/TabBar';

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
	}

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
						renderTabBar={p => <TabBar {...p} width={width} />}
						tabBarPosition={'bottom'}
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
