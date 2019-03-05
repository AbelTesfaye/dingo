import React from "react";
import { Text, View, Image } from "react-native";
import { TrackListComponent } from "./TrackListComponent";

export class AlbumPage extends React.Component {
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
       <TrackListComponent onTrackPress={this.props.onTrackPress} data={[
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
        ]}/>
      </View>
    );
  }
}
