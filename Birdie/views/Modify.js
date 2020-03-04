import React, {useState} from 'react';
import {Content, Form, Item, Button, Body, Text, Picker, Icon} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/ModifyHooks';
import PropTypes from 'prop-types';

const Modify = (props) => {

    const file = props.navigation.state.params.file
    const description = JSON.parse(file.description)
    console.log (file);
    const [picker, setPicker] = useState('Least concern');
    const handlePicked = (value) => {
        handleRarityChange(value);
        setPicker(value);
    };
    const {validateField, errors, validateOnSend, handleTitleChange,
        handleDescriptionChange, handleRarityChange,
        handleLocationChange, handleModify, inputs} = useUploadForm({
            title: file.title,
            description: description.description,
            location: description.location,
            rarity: description.rarity,
        });


    const validationProperties = {
        title: {title: inputs.title},
        description: {description: inputs.description},
        };

    const modifyAsync = async (navigation) => {
        const modValid = validateOnSend(validationProperties);
        console.log('modify errors', errors);
        if (!modValid) {
          return;
        }
        await handleModify(navigation);
        props.navigation.push('MyFiles');
    };
    
    return (
        <Content>
            <Form>
                <Item>
                    <FormTextInput
                        value={inputs.title}
                        placeholder='Name of the bird'
                        onChangeText={handleTitleChange}
                        onEndEditing={() => {
                            validateField(validationProperties.title);
                          }}
                          error={errors.title}
                    />
                </Item>
                <Item>
                    <FormTextInput
                        value={inputs.description}
                        placeholder='Description'
                        onChangeText={handleDescriptionChange}
                        onEndEditing={() => {
                            validateField(validationProperties.description);
                          }}
                          error={errors.description}
                    />
                </Item>
                <Item picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{width: undefined}}
                        placeholder="Rarity of the bird"
                        placeholderStyle={{color: "#bfc6ea"}}
                        placeholderIconColor="#007aff"
                        selectedValue={picker}
                        onValueChange={handlePicked.bind(this)}>
                        <Picker.Item label="Least concern" value="Least concern" />
                        <Picker.Item label="Near threatened" value="Near threatened" />
                        <Picker.Item label="Vulnerable" value="Vulnerable" />
                        <Picker.Item label="Endangered" value="Endangered" />
                    </Picker>
                </Item>
                <Item>
                    <FormTextInput
                        value={inputs.location}
                        placeholder='Location (area/city/zip)'
                        onChangeText={handleLocationChange}
                        onEndEditing={() => {
                            validateField(validationProperties.location);
                          }}
                          error={errors.location}
                    />
                </Item>
                
                <Body>
                    <Button full onPress={() => {
                        modifyAsync(props.navigation);
                    }}>
                        <Text>modify</Text>
                    </Button>
                </Body>
            </Form>
            {errors.fetch &&
          <Card>
            <CardItem>
              <Body>
                <Text>{errors.fetch}</Text>
              </Body>
            </CardItem>
          </Card>
        }
        </Content>
    );
}

Modify.propTypes = {
    navigation: PropTypes.object,
};
export default Modify;