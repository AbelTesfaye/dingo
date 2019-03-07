import React from "react";
import { Text, ScrollView,BackHandler,View } from "react-native";
import { AlbumInfoPage } from "./AlbumInfoPage";
import { ArtistInfoPage } from "./ArtistInfoPage";
import { TrackListPage } from "./TrackListPage";
import { AlbumListPage } from "./AlbumListPage";
import { ArtistListPage } from "./ArtistListPage";
export class ScreenDetail extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.AppInstance.setState({
      activeScreen: "NAVIGATOR_SCREEN"
    });
    return true;
  }
  render() {
      const AppInstance = this.props.AppInstance
    return (
      <ScrollView>
        {AppInstance.state.screenStates_screenDetailStates_activePage ==
        "PAGE_ALBUM_INFO" ? (
          <AlbumInfoPage
                      AppInstance={AppInstance}

            album={{
              name: AppInstance.state
                .screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName
                .albumName,
              artistName: AppInstance.state
                .screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName
                .artistName
            }}
           
          />
        ) : AppInstance.state.screenStates_screenDetailStates_activePage ==
          "PAGE_ARTIST_INFO" ? (
          <ArtistInfoPage
            AppInstance={AppInstance}
            artist={{
              name: AppInstance.state
                .screenStates_screenDetailStates_pageArtistInfoStates_artistName
            }}
           
          />
        ) : AppInstance.state.screenStates_screenDetailStates_activePage ==
          "PAGE_TRACK_LIST" ? (
          <TrackListPage
            onTrackPress={() => {
              alert("Track pressed");
            }}
          />
        ) : AppInstance.state.screenStates_screenDetailStates_activePage ==
          "PAGE_ALBUM_LIST" ? (
          <AlbumListPage />
        ) : AppInstance.state.screenStates_screenDetailStates_activePage ==
          "PAGE_ARTIST_LIST" ? (
          <ArtistListPage />
        ) : (
          <Text>
            Could not find page:{" "}
            {AppInstance.state.screenStates_screenDetailStates_activePage}{" "}
          </Text>
        )}
      </ScrollView>
    );
  }
}
