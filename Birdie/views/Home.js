/* eslint-disable react/display-name */
import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Header, Container, Body, Right, Title, Subtitle} from 'native-base';

const Home = (props) => {
    const {navigation} = props;
    return (
        <>
            <Header noLeft style={{backgroundColor: '#4FA345'}} androidStatusBarColor >
                <Body>
                    <Title>Home</Title>
                    <Subtitle>Birdie</Subtitle>
                </Body>
                <Right />
            </Header>
            <Container style={{backgroundColor: '#d9f7b0'}}>
                <List navigation={navigation} mode={'all'}></List>
            </Container>
        </>
    );
};

Home.prototype = {
    navigation: PropTypes.object,
    mode: PropTypes.string,
};

export default Home;