import React from "react";
import { Text, View, Image } from "react-native";
export class ArtistItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          margin: 5
        }}
      >
        <Image
          style={{
            borderRadius: 25,
            backgroundColor: "#ddd",
            width: 50,
            height: 50
          }}
          source={{
            uri: this.props.artistInfo.images[0]
          }}
        />
        <View
          style={{
            marginHorizontal: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15
            }}
          >
            {this.props.artistInfo.name}
          </Text>
        </View>
      </View>
    );
  }
}
