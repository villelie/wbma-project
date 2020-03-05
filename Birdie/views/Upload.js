/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react';
import {Content, Form, Item, Label, Button, Body, Text, Picker, Icon, Card, Header, Title, Subtitle, Right} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHooks';
import {Image, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
const deviceHeight = Dimensions.get('window').height;

const Upload = (props) => {
    const [image, setImage] = useState(null);
    const [sexPick, setSexPicker] = useState('Unknown');
    const [rarityPick, setRarityPicker] = useState('Unknown');
    const handleSexPicked = (value) => {
        handleSexChange(value);
        setSexPicker(value);
    }; const handleRarityPicked = (value) => {
        handleRarityChange(value);
        setRarityPicker(value);
    };
    const {validateField, errors, validateOnSend, handleTitleChange, handleDescriptionChange, handleSexChange, handleRarityChange, handleLocationChange, handleUpload, inputs} = useUploadForm();
    useEffect(() => {
        getPermissionAsync();
    }, []);

    const validationProperties = {
        title: {title: inputs.title},
        description: {description: inputs.description},
    };

    const uploadAsync = async (file, navigation) => {
        const upValid = validateOnSend(validationProperties);
        console.log('upload errors', errors);
        if (!upValid) {
            return;
        }
        handleUpload(file, navigation);
    };

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
            exif: true,
        });
        console.log(result);
        if (!result.cancelled) {
            setImage(result);
        }
    };
    return (
        <>
            <Header noLeft style={{backgroundColor: '#4FA345'}} androidStatusBarColor >
                <Body>
                    <Title>Upload</Title>
                    <Subtitle>Birdie</Subtitle>
                </Body>
                <Right />
            </Header>
            <Content style={{backgroundColor: '#d9f7b0'}}>
                <Card>
                    <Form>
                        <Item stackedLabel>
                            <Label>Username</Label>
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
                        <Item stackedLabel>
                            <Label>Description</Label>
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
                            <Text>    Gender:</Text>
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
                            <Text>    Conservation status:</Text>
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
                            <Label>Location</Label>
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
                        {image &&
                            <Image source={{uri: image.uri}} style={{width: '100%', height: deviceHeight * 0.3}}></Image>
                        }

                        <Button full warning onPress={pickImage}>
                            <Text>Choose file</Text>
                        </Button>
                        <Button full success onPress={() => {
                            uploadAsync(image, props.navigation);
                        }}>
                            <Text>Upload</Text>
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

Upload.propTypes = {
    navigation: PropTypes.object,
};
export default Upload;