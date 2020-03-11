import React, {useContext, useEffect, useState} from "react";
import {List as BaseList, Spinner, View, Card, Item, Button, Icon} from "native-base";
import ListItem from "./ListItem";
import {MediaContext} from "../contexts/MediaContext";
import {getAllMedia, getUserMedia} from "../hooks/APIHooks";
import PropTypes from "prop-types";
import {AsyncStorage} from "react-native";
import {NavigationEvents} from "react-navigation";
import FormTextInput from "./FormTextInput";
import useSearchForm from "../hooks/SearchHooks";

const List = props => {
  const [media, setMedia] = useContext(MediaContext);
  const [loading, setLoading] = useState(true);
  const [searching, setSearch] = useState();
  const {inputs, handleSearchChange} = useSearchForm();

  const getMedia = async mode => {
    try {
      var data = [];
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

  const handleSearch = async (searched) => {
    const result = [...media.filter(i => i.title.match(new RegExp(searched, "i")))];
    setSearch(result);
  };

  const isSearching = () => {
    if (searching) return searching;
    else return media;
  };

  useEffect(() => {
    getMedia(props.mode);
  }, []);

  return (
    <View>
      <Card>
        <Item>
          <FormTextInput
            placeholder={'Search'}
            onChangeText={searched => {
              handleSearchChange(searched);
              handleSearch(searched);
            }}
          />
          <Icon name='search' />
        </Item>
      </Card>
      {loading ? (
        <Spinner />
      ) : (
          <BaseList
            style={{marginBottom: 60 /* fixed last item of the list going behind navbar*/}}
            dataArray={isSearching()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ListItem
              navigation={props.navigation}
              singleMedia={item}
              mode={props.mode}
            />}
          />
        )}
      <NavigationEvents onDidBlur={() => {
        if (props.mode !== 'all') {
          getMedia('all');
        }
      }} />
    </View>
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  mode: PropTypes.string
};

export default List;
