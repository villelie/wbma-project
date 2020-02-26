/* eslint-disable react/display-name */
import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

const Home = (props) => {
    const {navigation} = props;
    return (
        <List navigation={navigation} mode={'all'}></List>
    );
};

Home.prototype = {
    navigation: PropTypes.object,
    mode: PropTypes.string,
};

export default Home;