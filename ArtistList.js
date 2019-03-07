import React from "react";
import { Text, FlatList,TouchableWithoutFeedback } from "react-native";
import { ArtistItem } from "./ArtistItem";

export class ArtistList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const AppInstance = this.props.AppInstance
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={{
          backgroundColor: "white"
        }}
        ListFooterComponent={() => {
          return (
            (this.props.data && this.props.maxItems <= this.props.data.length)?
            <TouchableWithoutFeedback onPress={()=>{
              AppInstance.openArtistListPage(this.props.data)
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
        data={this.props.data?this.props.data.slice(0,this.props.maxItems):null}
        renderItem={({ item }) => {
          return (
            <ArtistItem
              AppInstance={this.props.AppInstance}
              artistInfo={item}
            />
          );
        }}
      />
    );
  }
}
