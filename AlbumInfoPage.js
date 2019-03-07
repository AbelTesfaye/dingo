import React from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableNativeFeedback
} from "react-native";
import { TrackList } from "./TrackList";
import utils from "./utils";

export class AlbumInfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albumInfo: null
    };
  }
  componentDidMount = () => {
    utils.fetchFromEndpoint(
      `albumInfo?artistName=${encodeURIComponent(
        this.props.album.artistName
      )}&name=${encodeURIComponent(this.props.album.name)}`,
      response => {
        console.log("response: " + response);
        this.setState({
          albumInfo: response
        });
      }
    );
  };
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
            source={{
              uri: this.state.albumInfo
                ? this.state.albumInfo.images[
                    this.state.albumInfo.images.length - 1
                  ]
                : null
            }}
          />
          <Text
            style={{
              fontWeight: "bold",
              margin: 50
            }}
          >
            {this.props.album.artistName + ": " + this.props.album.name}
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
          data={
            this.state.albumInfo
              ? utils.insertKeyToArrayItems(this.state.albumInfo.tracks)
              : null
          }
          renderItem={({ item, index }) => {
            return (
              <TouchableNativeFeedback
                onPress={() =>
                  this.props.onTrackPress(this.props.item, this.props.index)
                }
              >
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    margin: 5
                  }}
                >
                  <View
                    style={{
                      marginHorizontal: 10,
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      flex: 1
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold"
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text style={{}}>{item.artistName}</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
            );
          }}
        />
      </View>
    );
  }
}
