/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react';
import {Dimensions, AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import {Container, Content, Card, CardItem, Text, Button, Icon, Body} from 'native-base';
import {fetchGET} from '../hooks/APIHooks';
import AsyncImage from '../components/AsyncImage';

const deviceHeight = Dimensions.get('window').height;
const mediaURL = 'http://media.mw.metropolia.fi/wbma/uploads/';

const Profile = (props) => {
    const [user, setUser] = useState({userdata: {}, avatar: '', });
    const userToState = async () => {
        try {
            const userFromStorage = await AsyncStorage.getItem('user');
            const uData = JSON.parse(userFromStorage);
            const avatarPic = await fetchGET('tags', 'avatar_' + uData.user_id);
            console.log('aPic', avatarPic[0].filename);
            setUser((user) => (
                {
                    userdata: uData,
                    avatar: avatarPic[0].filename,
                }));
        } catch (e) {
            console.log('Profile error: ', e.message);
        }
    };
    useEffect(() => {
        userToState();
    }, []);
    const signOutAsync = async () => {
        await AsyncStorage.clear();
        props.navigation.navigate('Auth');
    };
    return (
        <Container>
            <Content>
                <Card>
                    <CardItem>
                        <Icon name='person' />
                        <Body>
                            <Text>{user.userdata.username}</Text>
                        </Body>
                    </CardItem>
                    <CardItem cardBody>
                        <AsyncImage
                            style={{
                                width: '100%',
                                height: deviceHeight / 2,
                            }}
                            spinnerColor='#777'
                            source={{uri: mediaURL + user.avatar}}
                        />
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>Id: {user.userdata.user_id}</Text>
                            <Text>Full name: {user.userdata.full_name}</Text>
                            <Text>Email: {user.userdata.email}</Text>
                        </Body>
                    </CardItem>
                    <Button full warning onPress={() => {props.navigation.push('MyFiles')}}>
                        <Text>MyFiles</Text>
                    </Button>
                    <Button full onPress={signOutAsync}>
                        <Text>Sign out</Text>
                    </Button>
                </Card>
            </Content>
        </Container>
    );
};

Profile.propTypes = {
    singleMedia: PropTypes.object,
};

export default Profile;