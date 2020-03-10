import {useState, useContext} from 'react';
import {AsyncStorage} from 'react-native';
import validate from 'validate.js';


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

const useModifyForm = (initialInputs) => {
    const [inputs, setInputs] = useState(initialInputs || {});
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

    const handleModify = async (navigation) => {
        const moreData = {
            description: inputs.description,
            rarity: inputs.rarity,
            location: inputs.location,
        };
        const id = navigation.state.params.file.file_id;
        const body = {
            title: inputs.title,
            description: JSON.stringify(moreData)
        }

        console.log("trying to modify", id, moreData)
        try {
            const token = await AsyncStorage.getItem('userToken');

            const fetchOptions = {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify(body),
            };

            const result = await fetch(`http://media.mw.metropolia.fi/wbma/media/${id}`, fetchOptions);
            const json = await result.json();
            console.log('Modify result:', json);
        } catch (e) {
            console.log(e.message);
        }
    };

    const validateOnSend = (fields) => {
        for (const [key, value] of Object.entries(fields)) {
            console.log(key, value);
            validateField(value);
        }

        if (errors.title !== undefined ||
            errors.description !== undefined
        ) {
            return false;
        } else {
            return true;
        }
    };

    return {
        validateOnSend,
        handleTitleChange,
        handleDescriptionChange,
        handleRarityChange,
        handleLocationChange,
        handleModify,
        inputs,
        errors,
        setErrors,
        validateField,
    };
};

export default useModifyForm;

