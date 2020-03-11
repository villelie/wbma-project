import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {Spinner} from 'native-base';
import PropTypes from 'prop-types';

const AsyncImage = (props) => {
    const {
        style,
        source,
    } = props;
    return (
        <View style={[
            style, {
                flex: 1,
            }]}>
            <Image
                source={source}
                resizeMode={'contain'}
                style={{
                    height: '100%',
                    width: '100%',
                }}/>
        </View>
    );
};

AsyncImage.propTypes = {
    spinnerColor: PropTypes.string,
    style: PropTypes.object,
    source: PropTypes.object,
};

export default AsyncImage;
