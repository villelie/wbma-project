/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react';
import {Content, Form, Item, Button, Body, Text} from 'native-base';
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
    const {handleTitleChange, handleDescriptionChange, handleUpload, inputs} = useUploadForm();
    useEffect(() => {
        getPermissionAsync();
    }, []);
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
        <Content>
            <Form>
                <Item>
                    <FormTextInput
                        value={inputs.title}
                        placeholder='title'
                        onChangeText={handleTitleChange}
                    />
                </Item>
                <Item>
                    <FormTextInput
                        value={inputs.description}
                        placeholder='description'
                        onChangeText={handleDescriptionChange}
                    />
                </Item>
                {image &&
                    <Image source={{uri: image.uri}} style={{width: '100%', height: deviceHeight * 0.3}}></Image>
                }
                <Body>
                    <Button transparent onPress={pickImage}>
                        <Text>Choose file</Text>
                    </Button>
                    <Button full onPress={() => {
                        handleUpload(image, props.navigation);
                    }}>
                        <Text>Upload</Text>
                    </Button>
                </Body>
            </Form>
        </Content>
    );
}

Upload.propTypes = {
    navigation: PropTypes.object,
};
export default Upload;