import {useState, useContext} from 'react';
import {AsyncStorage} from 'react-native';
import {fetchGET, fetchPOST} from './APIHooks';
import {MediaContext} from '../contexts/MediaContext';

const useUploadForm = () => {
    const [media, setMedia] = useContext(MediaContext);
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const handleTitleChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                title: text,
            }));
    };
    const handleDescriptionChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                description: text,
            }));
    };
    const handleUpload = async (file, navigation) => {
        const filename = file.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        // fix jpg mimetype
        if (type === 'image/jpg') {
            type = 'image/jpeg';
        } else {
            type = match ? `video/${match[1]}` : 'video';
        }
        const fd = new FormData();
        fd.append('title', inputs.title);
        fd.append('description', inputs.description);
        fd.append('file', {uri: file.uri, name: filename, type});
        console.log('FD:', fd);
        try {
            const token = await AsyncStorage.getItem('userToken');

            const fetchOptions = {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                },
                body: fd,
            };

            const result = await fetch('http://media.mw.metropolia.fi/wbma/media', fetchOptions);
            const json = await result.json();
            console.log('upload result:', json);
            if (json.file_id) {
                console.log('uploaded file_id', json.file_id);
                const tagdata = {
                    "file_id": json.file_id,
                    "tag": "birdie"
                };
                const addTag = await fetchPOST('tags', tagdata, token);
                console.log('add tag', addTag);
                const _json = await fetchGET('tags/birdie');
                const result = await Promise.all(_json.map(async (item) => {
                    return await fetchGET('media', item.file_id);
                }));
                setMedia(result);
                navigation.push('Home');
            }
        } catch (e) {
            console.log(e.message);
        }
    };
    return {
        handleTitleChange,
        handleDescriptionChange,
        handleUpload,
        inputs,
        errors,
        setErrors,
    };
};

export default useUploadForm;

