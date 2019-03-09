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
      activeScreen: "SCREEN_NAVIGATOR"
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
            data={AppInstance.state.screenStates_screenDetailStates_pageTrackListStates_tracks}
            AppInstance={AppInstance}
          />
        ) : AppInstance.state.screenStates_screenDetailStates_activePage ==
          "PAGE_ALBUM_LIST" ? (
          <AlbumListPage AppInstance={AppInstance} data={AppInstance.state.screenStates_screenDetailStates_pageAlbumListStates_albums}/>
        ) : AppInstance.state.screenStates_screenDetailStates_activePage ==
          "PAGE_ARTIST_LIST" ? (
          <ArtistListPage AppInstance={AppInstance} data={AppInstance.state.screenStates_screenDetailStates_pageArtistListStates_artists} />
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
