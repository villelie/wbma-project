import React from 'react';
import PropTypes from 'prop-types';
import {ListItem as BaseListItem, View, Thumbnail, Text, Left, Body, Right, Button, Icon} from 'native-base';
import {AsyncStorage} from 'react-native';
import {fetchDEL} from '../hooks/APIHooks';


const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const ListItem = (props) => {
    const allData = JSON.parse(props.singleMedia.description);
    //const desc = allData.description;
    const rari = allData.rarity;
    const loca = allData.location;
    return (
        <BaseListItem thumbnail >
            <Left>
                <Thumbnail square source={{uri: mediaUrl + props.singleMedia.thumbnails.w160}} />
            </Left>
            <Body>
                <Text>{props.singleMedia.title}</Text>
                <Text note numberOfLines={1}>{rari + ', ' + loca}</Text>
            </Body>
            <Right style={{ flexDirection: 'row'}}>
                <Button full info onPress={() => {
                    props.navigation.push('Single', {file: props.singleMedia});
                }}>
                    <Icon name='eye' />
                </Button>
                {props.mode === 'user' &&
                    <View style={{flexDirection: 'column'}}>
                        <Button full danger onPress={async () => {
                            const token = await AsyncStorage.getItem('userToken');
                            const del = await fetchDEL('media', props.singleMedia.file_id, token);
                            if (del.message) {
                                console.log(del.message);
                                props.navigation.push('Home');
                            };
                        }}>
                            <Icon name='trash' />
                        </Button>
                        <Button full warning onPress={() => {
                            props.navigation.push('Modify', {file: props.singleMedia});
                        }}>
                            <Icon name='ios-color-wand' />
                        </Button>
                    </View>
                }
            </Right>
        </BaseListItem>
    );
}

ListItem.propTypes = {
    singleMedia: PropTypes.object,
};

export default ListItem;