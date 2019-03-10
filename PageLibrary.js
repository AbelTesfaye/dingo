import React from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { TrackList } from "./TrackList";
import utils from "./utils";
export const PageLibrary = props => {
  const AppInstance = props.AppInstance;
  return (<ScrollView>
    <View style={{ flex: 1 }}>
      {AppInstance.state
        .screenStates_screenNavigatorStates_pageLibraryStates_generatedPlaylistIsLoading ? (<ActivityIndicator animating={true} style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 10,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1
        }} size="large" />) : null}
      <View style={{
        flex: 1,
        backgroundColor: "white",
        margin: 10
      }}>
        <View style={{}}>
          <View style={{
            margin: 3
          }}>
            <Text style={{
              fontWeight: "bold",
              fontSize: 15
            }}>
              Playlist Generator
              </Text>
            <Text style={{
              fontSize: 13
            }}>
              Pick a song to generate playlist
              </Text>
          </View>
          <View style={{
            backgroundColor: "blue"
          }}>
            <TrackList maxItems={100} AppInstance={AppInstance} onTrackPress={(item, index) => {
              AppInstance.setState({
                screenStates_screenNavigatorStates_pageLibraryStates_generatedPlaylistIsLoading: true
              });
              utils.fetchFromEndpoint(`getPlaylistUsingTrack?name=${encodeURIComponent(item.name)}&artistName=${encodeURIComponent(item.artistName)}`, responseJson => {
                AppInstance.setState({
                  screenStates_screenNavigatorStates_pageLibraryStates_generatedPlaylistIsLoading: false
                });
                const tracks = responseJson.track;
                if (tracks.length < 1) {
                  alert(`Playlist could not be generated for: ${item.artistName} - ${item.name}`);
                }
                else {
                  AppInstance.startInPlayer(utils.convertToTrackPlayerFormatFromGeneratedPlaylist(tracks));
                }
              });
            }} data={AppInstance.state
              .screenStates_screenNavigatorStates_pageLibraryStates_recentTracksUniqueResponse} />
          </View>
        </View>
      </View>
    </View>
  </ScrollView>);
};
