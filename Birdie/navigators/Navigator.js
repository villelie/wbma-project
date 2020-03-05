/* eslint-disable react/display-name */
import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Modify from '../views/Modify';
import AuthLoading from '../views/AuthLoading';
import Login from '../views/Login';
import Upload from '../views/Upload';
import MyFiles from '../views/MyFiles';
import {Icon} from 'native-base';

const TabNavigator = createBottomTabNavigator(
    {
        Home,
        Profile,
        Upload,
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: () => {
                const {routeName} = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = 'home';
                } else if (routeName === 'Profile') {
                    iconName = 'person';
                } else if (routeName === 'Upload') {
                    iconName = 'add';
                }

                return <Icon
                    name={iconName}
                    size={25}
                    color={'white'}
                />;
            },
        }),
        tabBarOptions: {
            activeTintColor: 'black',
            inactiveTintColor: 'white',
            activeBackgroundColor: 'white',
            inactiveBackgroundColor: '#4FA345',
        },
    },
);

TabNavigator.navigationOptions = ({navigation}) => {
    const {routeName} = navigation.state.routes[navigation.state.index];
    const headerTitle = routeName;
    return {
        headerTitle,
    };
};

const StackNavigator = createStackNavigator(
    {
        Home: {
            screen: TabNavigator,
            navigationOptions: {
                headerShown: false
            },
        },
        Single: {
            screen: Single,
            navigationOptions: {
                headerShown: false
            },
        },
        Modify: {
            screen: Modify,
            navigationOptions: {
                headerShown: false
            },
        },
        MyFiles: {
            screen: MyFiles,
            navigationOptions: {
                headerShown: false
            },
        },
        Logout: {
            screen: Login,
        },
    },
);

const Navigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        App: StackNavigator,
        Auth: Login,
    },
    {
        initialRouteName: 'AuthLoading',
    },
);

export default createAppContainer(Navigator);