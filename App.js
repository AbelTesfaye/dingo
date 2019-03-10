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
import ScreenPlayer from "./ScreenPlayer";
import TrackPlayer from "react-native-track-player";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import Icon from "react-native-ionicons";
import { MiniPlayerProgressBar } from "./MiniPlayerProgressBar";
import { TrackList } from "./TrackList";
import { AlbumList } from "./AlbumList";
import { AlbumItem } from "./AlbumItem";
import { ArtistList } from "./ArtistList";
import utils from "./utils";
import { ScreenDetail } from "./ScreenDetail";
import { openDatabase } from "react-native-sqlite-storage";

var db = openDatabase(
  { name: "sqlite.db", createFromLocation: "~sqlite.db" },
  () => {
    console.log("db opened");
  },
  err => {
    console.log("SQL Error: " + err);
  }
);

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
              From Last Time
            </Text>
            <View
              style={{
                backgroundColor: "blue"
              }}
            >
              <TrackList
                maxItems={5}
                AppInstance={AppInstance}
                onTrackPress={(item, index) =>
                  AppInstance.startInPlayer(
                    utils.convertToTrackPlayerFormat(
                      AppInstance.state.screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse.slice(
                        index
                      )
                    )
                  )
                }
                data={
                  AppInstance.state
                    .screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse
                }
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
              Similar Albums
            </Text>
            <View
              style={{
                backgroundColor: "blue"
              }}
            >
              <AlbumList
                data={
                  AppInstance.state
                    .screenStates_screenNavigatorStates_pageHomeStates_similarAlbumsResponse
                }
                AppInstance={AppInstance}
                maxItems={5}
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
              Top Tracks Chart
            </Text>
            <View
              style={{
                backgroundColor: "blue"
              }}
            >
              <TrackList
                maxItems={10}
                AppInstance={AppInstance}
                onTrackPress={(item, index) =>
                  AppInstance.startInPlayer(
                    utils.convertToTrackPlayerFormat(
                      AppInstance.state.screenStates_screenNavigatorStates_pageHomeStates_topTracksChartResponse.slice(
                        index
                      )
                    )
                  )
                }
                data={
                  AppInstance.state
                    .screenStates_screenNavigatorStates_pageHomeStates_topTracksChartResponse
                }
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
            <ArtistList
              data={
                AppInstance.state
                  .screenStates_screenNavigatorStates_pageSearchStates_searchQueryArtistsResponse
              }
              AppInstance={AppInstance}
              maxItems={2}
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
              maxItems={2}
            />
          </View>
          <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
            Tracks
          </Text>
          <View style={{ marginHorizontal: 10 }}>
            <TrackList
              data={
                AppInstance.state
                  .screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse
              }
              onTrackPress={(item, index) =>
                AppInstance.startInPlayer(
                  utils.convertToTrackPlayerFormat(
                    AppInstance.state.screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse.slice(
                      index
                    )
                  )
                )
              }
              AppInstance={AppInstance}
              maxItems={10}
            />
          </View>

          {/* //TODO: work on this when more important features are done
          
          <Text style={{ fontWeight: "bold", margin: 10, fontSize: 20 }}>
            YouTube
          </Text>
          <View style={{ marginHorizontal: 10 }}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
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
          </View> */}
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
        { key: "PAGE_HOME", icon: "home", color: "#F44336" },
        { key: "PAGE_SEARCH", icon: "search", color: "#3F51B5" },
        { key: "PAGE_LIBRARY", icon: "ios-albums", color: "#4CAF50" }
      ],

      activeScreen: null,
      screenAndPageStack: [],

      screenStates_screenNavigatorStates_newQueueItems: [],

      screenStates_screenNavigatorStates_pageHomeStates_topTracksChartResponse: null,
      screenStates_screenNavigatorStates_pageHomeStates_similarAlbumsResponse: null,
      screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse: null,

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
      screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName: null,
      screenStates_screenDetailStates_pageArtistListStates_artists: null,
      screenStates_screenDetailStates_pageAlbumListStates_albums: null,
      screenStates_screenDetailStates_pageTrackListStates_tracks: null
    };
  }

  getRecentTracks = callback => {
    recentTracks = [];
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM recent ORDER BY timestamp DESC limit 100",
        [],
        (tx, results) => {
          console.log("Query completed");

          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);

            recentTracks.push({
              id: row.timestamp,
              name: row.trackName,
              artistName: row.artistName,
              images: [row.image || ""]
            });
          }

          callback(recentTracks);
        }
      );
    });
  };

  getRecentTracksAndPutThemInState = () => {
    this.getRecentTracks(recentTracks => {
      console.log("inside getrecenttracks");

      this.setState({
        screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse: recentTracks
      });
      this.getSimilarAlbumsAndPutThemInState();
    });
  };

  componentDidMount = () => {
    this.getChartTopTracksAndPutThemInState();

    this.getRecentTracksAndPutThemInState();

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

  _getChartTopTracks = callback => {
    utils.fetchFromEndpoint(`getChartTopTracks`, responseJson => {
      callback(responseJson);
    });
  };
  getChartTopTracksAndPutThemInState = () => {
    this._getChartTopTracks(responseJson => {
      const results = responseJson.result;
      this.setState({
        screenStates_screenNavigatorStates_pageHomeStates_topTracksChartResponse: results
      });
    });
  };

  _getSimilarAlbums = (tag, callback) => {
    console.log("getting similar albums for: " + tag);
    utils.fetchFromEndpoint(
      `tagTopAlbums?tag=${encodeURIComponent(tag)}`,
      responseJson => {
        callback(responseJson);
      }
    );
  };
  getSimilarAlbumsAndPutThemInState = () => {
    recentItems = this.state
      .screenStates_screenNavigatorStates_pageHomeStates_recentTracksResponse;

    if (recentItems) {
      randomTrack = recentItems[Math.floor(Math.random() * recentItems.length)];
      bigTag = randomTrack.artistName.split(" ");
      tag = bigTag[Math.floor(Math.random() * bigTag.length)];
      this._getSimilarAlbums(tag, responseJson => {
        const albums = responseJson.album;

        this.setState({
          screenStates_screenNavigatorStates_pageHomeStates_similarAlbumsResponse: utils.convertAlbumFromTagResultToAppFormat(
            albums
          )
        });
      });
    }
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

  _onSearchTracksPress = (track, index) => {
    // playlistItems = [track];
    playlistItems = this.state
      .screenStates_screenNavigatorStates_pageSearchStates_searchQueryTracksResponse;
    playlistItems = playlistItems;

    playlistItems = utils.convertToTrackPlayerFormat(playlistItems);
    this.startInPlayer(playlistItems.slice(index));
  };
  startInPlayer = tracks => {
    this.setState({
      screenStates_screenNavigatorStates_newQueueItems: tracks,
      activeScreen: "SCREEN_PLAYER"
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

  _showPageArtistInfo = artistName => {
    this.setState({
      activeScreen: "SCREEN_DETAIL",
      screenStates_screenDetailStates_activePage: "PAGE_ARTIST_INFO",

      screenStates_screenDetailStates_pageArtistInfoStates_artistName: artistName
    });
  };

  _showPageAlbumInfo = (artistName, albumName) => {
    this.setState({
      activeScreen: "SCREEN_DETAIL",
      screenStates_screenDetailStates_activePage: "PAGE_ALBUM_INFO",

      screenStates_screenDetailStates_pageAlbumInfoStates_artistAndAlbumName: {
        artistName,
        albumName
      }
    });
  };

  openArtistListPage = artists => {
    this.setState({
      activeScreen: "SCREEN_DETAIL",
      screenStates_screenDetailStates_activePage: "PAGE_ARTIST_LIST",

      screenStates_screenDetailStates_pageArtistListStates_artists: artists
    });
  };

  openAlbumListPage = albums => {
    this.setState({
      activeScreen: "SCREEN_DETAIL",
      screenStates_screenDetailStates_activePage: "PAGE_ALBUM_LIST",

      screenStates_screenDetailStates_pageAlbumListStates_albums: albums
    });
  };

  openTrackListPage = tracks => {
    this.setState({
      activeScreen: "SCREEN_DETAIL",
      screenStates_screenDetailStates_activePage: "PAGE_TRACK_LIST",

      screenStates_screenDetailStates_pageTrackListStates_tracks: tracks
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
    const AppInstance = this;
    return (
      <View style={{ flex: 1 }}>
        {this.state.activeScreen == "SCREEN_NAVIGATOR" ||
        this.state.activeScreen == null ? (
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
              <TabView
                navigationState={this.state}
                renderTabBar={this._renderTabBar}
                renderScene={({ route }) => {
                  switch (route.key) {
                    case "PAGE_HOME":
                      return <HomePage AppInstance={AppInstance} />;
                    case "PAGE_SEARCH":
                      return <SearchPage AppInstance={AppInstance} />;
                    case "PAGE_LIBRARY":
                      return <LibraryPage AppInstance={AppInstance} />;
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
                    activeScreen: "SCREEN_PLAYER",
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
        ) : this.state.activeScreen == "SCREEN_PLAYER" ? (
          <ScreenPlayer
            AppInstance={AppInstance}
            tracks={this.state.screenStates_screenNavigatorStates_newQueueItems}
          />
        ) : this.state.activeScreen == "SCREEN_DETAIL" ? (
          <ScreenDetail AppInstance={AppInstance} />
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
