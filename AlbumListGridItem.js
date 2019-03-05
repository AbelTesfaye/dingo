import React from "react";
import { Text, View, Image } from "react-native";
export class AlbumListItemGrid extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View
        style={{
          margin: 10,
          backgroundColor: "white",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          aspectRatio: 1,
          flex: 1
        }}
      >
        <Image
          resizeMode="contain"
          style={{
            flex: 1,
            alignSelf: "stretch",
            backgroundColor: "#eee"
          }}
          source={{
            uri: this.props.albumInfo.images[this.props.albumInfo.images.length - 1]
          }}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text numberOfLines={1}>
            {this.props.albumInfo.name} • {this.props.albumInfo.artistName}
          </Text>
        </View>
      </View>
    );
  }
}
