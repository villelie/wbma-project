/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import AsyncImage from '../components/AsyncImage';
import {Container, Content, Card, CardItem, Text, Body} from 'native-base';
import PropTypes from 'prop-types';
import {Video} from 'expo-av';
import {getUser} from '../hooks/APIHooks';

const deviceHeight = Dimensions.get('window').height;
const mediaURL = 'http://media.mw.metropolia.fi/wbma/uploads/';

const Single = (props) => {
    const {navigation} = props;
    const [owner, setOwner] = useState({});
    const file = navigation.state.params.file;
    const getOwner = async () => {
        const data = await getUser(file.user_id);
        setOwner(data);
    };
    useEffect(() => {
        getOwner();
    })
    return (
        <Container>
            <Content>
                <Card>
                    <CardItem>
                        <Body>
                            <Text>{file.title}</Text>
                            <Text note>by {owner.username}</Text>
                            {owner.full_name &&
                                <Text note>{owner.full_name}</Text>
                            }
                        </Body>
                    </CardItem>
                    <CardItem cardBody>
                        {file.media_type === 'image' &&
                            <AsyncImage
                                style={{
                                    width: '100%',
                                    height: deviceHeight / 2,
                                }}
                                spinnerColor='#777'
                                source={{uri: mediaURL + file.filename}}
                            />}
                        {file.media_type === 'video' &&
                            <Video
                                source={{uri: mediaURL + file.filename}}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                shouldPlay
                                isLooping
                                style={{
                                    width: '100%',
                                    height: deviceHeight / 2
                                }}
                            />}
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>{file.description}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </Content>
        </Container>
    );
};

Single.propTypes = {
    navigation: PropTypes.object,
    file: PropTypes.object,
};

export default Single;
