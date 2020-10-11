import React, { Component } from 'react';
import { View, StyleSheet, Text, Alert, AsyncStorage } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Avatar, Divider, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
export default class Account extends Component {
    static navigationOptions = {
        title: 'Account',
        headerTitleStyle: { fontFamily: 'Nexa-Bold', color: 'white' },
        headerStyle: { backgroundColor: '#FF6B6B' }
    }
    state = {
        isUserLogged: false
    }
    componentDidMount = () => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ isUserLogged: true })
            }
        });

    }
    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.isUserLogged ?
                        <View style={{ backgroundColor: 'white', }}>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                                <Avatar
                                    title={auth().currentUser.displayName.charAt(0)}
                                    titleStyle={{ fontFamily: 'Nexa-Bold' }}
                                    size={'large'}
                                    overlayContainerStyle={{ backgroundColor: 'lightgray' }}
                                    avatarStyle={{ borderColor: 'white', borderWidth: 5 }}
                                    rounded
                                    containerStyle={{ marginHorizontal: 10 }}
                                />
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={{ fontFamily: 'Nexa-Bold' }}>{auth().currentUser.displayName}</Text>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>{auth().currentUser.email}</Text>
                                </View>

                            </View>
                            <Divider style={{ margin: 5 }} />
                            <ListItem
                                title={'My Tickets'}
                                titleStyle={{ fontFamily: 'Nexa-Light' }}
                                chevron
                                leftIcon={<Icon name={'ticket'} color={'#ff6b6b'} size={20} />}
                                onPress={() => this.props.navigation.navigate('MyTickets')}
                            />

                            <ListItem
                                title={'Sign out'}
                                titleStyle={{ fontFamily: 'Nexa-Light' }}
                                chevron
                                leftIcon={<Icon name={'sign-out'} color={'#ff6b6b'} size={20} />}
                                onPress={() =>
                                    Alert.alert('', 'Do you want to sign out?',
                                        [
                                            {
                                                text: 'NO',
                                                style: 'cancel'
                                            },
                                            {
                                                text: 'YES',
                                                onPress: async () => {
                                                    await auth().signOut()
                                                    await AsyncStorage.removeItem('token')
                                                    await this.props.navigation.dispatch(StackActions.reset({
                                                        index: 0,
                                                        actions: [
                                                            NavigationActions.navigate({ routeName: 'app' })
                                                        ]
                                                    }))
                                                }

                                            }
                                        ], { cancelable: false })
                                }
                            />
                        </View> :
                        <View>
                            <ListItem
                                title={'Sign in'}
                                titleStyle={{ fontFamily: 'Nexa-Light' }}
                                chevron
                                leftIcon={<Icon name={'sign-in'} color={'#ff6b6b'} size={20} />}
                                onPress={() => {
                                    this.props.navigation.dispatch(StackActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({ routeName: 'app' })
                                        ]
                                    }))
                                }}
                            />
                        </View>
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})