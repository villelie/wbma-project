import React, {useState} from 'react';
import {Content, Form, Item, Button, Body, Text, Picker, Icon, Card, Label, Header, Title, Subtitle, Right, Left} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import useModifyForm from '../hooks/ModifyHooks';
import PropTypes from 'prop-types';

const Modify = (props) => {

    const file = props.navigation.state.params.file
    const description = JSON.parse(file.description)
    console.log(file);
    const [sexPick, setSexPicker] = useState('Unknown');
    const [rarityPick, setRarityPicker] = useState('Unknown');
    const handleSexPicked = (value) => {
        handleSexChange(value);
        setSexPicker(value);
    }; const handleRarityPicked = (value) => {
        handleRarityChange(value);
        setRarityPicker(value);
    };
    const {validateField, errors, validateOnSend, handleTitleChange,
        handleDescriptionChange, handleRarityChange,
        handleLocationChange, handleModify, inputs} = useModifyForm({
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
        <>
            <Header style={{backgroundColor: '#4FA345'}} androidStatusBarColor >
                <Left>
                    <Button transparent onPress={() => {props.navigation.navigate('Profile')}}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>Modify</Title>
                    <Subtitle>Birdie</Subtitle>
                </Body>
                <Right />
            </Header>
            <Content style={{backgroundColor: '#d9f7b0'}}>
                <Card>
                    <Form>
                        <Item stackedLabel>
                            <Label>Name of the bird</Label>
                            <FormTextInput
                                value={inputs.title}
                                onChangeText={handleTitleChange}
                                onEndEditing={() => {
                                    validateField(validationProperties.title);
                                }}
                                error={errors.title}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label>Description</Label>
                            <FormTextInput
                                value={inputs.description}
                                onChangeText={handleDescriptionChange}
                                onEndEditing={() => {
                                    validateField(validationProperties.description);
                                }}
                                error={errors.description}
                            />
                        </Item>
                        <Item picker>
                            <Text style={{color: '#545454', fontSize: 15}}>    Gender:</Text>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: undefined}}
                                placeholderStyle={{color: "#bfc6ea"}}
                                placeholderIconColor="#007aff"
                                selectedValue={sexPick}
                                onValueChange={handleSexPicked.bind(this)}>
                                <Picker.Item label="Unknown" value="Unknown" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Male" value="Male" />
                            </Picker>
                        </Item>
                        <Item picker>
                            <Text style={{color: '#545454', fontSize: 15}}>    Conservation status:</Text>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: undefined}}
                                placeholderStyle={{color: "#bfc6ea"}}
                                placeholderIconColor="#007aff"
                                selectedValue={rarityPick}
                                onValueChange={handleRarityPicked.bind(this)}>
                                <Picker.Item label="Unknown" value="Unknown" />
                                <Picker.Item label="Least concern" value="Least concern" />
                                <Picker.Item label="Near threatened" value="Near threatened" />
                                <Picker.Item label="Vulnerable" value="Vulnerable" />
                                <Picker.Item label="Endangered" value="Endangered" />
                            </Picker>
                        </Item>
                        <Item stackedLabel>
                            <Label>Location (city/zip/area)</Label>
                            <FormTextInput
                                value={inputs.location}
                                onChangeText={handleLocationChange}
                                onEndEditing={() => {
                                    validateField(validationProperties.location);
                                }}
                                error={errors.location}
                            />
                        </Item>
                        <Button success full onPress={() => {
                            modifyAsync(props.navigation);
                        }}>
                            <Text>Save changes</Text>
                        </Button>

                    </Form>
                </Card>
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
        </>
    );
}

Modify.propTypes = {
    navigation: PropTypes.object,
};
export default Modify;