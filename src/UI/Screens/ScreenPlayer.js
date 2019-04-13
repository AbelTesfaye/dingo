import React, { Component } from "react";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ActivityIndicator
} from "react-native";
import TrackPlayer from "react-native-track-player";
import ImageButton from "../CustomModules/JS/ImageButton";
import ProgressBar from "../CustomModules/JS/ProgressBar";
import SlidingPanel from "../CustomModules/JS/SlidingPanel";
const { width, height } = Dimensions.get("window");

export default class ScreenPlayer extends Component {
  constructor(props) {
    super(props);
    this.AppInstance = this.props.AppInstance;

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount() {
    let tracksToPlay = this.props.tracks;
    const indexToPlay = 0;

    if (!(tracksToPlay.length < 1)) {
      TrackPlayer.setupPlayer({
        maxCacheFiles: 20,
        maxCacheSize: 1024 * 50 //50 megabytes
      }).then(() => {
        TrackPlayer.updateOptions({
          capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
          ],
          compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
          ],

          // Notification Color (Must be an ARGB Hexadecimal number)
          color: 0xfa3843,
          stopWithApp: false
        });


        this._putTracksFromPropToState();

        //what to do if there already is a url in the track object
        this._addToTrackPlayerQueue(tracksToPlay, null, () => {});
        this._play();
      });
    } else {
      //if started from miniplayer

      this.AppInstance.getTrackPlayerQueueToState();
      this.AppInstance.updateCurrentPlayingTrackState();
    }
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
    this.AppInstance.setState({
      activeScreen: "SCREEN_NAVIGATOR"
    });
    return true;
  }

  _play = () => {
    TrackPlayer.play();
  };
  _pause = () => {
    TrackPlayer.pause();
  };

  _playOrPauseToggle = () => {
    this.AppInstance.state
      .screenStates_screenPlayerStates_pageQueueStates_playerState !==
    TrackPlayer.STATE_PLAYING
      ? this._play()
      : this._pause();
  };
  _skipToNext = () => {
    TrackPlayer.skipToNext()
      .then(() => {})
      .catch(e => {
        console.error(e);
      });
  };

  _skipToPrevious = () => {
    TrackPlayer.skipToPrevious()
      .then(() => {})
      .catch(e => {
        console.error(e);
      });
  };
  _stopPlaybackAndResetQueue = () => {
    TrackPlayer.reset();
  };

  _addToTrackPlayerQueue = (tracks, insertBefore, callback) => {
    TrackPlayer.add(tracks, insertBefore)
      .then(() => {
        callback();
      })
      .catch(e => {
        console.error(e);
      });
  };
  _updateTracksInState = tracks => {
    this.AppInstance.setState({
      screenStates_screenPlayerStates_pageQueueStates_tracksInQueue: tracks
    });
  };

  _putTracksFromPropToState = () => {
    this._updateTracksInState(this.props.tracks);
  };
  _onPlaylistItemPress = (item, index) => {
    if (
      index !==
      this.AppInstance.state
        .screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex
    ) {
      this.AppInstance.setState({
        screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex: index
      });
      TrackPlayer.skip(item.id)
        .then(this._play())
        .catch(e => console.error(e));
    }
  };

  render() {
    return (
      <View style={{ ...styles.container, width: width }}>
        <View style={{ ...styles.bodyViewStyle, flex: 1 }}>
          <View style={{ marginHorizontal: 10, flex: 1 }}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              style={{
                backgroundColor: "white",
                flex: 1,
                width: width,
                marginBottom: 50
              }}
              data={
                this.AppInstance.state
                  .screenStates_screenPlayerStates_pageQueueStates_tracksInQueue
              }
              renderItem={({ item, index }) => {
                return (
                  <TouchableNativeFeedback
                    onPress={() => this._onPlaylistItemPress(item, index)}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        flexDirection: "row",
                        margin: 5,
                        backgroundColor:
                          this.AppInstance.state
                            .screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex ===
                          index
                            ? "#ffb74d"
                            : "#fff"
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 20,
                            fontWeight: "bold",
                            color:
                              typeof item.url !== "undefined" &&
                              item.url.length >= "http://".length
                                ? "red"
                                : "grey"
                          }}
                        >
                          •
                        </Text>
                      </View>
                      <Image
                        style={{
                          backgroundColor: "#ddd",
                          width: 50,
                          height: 50
                        }}
                        source={{ uri: item.artwork }}
                      />
                      <View
                        style={{
                          marginHorizontal: 10,
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          flex: 1
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                        <Text style={{}}>{item.artist}</Text>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                );
              }}
            />
          </View>
        </View>

        <SlidingPanel
          allowAnimation={true}
          headerLayoutHeight={49}
          allowDragging={true}
          AnimationSpeed={100}
          onDragStop={() => {
          }}
          snap={true}
          headerLayout={() => (
            <View elevation={5} style={styles.headerLayoutStyle}>
              <View
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <View style={{ flexDirection: "row", margin: 10 }}>
                  <Image
                    style={{
                      ...styles.controlIcon,
                      margin: 5,
                      height: 20,
                      width: 20
                    }}
                    source={require("../../assets/icons/down-arrow.png")}
                  />
                  <Text style={{ textAlignVertical: "center", margin: 5 }}>
                    PLAYLIST
                  </Text>
                </View>
              </View>
            </View>
          )}
          slidingPanelLayout={() => (
            <View style={styles.slidingPanelLayoutStyle}>
              <View style={styles.container}>
                <ImageBackground
                  resizeMethod="resize"
                  blurRadius={3}
                  source={{
                    uri: this.AppInstance.state
                      .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
                      ? this.AppInstance.state
                          .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
                          .artwork
                      : null
                  }}
                  style={styles.backgroundImage}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "space-between"
                    }}
                  >
                    <Image
                      resizeMethod="resize"
                      style={{
                        backgroundColor: "#ddd",
                        flex: 1,
                        aspectRatio: 1,
                        resizeMode: "cover",
                        margin: 10
                      }}
                      source={{
                        uri: this.AppInstance.state
                          .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
                          ? this.AppInstance.state
                              .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
                              .artwork
                          : null
                      }}
                    />

                    <View
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        flex: 1,
                        width: width,
                        marginBottom: 30
                      }}
                    >
                      <ProgressBar style={{ backgroundColor: "transparent" }} />

                      <View
                        style={{
                          alignSelf: "stretch",
                          justifyContent: "center"
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            textAlign: "center"
                          }}
                        >
                          {this.AppInstance.state
                            .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
                            ? this.AppInstance.state
                                .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
                                .title
                            : null}
                        </Text>
                        <Text style={{ textAlign: "center" }}>
                          {this.AppInstance.state
                            .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
                            ? this.AppInstance.state
                                .screenStates_screenPlayerStates_pageQueueStates_currentPlayingTrack
                                .artist
                            : null}
                        </Text>
                      </View>
                      <View style={styles.controls}>
                        <ImageButton
                          source={require("../../assets/icons/previous.png")}
                          onPress={() => {
                            this._skipToPrevious();
                          }}
                          imageStyle={styles.controlIcon}
                        />
                        {(this.AppInstance.state
                              .screenStates_screenPlayerStates_pageQueueStates_playerState ===
                            TrackPlayer.STATE_BUFFERING)?
                            <ActivityIndicator animating={true} />

                            :
                          <ImageButton
                          source={
                            this.AppInstance.state
                              .screenStates_screenPlayerStates_pageQueueStates_playerState !==
                            TrackPlayer.STATE_PLAYING
                              ? require("../../assets/icons/play.png")
                              : require("../../assets/icons/pause.png")
                          }
                          onPress={() => {
                            this._playOrPauseToggle();
                          }}
                          style={styles.playPause}
                          imageStyle={styles.controlIcon}
                        />
                        }
                        <ImageButton
                          source={require("../../assets/icons/next.png")}
                          onPress={() => {
                            this._skipToNext();
                          }}
                          imageStyle={styles.controlIcon}
                        />
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bodyViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerLayoutStyle: {
    width,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  slidingPanelLayoutStyle: {
    flex: 1,
    width,
    height,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  commonTextStyle: {
    color: "white",
    fontSize: 18
  },
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover"
  },
  view: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2b2b2b"
  },
  artwork: {
    width: "100%",
    height: 200
  },
  artworkLandscape: {
    //TODO
  },
  header: {
    marginTop: Platform.OS == "ios" ? 20 : 24,
    padding: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center"
  },
  headerIcon: {
    width: 24,
    height: 24,
    margin: 15
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "#ffffff",
    marginHorizontal: 16
  },
  info: {
    flexDirection: "column",
    alignItems: "center",
    margin: 20
  },
  title: {
    color: "#e6e6e6",
    fontSize: 19,
    fontWeight: "500"
  },
  artist: {
    color: "#9a9a9a",
    fontSize: 16,
    fontWeight: "400"
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 25
  },
  controlIcon: {
    width: 40,
    height: 40
  },
  playPause: {
    padding: 10
  }
});
