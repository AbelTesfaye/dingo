import React from 'react';
import { View, StyleSheet } from 'react-native';

import Icon from 'react-native-ionicons';
import { MiniPlayer } from './MiniPlayer';
import Animated from 'react-native-reanimated';

export class TabBar extends React.Component {
    shouldComponentUpdate() {
        return false //TODO: fix this: probably crude, but works perfectly :D
    }
    constructor(props) {
        super(props)

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

                            <View
                                key={route.key}
                                style={{ flex: 1 }}>
                                {this._renderItem(props)({
                                    route,
                                    index,
                                })}
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    _renderItem = props => ({ route, index }) => {
        const { position } = props;

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
        return (
            <View style={{ ...styles.tab, alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={[styles.item]}>
                    {
                        <Animated.View
                            style={[
                                styles.indicator,
                                {
                                    position: 'absolute',
                                    opacity: opacity,
                                    transform: [
                                        {
                                            scale: scale
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
        return this._renderTabBar(this.props)
    }


}

const styles = StyleSheet.create({
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
    icon: {
        color: '#000',
    },

});
