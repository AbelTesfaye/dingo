import React from "react";
import { Text, View, TextInput, ScrollView } from "react-native";
import { TrackList } from "../Lists/ListTrack"
import { AlbumList } from "../Lists/ListAlbum";
import { ArtistList } from "../Lists/ListArtist";
import utils from "../../BL/Utils/utils";
import Icon from "react-native-ionicons";
export const PageSearch = props => {
  const AppInstance = props.AppInstance;
  return (<ScrollView>
    <View>
      <View style={{ 
        flexDirection: 'row',
        flex: 1,
        alignContent: 'center',
        backgroundColor: "#ffffff" }}>

        <TextInput onSubmitEditing={() => AppInstance.startSearch()} style={{
          height: 40,
          marginHorizontal: 15,
          marginTop: 15,
          flex: 1,
          backgroundColor: "#e1e3e4",
          borderRadius: 20,
          paddingStart: 15 }} onChangeText={text => AppInstance.updateSearchQueryText(text)} placeholder="Search" value={AppInstance.state
          .screenStates_screenNavigatorStates_pageSearchStates_searchQueryText} />

        <Icon name="backspace" onPress={() => AppInstance.updateSearchQueryText('')} size={25} style={{
          color: "#333",
          position: 'absolute',
          right: 22,
          top: 22,
          height: 40,
          marginHorizontal: 10
        }} />  
      </View>
      
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
