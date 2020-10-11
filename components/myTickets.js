import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert, FlatList, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Divider, ListItem } from 'react-native-elements';
export default class MyTickets extends Component {
    static navigationOptions = {
        title: 'My Tickets',
        headerTitleStyle: { fontFamily: 'Nexa-Bold', color: 'white' },
        headerStyle: { backgroundColor: '#FF6B6B' },
        headerTintColor: 'white'
    }
    state = {
        tickets: [],
        visible: false,
        haveData: true
    }
    componentDidMount = () => {
        firestore()
            .collection('Users')
            .doc(auth().currentUser.uid)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.data().purchased_tickets.length !== 0) {
                    this.setState({
                        tickets: documentSnapshot.data().purchased_tickets,
                        visible: true,
                        haveData: true
                    })
                } else {
                    this.setState({
                        visible: true,
                        haveData: false
                    })
                }

            }).catch(e => {
                console.log(e)
                Alert.alert('', 'Problem in fetching tickets!', [
                    {
                        text: 'OK'
                    }
                ], { cancelable: false })
                this.setState({
                    visible: true,
                    haveData: false
                })
            })
    }
    render() {
        if (!this.state.visible) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size='large' color='#ff6b6b' />
                    <Text style={{ fontFamily: 'Nexa-Light', margin: 5, }}>Please wait, while we load movies.</Text>
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
                        <FlatList
                            data={this.state.tickets}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <ListItem
                                        title={item.title}
                                        subtitle={
                                            <View style={{width: '100%'}}>
                                                <Divider style={{ marginVertical: 5 }} />
                                                <View style={{ marginVertical: 10 }}>
                                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Tickets: <Text style={{ fontFamily: 'Nexa-Light', color: 'black' }}>{item.seats.length}</Text></Text>
                                                    {
                                                        item.seats.length > 0 ?
                                                            <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Seats:
                            {
                                                                    item.seats.map((v, i) => {
                                                                        return <Text style={{ fontFamily: 'Nexa-Light', color: 'black' }}> {v.seat_id}{i !== (item.seats.length - 1) ? "," : ""}</Text>
                                                                    })
                                                                }
                                                            </Text> : <View />
                                                    }
                                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Date: <Text style={{ color: 'black' }}>{item.show_date}</Text></Text>
                                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Time: <Text style={{ color: 'black' }}>{new Date(item.show_time).getHours()}:{new Date(item.show_time).getMinutes()}</Text></Text>
                                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Theatre: <Text style={{ color: 'black' }}>{item.theatre}</Text></Text>
                                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Screen: <Text style={{ color: 'black' }}>{item.screen}</Text></Text>
                                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray', marginVertical: 2 }}>Mode of Payment: <Text style={{ color: 'black' }}>{item.mode_of_payment}</Text></Text></View>
                                            </View>
                                        }
                                        leftIcon={<Image style={{ width: 100, height: 200, borderRadius: 5}} source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster }} />}
                                        titleStyle={{ fontFamily: 'Nexa-Bold' }}
                                        containerStyle={{ margin: 5, borderRadius: 5 }}
                                    />
                                )
                            }}
                        />
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