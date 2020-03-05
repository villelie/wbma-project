import React, { useContext, useEffect, useState } from "react";
import { List as BaseList, Spinner, View, Card } from "native-base";
import ListItem from "./ListItem";
import { MediaContext } from "../contexts/MediaContext";
import { getAllMedia, getUserMedia } from "../hooks/APIHooks";
import PropTypes from "prop-types";
import { AsyncStorage } from "react-native";
import { NavigationEvents } from "react-navigation";

const List = props => {
  const [media, setMedia] = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  const getMedia = async mode => {
    try {
      let data = [];
      if (mode === "all") {
        data = await getAllMedia();
      } else {
        const token = await AsyncStorage.getItem("userToken");
        data = await getUserMedia(token);
      }
      setMedia(data.reverse());
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getMedia(props.mode);
  }, []);

  return (
    <View style={{ backgroundColor: "#d9f7b0" }}>
      {loading ? (
        <Spinner />
      ) : (
        <Card>
          <BaseList
            dataArray={media}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ListItem
                navigation={props.navigation}
                singleMedia={item}
                mode={props.mode}
              />
            )}
          />
        </Card>
      )}
      <NavigationEvents
        onDidBlur={() => {
          if (props.mode !== "all") {
            getMedia("all");
          }
        }}
      />
    </View>
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  mode: PropTypes.string
};

export default List;
