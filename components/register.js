import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Button, Input, Overlay } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationActions, StackActions } from 'react-navigation';

export default class Register extends Component {
    static navigationOptions = {
        headerShown: false
    }
    state = {
        name: '',
        isClosePW: true,
        isCloseCPW: true,
        email: '',
        password: '',
        confirm_password: '',
        loading: false,
        errorCPW: '',
        errorPW: '',
        errorName: '',
        errorMail: '',
        isValidName: false,
        isValidMail: false,
        isValidPW: false,
        isValidCPW: false
    }

    password = (type) => {
        if (type == 'pw') {
            if (!this.state.isClosePW) {
                return (
                    <Icon
                        name="eye"
                        size={20}
                        color="gray"
                        style={{ marginRight: 10 }}
                        onPress={() => {
                            this.setState({ isClosePW: true });
                        }}
                    />
                );
            } else {
                return (
                    <Icon
                        name="eye-off"
                        size={20}
                        color="gray"
                        style={{ marginRight: 10 }}
                        onPress={() => {
                            this.setState({ isClosePW: false });
                        }}
                    />
                );
            }
        } else {
            if (!this.state.isCloseCPW) {
                return (
                    <Icon
                        name="eye"
                        size={20}
                        color="gray"
                        style={{ marginRight: 10 }}
                        onPress={() => {
                            this.setState({ isCloseCPW: true });
                        }}
                    />
                );
            } else {
                return (
                    <Icon
                        name="eye-off"
                        size={20}
                        color="gray"
                        style={{ marginRight: 10 }}
                        onPress={() => {
                            this.setState({ isCloseCPW: false });
                        }}
                    />
                );
            }
        }

    };
    onClickRegister = () => {
        this.setState({
            errorCPW: '',
            errorMail: '',
            errorName: '',
            errorPW: ''
        })

        if (this.state.name !== '' && this.state.email !== '' && this.state.password !== '' && this.state.confirm_password !== '') {
            if (/^[a-zA-Z ]+$/.test(this.state.name)) {
                this.setState({
                    isValidName: true
                })
            } else {
                this.setState({
                    errorName: 'Name should be alphabetic!'
                })
            }
            if (this.state.email.indexOf('@') > -1) {
                this.setState({
                    isValidMail: true
                })
            } else {
                this.setState({
                    errorMail: 'Invalid email address!'
                })
            }
            if (this.state.password.indexOf(' ') == -1) {
                this.setState({
                    isValidPW: true
                })
            } else {
                this.setState({
                    errorPW: 'Password should not contain spaces!'
                })
            }
            if (this.state.password == this.state.confirm_password) {
                this.setState({
                    isValidCPW: true
                })
            } else {
                this.setState({
                    errorCPW: "Passwords didn't match!"
                })
            }
            if (this.state.isValidName && this.state.isValidMail && this.state.isValidPW && this.state.isValidCPW) {
                
                this.setState({ loading: true })
                auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password)
                    .then(async (userCredentials) => {
                        console.log(userCredentials)

                        if (userCredentials.user) {
                            userCredentials.user.updateProfile({
                                displayName: this.state.name,
                            })
                            firestore()
                            .collection('Users')
                            .doc(auth().currentUser.uid)
                            .set({
                                uid: auth().currentUser.uid,
                                name: this.state.name,
                                email: this.state.email.trim(),
                                purchased_tickets: []
                            })
                            .then(() => {
                                console.log('User added!');
                            });
                        }
                        this.setState({ loading: false })
                        Alert.alert(
                            "Verification",
                            'A verification link has been sent to "' + this.state.email + '". Please verify in order to complete the registration.',
                            [
                                {
                                    text: "Ok",
                                    onPress: () => {
                                        this.props.navigation.dispatch(StackActions.reset({
                                            index: 0,
                                            actions: [
                                              NavigationActions.navigate({ routeName: 'login' })
                                            ]
                                          }))

                                    }
                                },

                            ],
                            { cancelable: true }
                        );
                    }).catch(e => {
                        this.setState({ loading: false })
                        Alert.alert('', e.message, [
                            {
                                text: 'OK',
                            }
                        ], {cancelable: false})
                    })
            }
        } else {
            Alert.alert('', 'Fields should not be empty!', [{ text: 'OK' }], { cancelable: false })
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <Overlay isVisible={this.state.loading} height={75} overlayStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ActivityIndicator size='large' color={'#ff6b6b'} />
                        <Text style={{ fontFamily: 'Nexa-Light', marginHorizontal: 20 }}>Registering...</Text>
                    </View>

                </Overlay>
                <View style={{ alignItems: 'center', backgroundColor: '#ff6b6b', paddingVertical: 50 }}>
                    <Text style={{ fontSize: 50, color: 'white', fontFamily: 'Nexa-Bold' }}>MTB-RQ</Text>
                </View>
                <View style={{ borderRadius: 5, padding: 15, marginHorizontal: 15, marginTop: '5%' }}>
                    <View><Text style={{ fontFamily: 'Nexa-Bold', margin: 10, fontSize: 20, color: '#ff6b6b' }}>REGISTER</Text></View>
                    <View style={{ marginTop: '2%' }}>
                        <View>
                            <Input
                                returnKeyType="next"
                                onSubmitEditing={() => { this.passwordInput.focus(); }}
                                ref={(input) => { this.nameInput = input; }}
                                inputStyle={styles.input_style}
                                placeholder="Name"
                                leftIcon={
                                    <Icon
                                        name="user"
                                        size={20}
                                        color="gray"
                                        style={{ marginRight: 5 }}
                                    />
                                }

                                onChangeText={text => {
                                    this.setState({ name: text, errorName: '' });
                                }}
                                errorMessage={this.state.errorName}
                                errorStyle={{fontFamily:  'Nexa-Light'}}
                            />
                        </View>


                        <Input
                            returnKeyType="next"
                            onSubmitEditing={() => { this.nameInput.focus(); }}
                            inputStyle={styles.input_style}
                            placeholder="Email"
                            leftIcon={
                                <Icon
                                    name="mail"
                                    size={20}
                                    color="gray"
                                    style={{ marginRight: 5 }}
                                />
                            }

                            onChangeText={text => {
                                this.setState({ email: text, errorMail: '' });
                            }}
                            errorMessage={this.state.errorMail}
                            errorStyle={{fontFamily:  'Nexa-Light'}}
                        />
                    </View>



                    <View>
                        <Input
                            ref={(input) => { this.passwordInput = input; }}
                            returnKeyType="next"
                            onSubmitEditing={() => { this.passwordConfirmInput.focus(); }}
                            placeholder="Password"
                            leftIcon={
                                <Icon
                                    name="lock"
                                    size={20}
                                    color="gray"
                                    style={{ marginRight: 5 }}
                                />
                            }
                            inputStyle={styles.input_style}
                            onChangeText={text => {
                                this.setState({ password: text, errorPW: '', errorCPW: '' });
                            }}
                            rightIcon={this.password('pw')}
                            secureTextEntry={this.state.isClosePW}
                            errorMessage={this.state.errorPW}
                            errorStyle={{fontFamily:  'Nexa-Light'}}
                        />
                    </View>
                    <View>
                        <Input
                            ref={(input) => { this.passwordConfirmInput = input; }}
                            placeholder="Confirm Password"
                            leftIcon={
                                <Icon
                                    name="lock"
                                    size={20}
                                    color="gray"
                                    style={{ marginRight: 5 }}
                                />
                            }
                            inputStyle={styles.input_style}
                            onChangeText={text => {
                                this.setState({ confirm_password: text, errorCPW: '' });
                            }}
                            rightIcon={this.password('cpw')}
                            secureTextEntry={this.state.isCloseCPW}
                            errorMessage={this.state.errorCPW}
                            errorStyle={{fontFamily:  'Nexa-Light'}}
                        />
                    </View>
                    <View style={{ marginVertical: '5%' }}>
                        <Button
                            title="REGISTER"
                            titleStyle={{ fontFamily: 'Nexa-Bold' }}
                            buttonStyle={{ backgroundColor: '#ff6b6b', borderRadius: 30 }}
                            containerStyle={{ width: '80%', alignSelf: 'center' }}
                            onPress={() => { this.onClickRegister() }}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text
                        style={{ fontFamily: 'Nexa-Light' }}>
                        Already have an account?  <Text
                            style={{ fontFamily: 'Nexa-Light', color: '#ff6b6b' }}
                            onPress={() => this.props.navigation.navigate('login')}>Sign In</Text>
                    </Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    input_style: { fontFamily: 'Nexa-Light', fontSize: 15 }
})