import React from "react";
import { View } from "react-native";
import { TrackList } from "./TrackList";
import utils from './utils'
export class TrackListPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const AppInstance= this.props.AppInstance
    return (
      <View>
        <TrackList
          onTrackPress={(item, index) =>
              AppInstance.startInPlayer(utils.convertToTrackPlayerFormat(AppInstance.state.screenStates_screenDetailStates_pageTrackListStates_tracks.slice(index)))
            }
          data={this.props.data}
        />
      </View>
    );
  }
}
