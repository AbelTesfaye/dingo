import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import TrackPlayer, { ProgressComponent } from "react-native-track-player";
import Slider from "./Slider";

function formatTwoDigits(n) {
  return n < 10 ? "0" + n : n;
}

function formatTime(seconds) {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  if (hh > 0) {
    return hh + ":" + formatTwoDigits(mm) + ":" + formatTwoDigits(ss);
  } else {
    return mm + ":" + formatTwoDigits(ss);
  }
}
class ProgressBar extends ProgressComponent {
  render() {
    const position = formatTime(Math.floor(this.state.position));
    const duration = formatTime(Math.floor(this.state.duration));

    let progress = this.state.isProgressBarSliding
      ? this.state.progressBeforeSlidingStart
      : this.getProgress();
    let buffered = this.getBufferedProgress();
    if (buffered < 0) buffered = 0;

    return (
      <View style={[styles.view, this.props.style]}>
        <View
          style={{
            flexDirection: "row",
            alignContent: "space-between",
            flex: 1,
            paddingHorizontal: 15
          }}
        >
          <Text style={{ textAlign: "left", flex: 1 }}>{position}</Text>
          <Text style={{ textAlign: "right", flex: 1 }}>{duration}</Text>
        </View>
        <Slider
          trackPressable={true}
          bufferValue={buffered}
          bufferTrackTintColor="#aaa"
          maximumTrackTintColor="#eee"
          onSlidingStart={currentSliderValue => {
            this.state.isProgressBarSliding = true;
            this.state.progressBeforeSlidingStart = currentSliderValue;
          }}
          onSlidingComplete={currentSliderValue => {
            this.state.isProgressBarSliding = false;
            this.state.progressBeforeSlidingStart = currentSliderValue;

            const seconds = currentSliderValue * this.state.duration;

            TrackPlayer.seekTo(seconds);
          }}
          value={progress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: 40
  },
  info: {
    color: "#c0c0c0",
    fontSize: 16,
    fontWeight: "300",
    margin: 10
  },
  bar: {
    backgroundColor: "#575757",
    height: 5,
    width: "100%",
    margin: 10,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  played: {
    backgroundColor: "#03A9F4",
    height: 5
  },
  buffered: {
    backgroundColor: "#797979",
    height: 5
  }
});

module.exports = ProgressBar;
