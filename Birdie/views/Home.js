/* eslint-disable react/display-name */
import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Header, Left, Body, Right, Title, Subtitle} from 'native-base';


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
            <List navigation={navigation} mode={'all'}></List>
        </>
    );
};

Home.prototype = {
    navigation: PropTypes.object,
    mode: PropTypes.string,
};

export default Home;