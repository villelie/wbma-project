/* eslint-disable react/display-name */
import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

const MyFiles = (props) => {
    const {navigation} = props;
    return (
        <List navigation={navigation} mode={'user'}></List>
    );
};

MyFiles.prototype = {
    navigation: PropTypes.object,
    mode: PropTypes.string,
};

export default MyFiles;