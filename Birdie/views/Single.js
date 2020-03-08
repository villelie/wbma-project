/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import AsyncImage from '../components/AsyncImage';
import {Container, Content, Card, CardItem, Text, Body, Header, Title, Subtitle, Right, Left, Button, Icon} from 'native-base';
import PropTypes from 'prop-types';
import {Video} from 'expo-av';
import {getUser, getComments} from '../hooks/APIHooks';


const deviceHeight = Dimensions.get('window').height;
const mediaURL = 'http://media.mw.metropolia.fi/wbma/uploads/';

const Single = (props) => {
    const {navigation} = props;
    const [owner, setOwner] = useState({});
    const [comments, setComments] = useState([]);
    const file = navigation.state.params.file;
    const allData = JSON.parse(file.description);
    const desc = allData.description;
    const rari = allData.rarity;
    const loca = allData.location;
    const getOwner = async () => {
        const data = await getUser(file.user_id);
        setOwner(data);
    };
    const getCommentList = async () => {
        const com = await getComments(file.file_id);
        setComments(com);
    };
    useEffect(() => {
        getOwner();
        getCommentList();
    });
    return (
        <>
            <Header style={{backgroundColor: '#4FA345'}} androidStatusBarColor >
                <Left>
                    <Button transparent onPress={() => {props.navigation.navigate('Home')}}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>{file.title}</Title>
                    <Subtitle>Birdie</Subtitle>
                </Body>
                <Right />
            </Header>
            <Container>
                <Content style={{backgroundColor: "#d9f7b0"}}>
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
                                <Text note>Description:</Text>
                                <Text>{desc}</Text>
                                <Text note>Conservation status:</Text>
                                <Text>{rari}</Text>
                                <Text note>Location:</Text>
                                <Text>{loca}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    {comments.map(comment => (
                        <Card key={comment.comment_id}>
                            <CardItem>
                                <Body>
                                    <Text>{comment.comment}</Text>
                                </Body>
                            </CardItem>
                        </Card>
                    ))}
                </Content>
            </Container>
        </>
    );
};

Single.propTypes = {
    navigation: PropTypes.object,
    file: PropTypes.object,
};

export default Single;
