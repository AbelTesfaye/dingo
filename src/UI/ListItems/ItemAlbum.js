import React from "react";
import { Text, View, Image,TouchableNativeFeedback } from "react-native";
export class AlbumItem extends React.Component {
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
          width: 200,
          height: 200,
          flex: 1
        }}
      >
        <Image
          resizeMode="contain"
          style={{
            flex: 1,
            alignSelf: "stretch",
            backgroundColor: "#fff"
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
      </TouchableNativeFeedback>
    );
  }
}
