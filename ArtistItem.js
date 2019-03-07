import React from "react";
import { Text, View, Image,TouchableNativeFeedback} from "react-native";
export class ArtistItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const AppInstance = this.props.AppInstance
    return (
      <TouchableNativeFeedback
      onPress={() =>
        AppInstance._showArtistInfo(this.props.artistInfo.name)
      }
    >
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
      </TouchableNativeFeedback>
    );
  }
}
