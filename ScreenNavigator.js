import React from "react";
import { View, Dimensions, StyleSheet, Animated } from "react-native";
import { TabView } from "react-native-tab-view";
import { MiniPlayer } from "./MiniPlayer";
import { PageHome } from "./PageHome";
import { PageSearch } from "./PageSearch";
import { PageLibrary } from "./PageLibrary";
import { TabBar, SceneMap } from "react-native-tab-view";
import Icon from "react-native-ionicons";

const { width, height } = Dimensions.get("window");

export class ScreenNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.AppInstance = this.props.AppInstance;
  }

  _renderTabBar = props => (
    <TabBar
      {...props}
      renderIcon={this._renderIcon}
      renderIndicator={this._renderIndicator}
      style={styles.tabbar}
      useNativeDriver={true}
      bounces={true}
    />
  );
  _renderIndicator = props => {
    const { width, position } = props;
    const inputRange = [
      0,
      0.48,
      0.49,
      0.51,
      0.52,
      0.52,
      1,
      1.48,
      1.49,
      1.51,
      1.52,
      2
    ];

    const scale = position.interpolate({
      inputRange,
      outputRange: inputRange.map(x => (Math.trunc(x) === x ? 2 : 0.1))
    });
    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(x => {
        const d = x - Math.trunc(x);
        return d === 0.49 || d === 0.51 ? 0 : 1;
      })
    });
    const translateX = position.interpolate({
      inputRange: inputRange,
      outputRange: inputRange.map(x => Math.round(x) * width)
    });
    const backgroundColor = position.interpolate({
      inputRange,
      outputRange: inputRange.map(
        x => props.navigationState.routes[Math.round(x)].color
      )
    });

    return (
      <Animated.View
        style={[styles.container, { width, transform: [{ translateX }] }]}
      >
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor, opacity, transform: [{ scale }] }
          ]}
        />
      </Animated.View>
    );
  };

  _renderIcon = ({ route }) => (
    <Icon name={route.icon} size={24} style={styles.icon} />
  );
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white"
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white"
          }}
        >
          <TabView
            navigationState={this.AppInstance.state}
            renderTabBar={this._renderTabBar}
            renderScene={({ route }) => {
              switch (route.key) {
                case "PAGE_HOME":
                  return <PageHome AppInstance={this.AppInstance} />;
                case "PAGE_SEARCH":
                  return <PageSearch AppInstance={this.AppInstance} />;
                case "PAGE_LIBRARY":
                  return <PageLibrary AppInstance={this.AppInstance} />;
                default:
                  return null;
              }
            }}
            onIndexChange={index =>
              this.AppInstance.setState({
                index
              })
            }
            initialLayout={{
              height: 0,
              width: width
            }}
            useNativeDriver
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },

  tabbar: {
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  icon: {
    backgroundColor: "transparent",
    color: "#000"
  },

  indicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0084ff",
    margin: 6
  }
});
