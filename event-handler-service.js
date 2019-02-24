import TrackPlayer from "react-native-track-player";

module.exports = async data => {
  _getIndexOfTrackUsingId = (tracks, trackId) => {
    let foundIndex = -1;
    tracks.map((item, index) => {
      if (item.id === trackId) foundIndex = index;
    });
    return foundIndex;
  };

  _updateTrackPlayerQueueItem = (tracks, trackId, newProperties, callback) => {
    const itemIndex = this._getIndexOfTrackUsingId(tracks, trackId);
    let trackItem = tracks[itemIndex];

    insertBeforeId = null;
    if (itemIndex + 1 < tracks.length)
      insertBeforeId = tracks[itemIndex + 1].id;

    trackItem = {
      ...trackItem,
      ...newProperties
    };

    TrackPlayer.remove([trackId])
      .then(() => {
        TrackPlayer.add(trackItem, insertBeforeId);
        callback();
      })
      .catch(e => console.error(e));
  };
  _getTracksToRight = (tracks, currentIndex, howManyToTheRight) => {
    return tracks.slice(currentIndex + 1, currentIndex + 1 + howManyToTheRight);
  };
  _getTracksToLeft = (tracks, currentIndex, howManyToTheLeft) => {
    return tracks.slice(currentIndex - howManyToTheLeft, currentIndex);
  };

  _fetchFromEndpoint = (endpoint, callback) => {
    const url = "https://dingo-backend.now.sh/";

    fetch(`${url}${endpoint}`)
      .then(response => response.json())
      .then(responseJson => {
        callback(responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  };

  //use this to save listened tracks into files
  console.log("data.type: " + data.type);

  if (data.type == "playback-state") {
    // Update the UI with the new state
    console.log(JSON.stringify(data));

    if (data.state == TrackPlayer.STATE_NONE) {
      console.log("STATE_NONE");
    }
    if (data.state == TrackPlayer.STATE_PLAYING) {
      console.log("STATE_PLAYING");
    }
    if (data.state == TrackPlayer.STATE_PAUSED) {
      console.log("STATE_PAUSED");
    }
    if (data.state == TrackPlayer.STATE_STOPPED) {
      console.log("STATE_STOPPED");
    }
    if (data.state == TrackPlayer.STATE_BUFFERING) {
      console.log("STATE_BUFFERING");

      TrackPlayer.getQueue()
        .then(tracks => {
          TrackPlayer.getCurrentTrack().then(currentTrackId => {
            const itemIndex = this._getIndexOfTrackUsingId(
              tracks,
              currentTrackId
            );

            const tracksToLeft = this._getTracksToLeft(tracks, itemIndex, 1);
            const tracksToRight = this._getTracksToRight(tracks, itemIndex, 1);

            tracksToRight.concat(tracksToLeft).map((item, index) => {
              if (
                typeof item.url === "undefined" ||
                item.url.length <= "http://".length
              ) {
                if (item.youtubeId) {
                  //get playable url from youtube

                  _fetchFromEndpoint(
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
                  _fetchFromEndpoint(
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
                            "using artist and song finsihsed getting url for youtube id:" +
                              item.artist +
                              item.title
                          );
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
  } else if (data.type == "remote-play") {
    TrackPlayer.play();
  } else if (data.type == "remote-pause") {
    TrackPlayer.pause();
  } else if (data.type == "remote-next") {
    TrackPlayer.skipToNext();
  } else if (data.type == "remote-previous") {
    TrackPlayer.skipToPrevious();
  } else if (data.type == "remote-seek") {
    // Again, we can forward this command to the player using
    //TrackPlayer.seekTo(data.position);
  }
  // ...
};
