import {useState, useContext} from 'react';
import {AsyncStorage} from 'react-native';
import validate from 'validate.js';
import {fetchGET, fetchPOST} from './APIHooks';
import {MediaContext} from '../contexts/MediaContext';

const constraints = {
    title: {
        presence: {
            message: 'cannot be blank.',
        },
        length: {
            minimum: 3,
            message: 'must be at least 3 characters',
        },
    },
    description: {
        presence: {
            message: 'cannot be blank.',
        },
    },
}

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
    const handleSexChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                sex: text,
            }));
    };
    const handleRarityChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                rarity: text,
            }));
    };
    const handleLocationChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                location: text,
            }));
    };

    const validateField = (attr) => {
        const copy = {...attr};
        const attrName = Object.keys(copy).pop(); // get the only or last item from array
        const valResult = validate(copy, constraints);
        console.log('valresult', valResult);
        let valid = undefined;
        if (valResult[attrName]) {
            valid = valResult[attrName][0]; // get just the first message
        }
        setErrors((errors) =>
            ({
                ...errors,
                [attrName]: valid,
                fetch: undefined,
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
        const moreData = {
            description: inputs.description,
            sex: inputs.sex,
            rarity: inputs.rarity,
            location: inputs.location,
        };
        const fd = new FormData();
        fd.append('title', inputs.title);
        fd.append('description', JSON.stringify(moreData));
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

    const validateOnSend = (fields) => {
        for (const [key, value] of Object.entries(fields)) {
            console.log(key, value);
            validateField(value);
        }

        if (errors.title !== undefined || errors.description !== undefined) {
            return false;
        } else {
            return true;
        }
    };

    return {
        validateOnSend,
        handleTitleChange,
        handleDescriptionChange,
        handleSexChange,
        handleRarityChange,
        handleLocationChange,
        handleUpload,
        inputs,
        errors,
        setErrors,
        validateField
    };
};

export default useUploadForm;

