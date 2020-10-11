import Axios from 'axios';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, ListItem, Overlay } from 'react-native-elements';
import { movie_apis } from './apis';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { NavigationActions, StackActions } from 'react-navigation';
export default class PayTicket extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Pay',
            headerTitleStyle: { fontFamily: 'Nexa-Bold', color: 'white' },
            headerStyle: { backgroundColor: '#FF6B6B' },
            headerTintColor: 'white'
        }
    }
    state = {
        visible: false,
        haveData: false,
        title: '',
        poster: '',
        overview: '',
        runtime: '',
        genres: [],
        release_date: '',
        vote_average: '',
        theatre: 'Luxe',
        screens: [
            'Screen I',
            'Screen II',
            'Screen III',
            'Screen IV',
            'Screen V'
        ],
        selected_screen: Math.floor(Math.random() * 5),
        isVisible: false
    }
    componentDidMount = () => {

        Axios.get(movie_apis.get_movie_details + this.props.navigation.getParam('id') + '?api_key=' + movie_apis.api_key)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    this.setState({
                        title: response.data.title,
                        poster: response.data.poster_path,
                        overview: response.data.overview,
                        runtime: response.data.runtime,
                        genres: response.data.genres,
                        release_date: response.data.release_date,
                        vote_average: response.data.vote_average,
                        visible: true,
                        haveData: true
                    })
                }
            }).catch(e => {
                this.setState({
                    visible: true,
                    haveData: false
                })
                console.log(e)
            })
    }
    onClickPay = (mode) => {
        this.setState({
            isVisible: true
        })
        firestore()
            .collection('Users')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    console.log(documentSnapshot.data());
                    let purchased_data = documentSnapshot.data().purchased_tickets
                    console.log(purchased_data)
                    firestore()
                        .collection('Users')
                        .doc(auth().currentUser.uid)
                        .update({
                            purchased_tickets: purchased_data.concat(
                                [
                                    {
                                        title: this.state.title,
                                        show_time: this.props.navigation.getParam('time'),
                                        show_date: this.props.navigation.getParam('date'),
                                        poster: this.state.poster,
                                        amount: this.props.navigation.getParam('price'),
                                        mode_of_payment: mode,
                                        seats: this.props.navigation.getParam('seats'),
                                        screen: this.state.screens[this.state.selected_screen],
                                        theatre: this.state.theatre
                                    }
                                ]
                            )
                        })
                        .then(() => {

                            this.setState({
                                isVisible: false
                            })
                            Alert.alert('Payment successful', 'Tickets booked!',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            this.props.navigation.dispatch(StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({ routeName: 'home' })
                                                ]
                                            }))
                                        }
                                    }
                                ], { cancelable: false })
                        })
                        .catch(e => {
                            console.log(e)
                            this.setState({
                                isVisible: false
                            })
                            Alert.alert('Payment unsuccessful', 'Problem in making payment!',
                                [
                                    { text: 'OK' }
                                ], { cancelable: false })
                        })
                });
            }).catch(e => {
                console.log(e)
                this.setState({
                    isVisible: false
                })
                Alert.alert('Payment unsuccessful', 'Problem in making payment!',
                    [
                        { text: 'OK' }
                    ], { cancelable: false })
            })

    }
    render() {
        if (!this.state.visible) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size='large' color='#ff6b6b' />
                    <Text style={{ fontFamily: 'Nexa-Light', margin: 5, }}>Please wait, while we load details.</Text>
                </View>

            )
        } else {
            if (!this.state.haveData) {
                return (

                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ fontFamily: 'Nexa-Light', }}>There is nothing to show, just yet!</Text>
                    </View>

                )
            } else {
                return (
                    <View style={styles.container}>
                        <Overlay isVisible={this.state.isVisible} height={75} overlayStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ActivityIndicator size='large' color={'dodgerblue'} />
                                <Text style={{ fontFamily: 'Nexa-Light', marginHorizontal: 15 }}>Making Payment...</Text>
                            </View>

                        </Overlay>
                        <ScrollView>
                            <View>
                                <ListItem
                                    title={this.state.title}
                                    subtitle={<Text style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>Overview: {this.state.overview}</Text>}
                                    leftIcon={<Image style={{ width: 75, height: 125 }} source={{ uri: 'https://image.tmdb.org/t/p/w500' + this.state.poster }} />}
                                    titleStyle={{ fontFamily: 'Nexa-Bold' }}
                                    containerStyle={{ margin: 5, borderRadius: 5 }}
                                />
                            </View>
                            <View style={{ margin: 5, padding: 5 }}>
                                <Text style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>Ticket Information</Text>
                                <Divider style={{ marginVertical: 5 }} />
                                <View style={{ marginVertical: 10 }}>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Tickets: <Text style={{ fontFamily: 'Nexa-Light', color: 'black' }}>{this.props.navigation.getParam('seats').length}</Text></Text>
                                    {
                                        this.props.navigation.getParam('seats').length > 0 ?
                                            <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Seats:
                            {
                                                    this.props.navigation.getParam('seats').map((v, i) => {
                                                        return <Text style={{ fontFamily: 'Nexa-Light', color: 'black' }}> {v.seat_id}{i !== (this.props.navigation.getParam('seats').length - 1) ? "," : ""}</Text>
                                                    })
                                                }
                                            </Text> : <View />
                                    }
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Date: <Text style={{ color: 'black' }}>{this.props.navigation.getParam('date')}</Text></Text>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Time: <Text style={{ color: 'black' }}>{new Date(this.props.navigation.getParam('time')).getHours()}:{new Date(this.props.navigation.getParam('time')).getMinutes()}</Text></Text>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Theatre: <Text style={{ color: 'black' }}>{this.state.theatre}</Text></Text>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Screen: <Text style={{ color: 'black' }}>{this.state.screens[this.state.selected_screen]}</Text></Text>
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 5, padding: 5 }}>
                                <Text style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>Billing Information</Text>
                                <Divider style={{ marginVertical: 5 }} />
                                <View style={{ marginVertical: 10 }}>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Total Amount: <Text style={{ color: 'black' }}>{'\u20B9'}{this.props.navigation.getParam('price')}</Text></Text>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Pay Using :</Text>
                                    <View style={{ marginVertical: 15 }}>
                                        <Button
                                            title={'Credit Card'}
                                            titleStyle={{ fontFamily: 'Nexa-Light', color: 'white' }}
                                            buttonStyle={{ backgroundColor: '#1613bf' }}
                                            containerStyle={{ width: '80%', alignSelf: 'center', }}
                                            onPress={() => this.onClickPay('Credit Card')}
                                        />
                                        <Button
                                            title={'Debit Card'}
                                            titleStyle={{ fontFamily: 'Nexa-Light', color: 'white' }}
                                            buttonStyle={{ backgroundColor: '#464646' }}
                                            containerStyle={{ width: '80%', alignSelf: 'center', marginTop: 5 }}
                                            onPress={() => this.onClickPay('Debit Card')}
                                        />
                                        <Button
                                            title={'UPI'}
                                            titleStyle={{ fontFamily: 'Nexa-Light', color: 'white' }}
                                            buttonStyle={{ backgroundColor: '#0c8fed' }}
                                            containerStyle={{ width: '80%', alignSelf: 'center', marginTop: 5 }}
                                            onPress={() => this.onClickPay('UPI')}
                                        />

                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                )
            }
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})