import React from "react";
import { Text, FlatList } from "react-native";
import { AlbumItem } from "./AlbumItem";

export class AlbumList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <FlatList
        keyExtractor={(item, index) => item.key}
        horizontal={true}
        style={{
          backgroundColor: "white"
        }}
    
        data={this.props.data}
        renderItem={({ item }) => {
          return <AlbumItem AppInstance={this.props.AppInstance} albumInfo={item} />;
        }}
      />
    );
  }
}
