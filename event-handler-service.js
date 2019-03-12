import TrackPlayer from "react-native-track-player";
import utils from "./utils";
import { openDatabase } from "react-native-sqlite-storage";
import BackgroundTimer from "react-native-background-timer";

var db = openDatabase(
  { name: "sqlite.db", createFromLocation: "~sqlite.db" },
  () => {
    console.log("db opened");
  },
  err => {
    console.log("SQL Error: " + err);
  }
);
const previousPlayingTrack = { title: "", artist: "", artwork: "" };
let trackCurrent = { title: "", artist: "", artwork: "" };

module.exports = async data => {
  _updateTrackPlayerQueueItem = (tracks, trackId, newProperties, callback) => {
    const currentItemIndex = utils.getIndexOfTrackUsingId(tracks, trackId);
    let trackItem = tracks[currentItemIndex];

    insertBeforeId = null;
    if (currentItemIndex + 1 < tracks.length)
      insertBeforeId = tracks[currentItemIndex + 1].id;

    console.log("insertBeforeId:" + insertBeforeId);

    trackItem = {
      ...trackItem,
      ...newProperties
    };
    console.log("llltrackItemtrackItemtrackItem: " + JSON.stringify(trackItem));

    if (trackItem.id === trackCurrent.id) {
      t = [...tracks]
      t[currentItemIndex] = trackItem;
      TrackPlayer.reset();

      TrackPlayer.add(t).then(() => {
        TrackPlayer.skip(trackItem.id).then(callback());
      });
    } else {
      TrackPlayer.remove(trackId)
        .then(() => {
          TrackPlayer.add(trackItem, insertBeforeId).then(() => {
            callback();
          });
        })
        .catch(e => console.error(e));
    }
  };

  _getTracksToRight = (tracks, currentIndex, howManyToTheRight) => {
    return tracks.slice(currentIndex + 1, currentIndex + 1 + howManyToTheRight);
  };
  _getTracksToLeft = (tracks, currentIndex, howManyToTheLeft) => {
    return tracks.slice(currentIndex - howManyToTheLeft, currentIndex);
  };

  writeRecentTrack = (timestamp, trackName, artistName, image) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO recent (timestamp,trackName, artistName, image) VALUES (?,?,?,?)",
        [timestamp, trackName, artistName, image],
        (tx, results) => {
          console.log("Inserted into recent tracks successfully");
        }
      );
    });
  };

  //use this to save listened tracks into files
  console.log("data.type: " + data.type);

  if (data.type == "playback-state") {
    // Update the UI with the new state
    console.log(JSON.stringify(data));

    if (data.state == TrackPlayer.STATE_NONE) {
      console.log("STATE_NONE");

      TrackPlayer.getQueue()
        .then(tracks => {
          TrackPlayer.getCurrentTrack().then(currentTrackId => {
            const currentItemIndex = utils.getIndexOfTrackUsingId(
              tracks,
              currentTrackId
            );

            const tracksToLeft = this._getTracksToLeft(
              tracks,
              currentItemIndex,
              1
            );
            trackCurrent = tracks[currentItemIndex];
            const tracksToRight = this._getTracksToRight(
              tracks,
              currentItemIndex,
              1
            );

            [trackCurrent, ...tracksToRight, ...tracksToLeft].map(item => {
              console.log("trackCurrent: " + JSON.stringify(trackCurrent));
              console.log("itemitemitem: " + JSON.stringify(item));
              if (!item.url || item.url.length <= "http://".length) {
                if (item.youtubeId) {
                  //get playable url from youtube

                  utils.fetchFromEndpoint(
                    `getHighestQualityAudio?id=${encodeURIComponent(
                      item.youtubeId
                    )}`,
                    response => {
                      this._updateTrackPlayerQueueItem(
                        tracks,
                        item.id,
                        {
                          url: response.url
                        },
                        () => {
                          console.log(
                            "finsihsed getting url for youtube id:" +
                              item.youtubeId
                          );
                        }
                      );
                    }
                  );
                } else if (item.title && item.artist) {
                  utils.fetchFromEndpoint(
                    `getHighestQualityAudioUsingArtistAndSong?artist=${encodeURIComponent(
                      item.artist
                    )}&song=${encodeURIComponent(item.title)}`,
                    response => {
                      this._updateTrackPlayerQueueItem(
                        tracks,
                        item.id,
                        {
                          url: response.url
                        },
                        () => {
                          console.log(
                            "using artist and song finsihsed getting url for artis and title:" +
                              item.artist +
                              item.title
                          );
                          TrackPlayer.play()

                        }
                      );
                    }
                  );
                }
              }
            });
          });
        })
        .catch(e => console.error(e));
    }
    if (data.state == TrackPlayer.STATE_PLAYING) {
      console.log("STATE_PLAYING");
      TrackPlayer.getCurrentTrack().then(currentTrackId => {
        TrackPlayer.getTrack(currentTrackId).then(track => {
          if (
            previousPlayingTrack.title !== track.title ||
            previousPlayingTrack.artist !== track.artist ||
            previousPlayingTrack.artwork !== track.artwork
          ) {
            this.writeRecentTrack(
              new Date().getTime(),
              track.title,
              track.artist,
              track.artwork
            );
          }

          previousPlayingTrack.title = track.title;
          previousPlayingTrack.artist = track.artist;
          previousPlayingTrack.artwork = track.artwork;
        });
      });
    }
    if (data.state == TrackPlayer.STATE_PAUSED) {
      console.log("STATE_PAUSED");
    }
    if (data.state == TrackPlayer.STATE_STOPPED) {
      console.log("STATE_STOPPED");
    }
    if (data.state == TrackPlayer.STATE_BUFFERING) {
      console.log("STATE_BUFFERING");
    }
  } else if (data.type == "remote-play") {
    TrackPlayer.play();
  } else if (data.type == "remote-pause") {
    TrackPlayer.pause();
  } else if (data.type == "remote-next") {
    TrackPlayer.skipToNext();
  } else if (data.type == "remote-previous") {
    TrackPlayer.skipToPrevious();
  } else if (data.type == "remote-seek") {
    TrackPlayer.seekTo(data.position);
  } else if (data.type == "remote-duck") {
    if (data.paused) TrackPlayer.pause();
    if (data.permanent) TrackPlayer.stop();
    if (data.ducking) {
      const prevVolume = await TrackPlayer.getVolume();
      TrackPlayer.setVolume(0.1);

      BackgroundTimer.setTimeout(() => {
        TrackPlayer.setVolume(prevVolume);
      }, 3 * 1000);
    }
  }
};
