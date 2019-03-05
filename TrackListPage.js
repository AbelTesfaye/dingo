import React from "react";
import { View } from "react-native";
import { TrackList } from "./TrackList";
export class TrackListPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <TrackList
          onTrackPress={this.props.onTrackPress}
          data={[
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            },
            {
              key: "a",
              images: [""],
              name: "wazzup",
              artistName: "holla"
            }
          ]}
        />
      </View>
    );
  }
}
