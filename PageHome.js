import React from "react";
import { Text, View, ScrollView } from "react-native";
import { TrackList } from "./TrackList";
import { AlbumList } from "./AlbumList";
import utils from "./utils";
export const PageHome = props => {
  const AppInstance = props.AppInstance;
  return (<ScrollView>
    <View style={{ flex: 1 }}>
      <View style={{
        flex: 1,
        backgroundColor: "white",
        margin: 10
      }}>
        <View style={{}}>
          <Text style={{
            fontWeight: "bold",
            margin: 10,
            fontSize: 15
          }}>
            From Last Time
            </Text>
          <View style={{
            backgroundColor: "blue"
          }}>
            <TrackList maxItems={5} AppInstance={AppInstance} onTrackPress={(item, index) => AppInstance.startInPlayer(utils.convertToTrackPlayerFormat(AppInstance.state.screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse.slice(index)))} data={AppInstance.state
              .screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse} />
          </View>
        </View>

        <View style={{}}>
          <Text style={{
            fontWeight: "bold",
            margin: 10,
            fontSize: 15
          }}>
            Similar Albums
            </Text>
          <View style={{
            backgroundColor: "blue"
          }}>
            <AlbumList data={AppInstance.state
              .screenStates_screenNavigatorStates_pageHomeStates_similarAlbumsResponse} AppInstance={AppInstance} maxItems={5} />
          </View>
        </View>

        <View style={{}}>
          <Text style={{
            fontWeight: "bold",
            margin: 10,
            fontSize: 15
          }}>
            Top Tracks Chart
            </Text>
          <View style={{
            backgroundColor: "blue"
          }}>
            <TrackList maxItems={10} AppInstance={AppInstance} onTrackPress={(item, index) => AppInstance.startInPlayer(utils.convertToTrackPlayerFormat(AppInstance.state.screenStates_screenNavigatorStates_pageHomeStates_topTracksChartResponse.slice(index)))} data={AppInstance.state
              .screenStates_screenNavigatorStates_pageHomeStates_topTracksChartResponse} />
          </View>
        </View>
      </View>
    </View>

    <Text style={{
      textAlign: "center",
      color: "#ddd",
      margin: 5
    }}>
      Hit me up here for any comments, suggestions, (thank you)s or just about
      anything:
      </Text>
    <Text style={{
      textAlign: "center",
      color: "#ddd",
      margin: 5
    }}>
      abeltesfaye45@gmail.com
      </Text>
  </ScrollView>);
};
