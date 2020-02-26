import React from 'react';
import PropTypes from 'prop-types';
import {ListItem as BaseListItem, Thumbnail, Text, Left, Body, Right, Button, Icon} from 'native-base';
import {AsyncStorage} from 'react-native';
import {fetchDEL} from '../hooks/APIHooks';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const ListItem = (props) => {
    const allData = JSON.parse(props.singleMedia.description);
    const desc = allData.description;
    //const rari = allData.rarity;
    //const loca = allData.location;
    return (
        <BaseListItem thumbnail>
            <Left>
                <Thumbnail square source={{uri: mediaUrl + props.singleMedia.thumbnails.w160}} />
            </Left>
            <Body>
                <Text>{props.singleMedia.title}</Text>
                <Text note numberOfLines={1}>{desc}</Text>
            </Body>
            <Right>
                <Button full info onPress={() => {
                    props.navigation.push('Single', {file: props.singleMedia});
                }}>
                    <Icon name='eye' />
                </Button>
                {props.mode === 'user' &&
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
                }
            </Right>
        </BaseListItem>
    );
}

ListItem.propTypes = {
    singleMedia: PropTypes.object,
};

export default ListItem;