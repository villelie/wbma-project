import React from "react";
import PropTypes from "prop-types";
import {
  ListItem as BaseListItem,
  View,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Icon
} from "native-base";
import {AsyncStorage, StyleSheet} from "react-native";
import {fetchDEL} from "../hooks/APIHooks";

const mediaUrl = "http://media.mw.metropolia.fi/wbma/uploads/";

const ListItem = props => {
  const allData = JSON.parse(props.singleMedia.description);
  //const desc = allData.description;
  const rari = allData.rarity;
  const loca = allData.location;
  return (
    <BaseListItem noBorder
      style={{}}
      thumbnail
      onPress={() => {
        props.navigation.push("Single", {file: props.singleMedia});
      }}
    >
      <Left style={{flexDirection: "row"}}>
        {props.mode === "user" && (
          <View style={{flexDirection: "column"}}>
            <Button
              full
              danger
              onPress={async () => {
                const token = await AsyncStorage.getItem("userToken");
                const del = await fetchDEL(
                  "media",
                  props.singleMedia.file_id,
                  token
                );
                if (del.message) {
                  console.log(del.message);
                  props.navigation.push("Home");
                }
              }}
            >
              <Icon name="trash" />
            </Button>
            <Button
              full
              warning
              onPress={() => {
                props.navigation.push("Modify", {file: props.singleMedia});
              }}
            >
              <Icon name="ios-color-wand" />
            </Button>
          </View>
        )}
      </Left>
      <Body>
        <Text style={{fontWeight: "bold", fontSize: 25}}>
          {props.singleMedia.title}
        </Text>
        <Text style={{fontSize: 20}} note numberOfLines={1}>
          {rari + ", " + loca}
        </Text>
      </Body>
      <Right>
        <Thumbnail
          square
          source={{uri: mediaUrl + props.singleMedia.thumbnails.w160}}
          style={styles.thumb}
        />
      </Right>
    </BaseListItem>
  );
};

const styles = StyleSheet.create({
  thumb: {
    height: 120,
    width: 120,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",

  }
});

ListItem.propTypes = {
  singleMedia: PropTypes.object
};

export default ListItem;
