import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
  Animated
} from "react-native";
import shortid from "shortid";
import Player from "./Player";
import TrackPlayer from "react-native-track-player";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import Icon from "react-native-ionicons";
import { MiniPlayerProgressBar } from "./MiniPlayerProgressBar";
import { TrackItem } from "./TrackItem";
import { AlbumInfoPage } from "./AlbumInfoPage";
import { AlbumList } from "./AlbumList";
import { ArtistInfoPage } from "./ArtistInfoPage";
import { TrackListPage } from "./TrackListPage";
import { AlbumItem } from "./AlbumItem";
import { AlbumListPage } from "./AlbumListPage";
import { ArtistListPage } from "./ArtistListPage";
import utils from "./utils";

const { width, height } = Dimensions.get("window");

type Props = {};

const HomePage = props => {
  _pad = (n, width, z) => {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  };

  const AppInstance = props.AppInstance;
  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            margin: 10
          }}
        >
          <View style={{}}>
            <Text
              style={{
                fontWeight: "bold",
                margin: 10,
                fontSize: 15
              }}
            >
              Similar Playlists
            </Text>
            <View
              style={{
                backgroundColor: "blue"
              }}
            >
              <FlatList
                keyExtractor={(item, index) => item.key}
                horizontal={true}
                style={{
                  backgroundColor: "white"
                }}
                data={[
                  { key: "a" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" }
                ]}
                renderItem={item => {
                  return (
                    <View
                      style={{
                        backgroundColor: "white",
                        elevation: 5,
                        margin: 5,
                        padding: 5,

                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        style={{
                          width: 100,
                          height: 100,
                          backgroundColor: "#ddd"
                        }}
                        source={require("./fire.png")}
                      />
                      <Text
                        style={{
                          flex: 1,
                          textAlignVertical: "bottom",
                          fontWeight: "bold"
                        }}
                      >
                        Item name {item.key}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          textAlignVertical: "bottom"
                        }}
                      >
                        Playlist • 50+ Tracks
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>

          <View style={{}}>
            <Text
              style={{
                fontWeight: "bold",
                margin: 10,
                fontSize: 15
              }}
            >
              New Released Tracks
            </Text>
            <View
              style={{
                backgroundColor: "blue"
              }}
            >
              <FlatList
                keyExtractor={(item, index) => item.key}
                ListFooterComponent={() => {
                  return (
                    <Text
                      style={{
                        marginTop: 10,
                        textAlign: "center"
                      }}
                    >
                      Show more
                    </Text>
                  );
                }}
                style={{
                  backgroundColor: "white"
                }}
                data={
                  AppInstance.state
                    .screenStates_screenNavigatorStates_pageHomeStates_newReleasedTracksResponse
                }
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        backgroundColor: "white",
                        flexDirection: "row",
                        margin: 5
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          textAlignVertical: "center",
                          margin: 5,
                          width: 30
                        }}
                      >
                        {`#${_pad(index + 1, 2, " ")}  `}
                      </Text>
                      <Image
                        style={{
                          backgroundColor: "#ddd",
                          width: 50,
                          height: 50
                        }}
                        source={{ uri: item.images[0] }}
                      />
                      <View
                        style={{
                          marginHorizontal: 10,
                          justifyContent: "flex-start",
                          alignItems: "flex-start"
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                        <Text>{item.artistName}</Text>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </View>

          <View style={{}}>
            <Text
              style={{
                fontWeight: "bold",
                margin: 10,
                fontSize: 15
              }}
            >
              Recent
            </Text>
            <View
              style={{
                backgroundColor: "blue"
              }}
            >
              <FlatList
                keyExtractor={(item, index) => item.key}
                horizontal={true}
                style={{
                  backgroundColor: "white"
                }}
                data={[
                  { key: "a" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" },
                  { key: "b" }
                ]}
                renderItem={item => {
                  return (
                    <View
                      style={{
                        backgroundColor: "white",
                        elevation: 5,
                        margin: 5,
                        padding: 5,

                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        style={{
                          width: 100,
                          height: 100,
                          backgroundColor: "#ddd"
                        }}
                        source={require("./fire.png")}
                      />
                      <Text
                        style={{
                          flex: 1,
                          textAlignVertical: "bottom",
                          fontWeight: "bold"
                        }}
                      >
                        Item name {item.key}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          textAlignVertical: "bottom"
                        }}
                      >
                        Item type • {item.key}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>

          <View style={{}}>
            <Text
              style={{
                fontWeight: "bold",
                margin: 10,
                fontSize: 15
              }}
            >
              Most Played Tracks
            </Text>
            <View
              style={{
                backgroundColor: "blue"
              }}
            >
              <FlatList
                keyExtractor={(item, index) => item.key}
                ListFooterComponent={() => {
                  return (
                    <Text
                      style={{
                        marginTop: 10,
                        textAlign: "center"
                      }}
                    >
                      Show more
                    </Text>
                  );
                }}
                style={{
                  backgroundColor: "white"
                }}
                data={[{ key: "a" }, { key: "b" }, { key: "b" }]}
                renderItem={item => {
                  return (
                    <View
                      style={{
                        backgroundColor: "white",
                        flexDirection: "row",
                        margin: 5
                      }}
                    >
                      <Image
                        style={{
                          backgroundColor: "#ddd",
                          width: 50,
                          height: 50
                        }}
                        source={require("./fire.png")}
                      />
                      <View
                        style={{
                          marginHorizontal: 10,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          some Item name {item.key}
                        </Text>
                        <Text>some Item name {item.key}</Text>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const SearchPage = props => {
  const AppInstance = props.AppInstance;
  return (
    <ScrollView>
      <View>
        <TextInput
          onSubmitEditing={() => AppInstance._startSearch()}
          style={{
            height: 40,
            margin: 10,
            backgroundColor: "#efefef"
          }}
          onChangeText={text => AppInstance._updateSearchQueryText(text)}
          placeholder="Search"
          value={
            AppInstance.state
              .screenStates_screenNavigatorStates_pageSearchStates_searchQueryText
          }
        />
        <View style={{ margin: 10 }}>
          <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
            Artists
          </Text>

          <View style={{ marginHorizontal: 10 }}>
            <ArtistListPage
              data={
                AppInstance.state
                  .screenStates_screenNavigatorStates_pageSearchStates_searchQueryArtistsResponse
              }
              AppInstance={AppInstance}
            />
          </View>

          <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
            Albums
          </Text>
          <View style={{ marginHorizontal: 10 }}>
            <AlbumList
              data={
                AppInstance.state
                  .screenStates_screenNavigatorStates_pageSearchStates_searchQueryAlbumsResponse
              }
              AppInstance={AppInstance}
            />
          </View>
          <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
            Tracks
          </Text>
          <View style={{ marginHorizontal: 10 }}>
            <FlatList
              keyExtractor={(item, index) => item.key}
              style={{
                backgroundColor: "white"
              }}
              ListFooterComponent={() => {
                return (
                  <Text style={{ marginTop: 10, textAlign: "center" }}>
                    Show more
                  </Text>
                );
              }}
              data={
                AppInstance.state
                  .screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse
              }
              renderItem={({ item, index }) => {
                return (
                  <TrackItem
                    onTrackPress={AppInstance._onSearchTracksPress}
                    item={item}
                    index={index}
                  />
                );
              }}
            />
          </View>
          <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
            YouTube
          </Text>
          <View style={{ marginHorizontal: 10 }}>
            <FlatList
              keyExtractor={(item, index) => item.key}
              style={{
                backgroundColor: "white"
              }}
              ListFooterComponent={() => {
                return (
                  <Text style={{ marginTop: 10, textAlign: "center" }}>
                    Show more
                  </Text>
                );
              }}
              data={
                AppInstance.state
                  .screenStates_screenNavigatorStates_pageSearchStates_searchQueryYouTubeResponse
              }
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      backgroundColor: "white",
                      flexDirection: "row",
                      marginVertical: 5
                    }}
                  >
                    <Image
                      style={{
                        backgroundColor: "#ddd",
                        width: 100,
                        height: 70
                      }}
                      source={{ uri: item.YTTumbnail }}
                    />
                    <View
                      style={{
                        backgroundColor: "white",
                        flex: 1,
                        margin: 10
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: "bold",
                          textAlignVertical: "center"
                        }}
                      >
                        {item.YTTitle}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const LibraryPage = props => (
  <View>
    <Text> My Library is active</Text>
  </View>
);

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "home", icon: "home", color: "#F44336" },
        { key: "search", icon: "search", color: "#3F51B5" },
        { key: "library", icon: "ios-albums", color: "#4CAF50" }
      ],

      activeScreen: null,

      screenStates_screenNavigatorStates_newQueueItems: [],

      screenStates_screenNavigatorStates_pageHomeStates_newReleasedTracksResponse: null,

      screenStates_screenNavigatorStates_pageSearchStates_searchQueryText: null,

      screenStates_screenNavigatorStates_pageSearchStates_searchQueryArtistsResponse: null,
      screenStates_screenNavigatorStates_pageSearchStates_searchQueryAlbumsResponse: null,
      screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse: null,
      screenStates_screenNavigatorStates_pageSearchStates_searchQueryYouTubeResponse: null,

      screenStates_screenPlayerStates_pageQueueStates_tracksInQueue: [],
      screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack: {},
      screenStates_screenPlayerStates_pageQueueStates_playerState: "",
      screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex: 0,

      screenStates_screenDetailStates_activePage: null,
      screenStates_screenDetailStates_pageArtistInfoStates_artistName: null,
      screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName: null
    };
  }
  componentDidMount = () => {
    this.getNewReleasedTracksAndPutThemInState();

    this._onTrackChanged = TrackPlayer.addEventListener(
      "playback-track-changed",
      async data => {
        if (data.nextTrack) {
          const track = await TrackPlayer.getTrack(data.nextTrack);

          this.setState({
            screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack: track
          });
        }
        this._getTrackPlayerQueueToState();
        this._updateCurrentPlayingTrackState();
      }
    );

    this._onStateChanged = TrackPlayer.addEventListener(
      "playback-state",
      data => {
        this.setState({
          screenStates_screenPlayerStates_pageQueueStates_playerState:
            data.state
        });

        this._getTrackPlayerQueueToState();
      }
    );
  };

  componentWillUnmount() {
    this._onTrackChanged.remove();
    this._onStateChanged.remove();
  }

  _getCurrentTrackId = callback => {
    TrackPlayer.getCurrentTrack()
      .then(trackid => {
        callback(trackid);
      })
      .catch(e => console.error(e));
  };

  _getTrackPlayerQueueToState = () => {
    TrackPlayer.getQueue()
      .then(tracks => {
        this.setState({
          screenStates_screenPlayerStates_pageQueueStates_tracksInQueue: tracks
        });
      })
      .catch(e => console.error(e));
  };

  _updateIndexOfCurrentPlayingItemState = () => {
    this.state.screenStates_screenPlayerStates_pageQueueStates_tracksInQueue.map(
      (item, index) => {
        if (
          item.id ===
          this.state
            .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
            .id
        ) {
          this.setState({
            screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex: index
          });
        }
      }
    );
  };

  _updateCurrentPlayingTrackState = () => {
    this._getCurrentTrackId(trackid => {
      TrackPlayer.getTrack(trackid)
        .then(track => {
          this.setState({
            screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack: track
          });
          this._updateIndexOfCurrentPlayingItemState();
        })
        .catch(e => console.log(e));
    });
  };

  _updateSearchQueryText = query => {
    this.setState({
      screenStates_screenNavigatorStates_pageSearchStates_searchQueryText: query
    });
  };

  _searchArtists = (query, callback) => {
    utils.fetchFromEndpoint(
      `searchArtist?q=${encodeURIComponent(query)}`,
      responseJson => {
        callback(responseJson);
      }
    );
  };
  _searchAlbums = (query, callback) => {
    utils.fetchFromEndpoint(
      `searchAlbum?q=${encodeURIComponent(query)}`,
      responseJson => {
        callback(responseJson);
      }
    );
  };
  _searchTracks = (query, callback) => {
    utils.fetchFromEndpoint(
      `searchTrack?q=${encodeURIComponent(query)}`,
      responseJson => {
        callback(responseJson);
      }
    );
  };
  _searchYouTube = (query, callback) => {
    utils.fetchFromEndpoint(
      `searchYouTube?q=${encodeURIComponent(query)}`,
      responseJson => {
        callback(responseJson);
      }
    );
  };

  _getNewReleasedTracks = callback => {
    utils.fetchFromEndpoint(`getChartTopTracks`, responseJson => {
      callback(responseJson);
    });
  };
  getNewReleasedTracksAndPutThemInState = () => {
    this._getNewReleasedTracks(responseJson => {
      const results = utils.insertKeyToArrayItems(responseJson.result);
      this.setState({
        screenStates_screenNavigatorStates_pageHomeStates_newReleasedTracksResponse: results
      });
    });
  };

  _getVideo = (artistName, songName, callback) => {
    utils.fetchFromEndpointWithoutParsing(
      `getVideo?artist=${encodeURIComponent(
        artistName
      )}&song=${encodeURIComponent(songName)}`,
      response => {
        callback(response);
      }
    );
  };

  _convertToTrackPlayerFormat = tracks => {
    newTracks = [];
    tracks.map(item => {
      newTracks.push({
        key: item.key,
        id: item.key,
        title: item.name,
        artist: item.artistName,
        artwork: item.images[item.images.length - 1]
      });
    });
    return newTracks;
  };
  _onSearchTracksPress = (track, index) => {
    // playlistItems = [track];
    playlistItems = this.state
      .screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse;
    playlistItems = utils.insertKeyToArrayItems(playlistItems);

    playlistItems = this._convertToTrackPlayerFormat(playlistItems);

    this.setState({
      screenStates_screenNavigatorStates_newQueueItems: playlistItems.slice(
        index
      ),
      activeScreen: "PLAYER_SCREEN"
    });
  };
  _startSearch = () => {
    const query = this.state
      .screenStates_screenNavigatorStates_pageSearchStates_searchQueryText;
    console.log("Searching for: " + query);

    this._searchArtists(query, responseJson => {
      console.log("Artists responseJson: " + JSON.stringify(responseJson));

      const results = responseJson.result.map(i => ({
        ...i,
        key: shortid.generate()
      }));

      this.setState({
        screenStates_screenNavigatorStates_pageSearchStates_searchQueryArtistsResponse: results
      });
    });

    this._searchAlbums(query, responseJson => {
      console.log("Albums responseJson: " + JSON.stringify(responseJson));
      const results = responseJson.result.map(i => ({
        ...i,
        key: shortid.generate()
      }));
      this.setState({
        screenStates_screenNavigatorStates_pageSearchStates_searchQueryAlbumsResponse: results
      });
    });

    this._searchTracks(query, responseJson => {
      console.log("Tracks responseJson: " + JSON.stringify(responseJson));
      const results = responseJson.result.map(i => ({
        ...i,
        key: shortid.generate()
      }));
      this.setState({
        screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse: results
      });
    });

    this._searchYouTube(query, responseJson => {
      console.log(
        "_searchYouTube responseJson: " + JSON.stringify(responseJson)
      );
      const results = responseJson.results.map(i => ({
        ...i,
        key: shortid.generate()
      }));
      this.setState({
        screenStates_screenNavigatorStates_pageSearchStates_searchQueryYouTubeResponse: results
      });
    });
  };

  _showArtistInfo = artistName => {
    this.setState({
      activeScreen: "DETAIL_SCREEN",
      screenStates_screenDetailStates_activePage: "PAGE_ARTIST_INFO",

      screenStates_screenDetailStates_pageArtistInfoStates_artistName: artistName
    });
  };

  _showAlbumInfo = (artistName, albumName) => {
    this.setState({
      activeScreen: "DETAIL_SCREEN",
      screenStates_screenDetailStates_activePage: "PAGE_ALBUM_INFO",

      screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName: {
        artistName,
        albumName
      }
    });
  };

  _renderTabBar = props => (
    <TabBar
      {...props}
      renderIcon={this._renderIcon}
      renderIndicator={this._renderIndicator}
      style={styles.tabbar}
      useNativeDriver={true}
      bounces={true}
    />
  );
  _renderIndicator = props => {
    const { width, position } = props;
    const inputRange = [
      0,
      0.48,
      0.49,
      0.51,
      0.52,
      0.52,
      1,
      1.48,
      1.49,
      1.51,
      1.52,
      2
    ];

    const scale = position.interpolate({
      inputRange,
      outputRange: inputRange.map(x => (Math.trunc(x) === x ? 2 : 0.1))
    });
    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(x => {
        const d = x - Math.trunc(x);
        return d === 0.49 || d === 0.51 ? 0 : 1;
      })
    });
    const translateX = position.interpolate({
      inputRange: inputRange,
      outputRange: inputRange.map(x => Math.round(x) * width)
    });
    const backgroundColor = position.interpolate({
      inputRange,
      outputRange: inputRange.map(
        x => props.navigationState.routes[Math.round(x)].color
      )
    });

    return (
      <Animated.View
        style={[styles.container, { width, transform: [{ translateX }] }]}
      >
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor, opacity, transform: [{ scale }] }
          ]}
        />
      </Animated.View>
    );
  };

  _renderIcon = ({ route }) => (
    <Icon name={route.icon} size={24} style={styles.icon} />
  );

  render() {
    const miniPlayerTrack = this.state
      .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack;

    return (
      <View style={{ flex: 1 }}>
        {this.state.activeScreen == "NAVIGATOR_SCREEN" ||
        this.state.activeScreen == null ? (
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
              <TabView
                navigationState={this.state}
                renderTabBar={this._renderTabBar}
                renderScene={({ route }) => {
                  switch (route.key) {
                    case "home":
                      return <HomePage AppInstance={this} />;
                    case "search":
                      return <SearchPage AppInstance={this} />;
                    case "library":
                      return <LibraryPage AppInstance={this} />;
                    default:
                      return null;
                  }
                }}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{
                  height: 0,
                  width: width
                }}
                useNativeDriver
              />
            </View>
            {this.state
              .screenStates_screenPlayerStates_pageQueueStates_playerState !==
            TrackPlayer.STATE_NONE ? (
              <TouchableNativeFeedback
                onPress={() => {
                  this.setState({
                    activeScreen: "PLAYER_SCREEN",
                    screenStates_screenNavigatorStates_newQueueItems: []
                  });
                }}
              >
                <View
                  elevation={5}
                  style={{
                    width: width,
                    height: 55,
                    backgroundColor: "white"
                  }}
                >
                  <MiniPlayerProgressBar style={{ zIndex: 1 }} />

                  <View
                    style={{
                      height: 50,
                      backgroundColor: "#fafafa",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      style={{
                        height: 50,
                        width: 50
                      }}
                      source={{
                        uri: miniPlayerTrack.artwork
                      }}
                    />

                    <View
                      style={{
                        marginHorizontal: 10,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        flex: 1
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={{
                          fontWeight: "bold"
                        }}
                      >
                        {miniPlayerTrack.title}
                      </Text>

                      <Text numberOfLines={1} ellipsizeMode={"tail"} style={{}}>
                        {miniPlayerTrack.artist}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableNativeFeedback>
            ) : null}
          </View>
        ) : this.state.activeScreen == "PLAYER_SCREEN" ? (
          <Player
            AppInstance={this}
            tracks={this.state.screenStates_screenNavigatorStates_newQueueItems}
            indexToStartAt={1}
          />
        ) : this.state.activeScreen == "DETAIL_SCREEN" ? (
          <ScrollView>
            {this.state.screenStates_screenDetailStates_activePage ==
            "PAGE_ALBUM_INFO" ? (
              <AlbumInfoPage
                album={{
                  name: this.state
                    .screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName
                    .albumName,
                  artistName: this.state
                    .screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName
                    .artistName
                }}
                onTrackPress={() => {
                  alert("Track pressed");
                }}
              />
            ) : this.state.screenStates_screenDetailStates_activePage ==
              "PAGE_ARTIST_INFO" ? (
              <ArtistInfoPage
                artist={{
                  name: this.state
                    .screenStates_screenDetailStates_pageArtistInfoStates_artistName
                }}
                onTrackPress={() => {
                  alert("Track pressed");
                }}
              />
            ) : this.state.screenStates_screenDetailStates_activePage ==
              "PAGE_TRACK_LIST" ? (
              <TrackListPage
                onTrackPress={() => {
                  alert("Track pressed");
                }}
              />
            ) : this.state.screenStates_screenDetailStates_activePage ==
              "PAGE_ALBUM_LIST" ? (
              <AlbumListPage />
            ) : this.state.screenStates_screenDetailStates_activePage ==
              "PAGE_ARTIST_LIST" ? (
              <ArtistListPage />
            ) : (
              <Text>
                Could not find page:{" "}
                {this.state.screenStates_screenDetailStates_activePage}{" "}
              </Text>
            )}
          </ScrollView>
        ) : (
          <Text style={styles.welcome}>Unknown screen</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },

  viewPagerItem: {
    backgroundColor: "white",
    height: 50,
    justifyContent: "center",
    flex: 1,
    alignItems: "center"
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover" // or 'stretch'
  },
  tabbar: {
    backgroundColor: "#263238",
    overflow: "hidden"
  },
  icon: {
    backgroundColor: "transparent",
    color: "white"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8
  },
  indicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0084ff",
    margin: 6
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: "#f44336",
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4
  },
  count: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: -2
  }
});
