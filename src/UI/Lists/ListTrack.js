import React from "react";
import { FlatList, Text,TouchableWithoutFeedback } from "react-native";
import { TrackItem } from "../ListItems/ItemTrack";
export class TrackList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const AppInstance = this.props.AppInstance
    return (
      
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={() => {
          return (
            (this.props.data && this.props.maxItems <= this.props.data.length)?
            <TouchableWithoutFeedback onPress={()=>{
              AppInstance.openTrackListPage(this.props.data)
            }}>
            <Text
              style={{
                marginTop: 10,
                textAlign: "center"
              }}
            >
              Show more
            </Text>
            </TouchableWithoutFeedback>
            :null
          );
        }}
        style={{
          backgroundColor: "white"
        }}
      
        data={this.props.data?this.props.data.slice(0,this.props.maxItems):null}
        renderItem={({ item, index }) => {
          return (
            <TrackItem
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
