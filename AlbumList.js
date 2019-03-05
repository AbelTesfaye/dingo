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
        ListFooterComponent={() => {
          return (
            <Text
              style={{
                flex: 1,
                marginTop: 10,
                textAlignVertical: "center"
              }}
            >
              Show more
            </Text>
          );
        }}
        data={[
          {
            key: "a",
            images: [""],
            name: "wazzup",
            artistName: "holla"
          },     {
            key: "a",
            images: [""],
            name: "wazzup",
            artistName: "holla"
          },     {
            key: "a",
            images: [""],
            name: "wazzup",
            artistName: "holla"
          },     {
            key: "a",
            images: [""],
            name: "wazzup",
            artistName: "holla"
          },
        ]}
        renderItem={({ item }) => {
          return <AlbumItem albumInfo={item} />;
        }}
      />
    );
  }
}
