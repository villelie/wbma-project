/* eslint-disable react/display-name */
import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Header, Left, Body, Right, Title, Subtitle, Button, Icon, Container} from 'native-base';

const MyFiles = (props) => {
    const {navigation} = props;
    return (
        <>
            <Header style={{backgroundColor: '#4FA345'}} androidStatusBarColor >
                <Left>
                    <Button transparent onPress={() => {props.navigation.navigate('Profile')}}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>My Files</Title>
                    <Subtitle>Birdie</Subtitle>
                </Body>
                <Right />
            </Header>
            <Container style={{backgroundColor: '#d9f7b0'}}>
                <List navigation={navigation} mode={'user'}></List>
            </Container>
        </>
    );
};

MyFiles.prototype = {
    navigation: PropTypes.object,
    mode: PropTypes.string,
};

export default MyFiles;