import React from "react";
import { Text, FlatList } from "react-native";
import { AlbumListItemGrid as AlbumListGridItem } from "./AlbumListGridItem";
export class AlbumListGrid extends React.Component {
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
          }
        ]}
        numColumns={2}
        renderItem={({ item }) => {
          const albumInfo = item;
          return <AlbumListGridItem albumInfo={albumInfo} />;
        }}
      />
    );
  }
}
