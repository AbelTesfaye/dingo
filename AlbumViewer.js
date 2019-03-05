import React from "react";
import { Text, View, Image, FlatList } from "react-native";
import { TrackComponent } from "./TrackComponent";
export class AlbumViewer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#ddd"
            }}
            source={require("./fire.png")}
          />
          <Text
            style={{
              fontWeight: "bold",
              margin: 50
            }}
          >
            Album Name
          </Text>
        </View>

        <Text
          style={{
            margin: 10
          }}
        >
          Tracks
        </Text>
        <FlatList
          keyExtractor={(item, index) => item.key}
          style={{
            backgroundColor: "white"
          }}
          data={[
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            }
          ]}
          renderItem={({ item, index }) => {
            return (
              <TrackComponent
              onTrackPress={this.props.onTrackPress}
                item={item}
                index={index}
              />
            );
          }}
        />
      </View>
    );
  }
}
