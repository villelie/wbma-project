import React from 'react';
import {Input, Item, Badge, Body} from 'native-base';
import PropTypes from 'prop-types';


const FormTextInput = (props) => {
    const {success, error, ...otherProps} = props;
    return (
        <Body>
            <Item success={success} error={error}>
                <Input
                    {...otherProps}
                />
            </Item>
            {error && <Badge><Text>{error}</Text></Badge>}
        </Body>
    );
};

FormTextInput.propTypes = {
    success: PropTypes.bool,
    error: PropTypes.bool,
};

export default FormTextInput;