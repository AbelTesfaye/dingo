import React from "react";
import { Text, View, Image } from "react-native";
import { TrackListComponent } from "./TrackListComponent";
import { AlbumList } from "./AlbumList";
export class ArtistPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <View
          style={{
            backgroundColor: "white",
            alignItems: "center"
          }}
        >
          <Image
            style={{
              marginTop: 50,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#ddd"
            }}
            source={require("./fire.png")}
          />
          <Text
            style={{
              margin: 50
            }}
          >
            Artist Name
          </Text>
        </View>
        <View>
          <Text
            style={{
              margin: 10
            }}
          >
            Albums
          </Text>
          <AlbumList
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
              }
            ]}
          />
          <Text
            style={{
              margin: 10
            }}
          >
            Top Tracks
          </Text>
          <TrackListComponent
            onTrackPress={this.props.onTrackPress}
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
              }
            ]}
          />
        </View>
      </View>
    );
  }
}
