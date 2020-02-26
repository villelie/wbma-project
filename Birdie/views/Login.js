/* eslint-disable react/display-name */
import React, {useState, useEffect} from 'react';
import {AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import {fetchGET, fetchPOST} from '../hooks/APIHooks';
import useSignUpForm from '../hooks/LoginHooks';
import {Container, Content, Form, Item, Text, Button, Title, Body, H2, Card, CardItem} from 'native-base';



const Login = (props) => {
  const [toggleForm, setToggleForm] = useState(true);
  const {
    handleUsernameChange,
    handlePasswordChange,
    handleEmailChange,
    handleFullnameChange,
    handleConfirmPasswordChange,
    validateField,
    validateOnSend,
    checkAvail,
    inputs,
    errors,
    setErrors,
  } = useSignUpForm();

  const validationProperties = {
    username: {username: inputs.username},
    email: {email: inputs.email},
    full_name: {full_name: inputs.full_name},
    password: {password: inputs.password},
    confirmPassword: {
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
    },
  };

  const signInAsync = async () => {
    try {
      const user = await fetchPOST('login', inputs);
      console.log('Login', user);
      await AsyncStorage.setItem('userToken', user.token);
      await AsyncStorage.setItem('user', JSON.stringify(user.user));
      props.navigation.navigate('App');
    } catch (e) {
      console.log('signInAsync error: ' + e.message);
      setErrors((errors) =>
        ({
          ...errors,
          fetch: e.message,
        }));
    }
  };
  const registerAsync = async () => {
    const regValid = validateOnSend(validationProperties);
    console.log('reg field errors', errors);
    if (!regValid) {
      return;
    }

    try {
      console.log('sen inputs', inputs);
      const user = inputs;
      delete user.confirmPassword;
      const result = await fetchPOST('users', user);
      console.log('register', result);
      signInAsync();
    } catch (e) {
      console.log('registerAsync error: ', e.message);
      setErrors((errors) =>
        ({
          ...errors,
          fetch: e.message,
        }));
    }
  };


  return (
    <Container>
      <Content>
        {/* login form */}
        {toggleForm &&
          <Form>
            <Title>
              <H2>Login</H2>
            </Title>
            <Item>
              <FormTextInput
                autoCapitalize='none'
                value={inputs.username}
                placeholder='Username'
                onChangeText={handleUsernameChange}
              />
            </Item>
            <Item>
              <FormTextInput
                autoCapitalize='none'
                value={inputs.password}
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={handlePasswordChange}
              />
            </Item>
            <Button full onPress={signInAsync}><Text>Sign in!</Text></Button>
            <Button transparent full onPress={() => {
              setToggleForm(false);
            }}>
              <Text>Dont have account? Sign up!</Text>
            </Button>
          </Form>
        }

        {/* register form */}
        {!toggleForm &&
          <Form>
            <Title>
              <H2>Register</H2>
            </Title>
            <Item>
              <FormTextInput
                autoCapitalize='none'
                value={inputs.username}
                placeholder='Username'
                onChangeText={handleUsernameChange}
                onEndEditing={() => {
                  checkAvail();
                  validateField(validationProperties.username);
                }}
                error={errors.username}
              />
            </Item>
            <Item>
              <FormTextInput
                autoCapitalize='none'
                value={inputs.email}
                placeholder='Email'
                onChangeText={handleEmailChange}
                onEndEditing={() => {
                  validateField(validationProperties.email);
                }}
                error={errors.email}
              />
            </Item>
            <Item>
              <FormTextInput
                autoCapitalize='none'
                value={inputs.full_name}
                placeholder='Full name'
                onChangeText={handleFullnameChange}
                onEndEditing={() => {
                  validateField(validationProperties.full_name);
                }}
                error={errors.full_name}
              />
            </Item>
            <Item>
              <FormTextInput
                autoCapitalize='none'
                value={inputs.password}
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={handlePasswordChange}
                onEndEditing={() => {
                  validateField(validationProperties.password);
                }}
                error={errors.password}
              />
            </Item>
            <Item>
              <FormTextInput
                autoCapitalize='none'
                value={inputs.confirmPassword}
                placeholder='Confirm password'
                secureTextEntry={true}
                onChangeText={handleConfirmPasswordChange}
                onEndEditing={() => {
                  validateField(validationProperties.confirmPassword);
                }}
                error={errors.confirmPassword}
              />
            </Item>
            <Button full onPress={registerAsync}>
              <Text>Register!</Text>
            </Button>
            <Button transparent full onPress={() => {
              setToggleForm(true);
            }}>
              <Text>Do you have account already? Sign in!</Text>
            </Button>
          </Form>
        }
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
    </Container>
  );
};

// proptypes here
Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
