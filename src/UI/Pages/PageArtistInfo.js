import React from "react";
import { Image, Text, View } from "react-native";
import { AlbumList } from "../Lists/ListAlbum";
import { TrackList } from "../Lists/ListTrack";
import utils from "../../BL/Utils/utils";

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
          artistTopAlbumsResponse: (response.result)
        });
      }
    );

    utils.fetchFromEndpoint(
      `artistTopTracks?name=${encodeURIComponent(this.props.artist.name)}`,
      response => {
        this.setState({
          artistTopTracksResponse: (response.result)
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
    const AppInstance = this.props.AppInstance
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
          <AlbumList
            AppInstance={AppInstance}
            data={this.state.artistTopAlbumsResponse}
          />
          <Text
            style={{
              margin: 10
            }}
          >
            Top Tracks
          </Text>
          <TrackList
            AppInstance={AppInstance}
            onTrackPress={(item, index) =>
              AppInstance.startInPlayer(utils.convertToTrackPlayerFormat(this.state.artistTopTracksResponse.slice(index)))
            }
            data={this.state.artistTopTracksResponse}
          />
        </View>
      </View>
    );
  }
}
