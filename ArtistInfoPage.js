import React from "react";
import { Text, View, Image, ImageBackground } from "react-native";
import { TrackList } from "./TrackList";
import { AlbumList } from "./AlbumList";
import shortid from "shortid";
import utils from "./utils"

export class ArtistInfoPage extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      artistInfoResponse: null,
      artistTopAlbumsResponse: null,
      artistTopTracksResponse: null
    };
  }

  componentDidMount = () => {
    utils.fetchFromEndpoint(
      `artistTopAlbums?name=${encodeURIComponent(this.props.artist.name)}`,
      response => {
        this.setState({
          artistTopAlbumsResponse: utils.insertKeyToArrayItems(response.result)
        });
      }
    );

    utils.fetchFromEndpoint(
      `artistTopTracks?name=${encodeURIComponent(this.props.artist.name)}`,
      response => {
        this.setState({
          artistTopTracksResponse: utils.insertKeyToArrayItems(response.result)
        });
      }
    );

    utils.fetchFromEndpoint(
      `artistInfo?name=${encodeURIComponent(this.props.artist.name)}`,
      response => {
        this.setState({
          artistInfoResponse: response
        });
      }
    );
  };

  render() {
    return (
      <View>
        <Image
          resizeMethod="resize"
          blurRadius={3}
          source={{
            uri: this.state.artistInfoResponse
              ? this.state.artistInfoResponse.images[
                  this.state.artistInfoResponse.images.length - 1
                ]
              : null
          }}
          style={{
            flex: 1,
            resizeMode: "cover",
            height: 150
          }}
        />

        <View>
          <View style={{ alignItems: "center", backgroundColor: "#fff" }}>
            <Image
              style={{
                position: "absolute",
                top: -50,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#ddd"
              }}
              source={{
                uri: this.state.artistInfoResponse
                  ? this.state.artistInfoResponse.images[
                      this.state.artistInfoResponse.images.length - 1
                    ]
                  : null
              }}
            />
            <Text
              style={{
                margin: 10,
                marginTop: 60
              }}
            >
              {this.props.artist.name}
            </Text>
          </View>
          <Text
            style={{
              margin: 10
            }}
          >
            Albums
          </Text>
          <AlbumList data={this.state.artistTopAlbumsResponse} />
          <Text
            style={{
              margin: 10
            }}
          >
            Top Tracks
          </Text>
          <TrackList
            onTrackPress={this.props.onTrackPress}
            data={this.state.artistTopTracksResponse}
          />
        </View>
      </View>
    );
  }
}
