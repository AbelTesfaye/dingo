import React from "react";
import { Text, FlatList } from "react-native";
import { ArtistItem } from "./ArtistItem";

export class ArtistListPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={{
          backgroundColor: "white"
        }}
        ListFooterComponent={() => {
          return (
            <Text
              style={{
                marginTop: 10,
                textAlign: "center"
              }}
            >
              Show more
            </Text>
          );
        }}
        data={this.props.data}
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
