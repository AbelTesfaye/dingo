import React from "react";
import { Text, View, Image,TouchableNativeFeedback } from "react-native";
export class AlbumListItemGrid extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const AppInstance = this.props.AppInstance
    return (
      <TouchableNativeFeedback
      onPress={() =>
        AppInstance.showPageAlbumInfo(this.props.albumInfo.artistName,this.props.albumInfo.name)
      }
    >
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
            borderRadius:10,
          }}
          source={{
            uri: this.props.albumInfo?this.props.albumInfo.images[this.props.albumInfo.images.length - 1]:null
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
      </TouchableNativeFeedback>
    );
  }
}
