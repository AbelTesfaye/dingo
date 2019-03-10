import React from "react";
import { Text, View, TextInput, ScrollView } from "react-native";
import { TrackList } from "./TrackList";
import { AlbumList } from "./AlbumList";
import { ArtistList } from "./ArtistList";
import utils from "./utils";
export const PageSearch = props => {
  const AppInstance = props.AppInstance;
  return (<ScrollView>
    <View>
      <TextInput onSubmitEditing={() => AppInstance._startSearch()} style={{
        height: 40,
        margin: 10,
        backgroundColor: "#efefef"
      }} onChangeText={text => AppInstance._updateSearchQueryText(text)} placeholder="Search" value={AppInstance.state
        .screenStates_screenNavigatorStates_pageSearchStates_searchQueryText} />
      <View style={{ margin: 10 }}>
        <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
          Artists
          </Text>

        <View style={{ marginHorizontal: 10 }}>
          <ArtistList data={AppInstance.state
            .screenStates_screenNavigatorStates_pageSearchStates_searchQueryArtistsResponse} AppInstance={AppInstance} maxItems={2} />
        </View>

        <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
          Albums
          </Text>
        <View style={{ marginHorizontal: 10 }}>
          <AlbumList data={AppInstance.state
            .screenStates_screenNavigatorStates_pageSearchStates_searchQueryAlbumsResponse} AppInstance={AppInstance} maxItems={4} />
        </View>
        <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
          Tracks
          </Text>
        <View style={{ marginHorizontal: 10 }}>
          <TrackList data={AppInstance.state
            .screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse} onTrackPress={(item, index) => AppInstance.startInPlayer(utils.convertToTrackPlayerFormat(AppInstance.state.screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse.slice(index)))} AppInstance={AppInstance} maxItems={10} />
        </View>


      </View>
    </View>
  </ScrollView>);
};
