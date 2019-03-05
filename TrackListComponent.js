import React from "react";
import { FlatList } from "react-native";
import { TrackComponent } from "./TrackComponent";
export class TrackListComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <FlatList
        keyExtractor={(item, index) => item.key}
        style={{
          backgroundColor: "white"
        }}
        data={this.props.data}
        renderItem={({ item, index }) => {
          return (
            <TrackComponent
              onTrackPress={this.props.onTrackPress}
              item={item}
              index={index}
            />
          );
        }}
      />
    );
  }
}
