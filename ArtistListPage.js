import React from "react";
import { Text, FlatList } from "react-native";
import { ArtistItem } from "./ArtistItem";

export class ArtistList extends React.Component {
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
          return <ArtistItem name={item.name} />;
        }}
      />
    );
  }
}
