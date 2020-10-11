import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Button, Overlay } from 'react-native-elements';
import { ScrollView, TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { add } from 'react-native-reanimated';
export default class BookTickets extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
            headerTitleStyle: { fontFamily: 'Nexa-Bold', color: 'white' },
            headerStyle: { backgroundColor: '#FF6B6B' },
            headerTintColor: 'white'
        }
    }
    state = {
        seats: [],
        selected_seats: [],
        price: 0,
        date: '',
        time: -1,
        isVisible: true,
        show_timings: []
    }
    componentDidMount = () => {
        let data = []
        for (let i = 0; i < 216; i++) {
            data.push({
                seat_id: 'A' + i,
                selected: false
            })
        }
        this.setState({
            seats: data
        })

    }

    render() {
        return (
            <View style={styles.container}>

                <Overlay isVisible={this.state.isVisible} overlayStyle={{ justifyContent: 'center', width: '75%' }}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontFamily: 'Nexa-Bold', alignSelf: 'center' }}>Show Timing</Text>

                        <View style={{ margin: 5 }}>
                            <Text style={{
                                color: "gray",
                                marginLeft: 10,
                                fontSize: 15,
                                fontFamily: 'Nexa-Light'
                            }}>Date</Text>
                            <DatePicker
                                placeholder='Select Date'
                                format={'YYYY-MM-DD'}
                                date={this.state.date}
                                minDate={new Date()}
                                style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}
                                showIcon={false}
                                onDateChange={(date) => {

                                    let data = [
                                        {
                                            time: new Date(date).getTime() + (4 * 60 * 60 * 1000)
                                        }, {
                                            time: new Date(date).getTime() + (7 * 60 * 60 * 1000)
                                        }, {
                                            time: new Date(date).getTime() + (10 * 60 * 60 * 1000)
                                        }, {
                                            time: new Date(date).getTime() + (13 * 60 * 60 * 1000)
                                        }, {
                                            time: new Date(date).getTime() + (16 * 60 * 60 * 1000)
                                        }
                                    ]

                                    console.log(data)
                                    this.setState({ date: date, show_timings: data })
                                }}

                                customStyles={{
                                    dateInput: {
                                        borderRadius: 5,

                                    },
                                    placeholderText: {
                                        fontFamily: 'Nexa-Light', color: 'gray'
                                    }, dateText: {
                                        fontFamily: 'Nexa-Light',
                                    }
                                }}
                            />
                        </View>
                        {
                            this.state.show_timings.length > 0
                                ?
                                <View style={{ margin: 5 }}>
                                    <Text style={{
                                        color: "gray",
                                        marginLeft: 10,
                                        fontSize: 15,
                                        fontFamily: 'Nexa-Light'
                                    }}>Time</Text>
                                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                                        {
                                            this.state.show_timings.map((v, i) => {
                                                return (
                                                    <TouchableOpacity style={{margin: 5}}>
                                                        <View style={{ padding: 3, borderColor: this.state.time == v.time ? 'dodgerblue' : 'lightgray', borderWidth: 1, borderRadius: 10,  alignSelf: 'center', opacity: v.time > new Date().getTime() ? 1 : 0.5, backgroundColor: v.time > new Date().getTime() ? 'white' : 'lightgray' }} >
                                                            <Text onPress={() => {
                                                                if (v.time > new Date().getTime()) {
                                                                    this.setState({
                                                                        time: v.time
                                                                    })
                                                                }

                                                            }} style={{ fontFamily: 'Nexa-Light', color: this.state.time == v.time ? 'dodgerblue' : 'gray' }}>{new Date(v.time).getHours()}:{new Date(v.time).getMinutes()}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }

                                    </View></View> : <View />
                        }
                        <View>

                        </View>
                        <TouchableOpacity>
                            <Text style={{ alignSelf: 'center', color: 'dodgerblue', fontFamily: 'Nexa-Bold', margin: 10 }} onPress={() => {
                                this.setState({
                                    isVisible: false
                                })
                            }}>OK</Text>
                        </TouchableOpacity>
                    </View>

                </Overlay>
                <View style={{ backgroundColor: 'white', padding: 10, paddingHorizontal: 15, margin: 0 }}>
                    <Text style={{ fontFamily: 'Nexa-Bold' }}>{this.state.selected_seats.length} {this.state.selected_seats.length == 1 ? 'Ticket' : 'Tickets'}</Text>
                    {
                        this.state.selected_seats.length > 0 ?
                            <Text style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>Seats:
                            {
                                    this.state.selected_seats.map((v, i) => {
                                        return <Text> {v.seat_id}{i !== (this.state.selected_seats.length - 1) ? "," : ""}</Text>
                                    })
                                }
                            </Text> : <View />
                    }
                </View>

                <ScrollView>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', margin: 10 }}>
                        {
                            this.state.seats.map((v, i) => {
                                return <TouchableOpacity onPress={() => {
                                    let data = this.state.seats
                                    data[i].selected = !data[i].selected
                                    let selected = data.filter(data => data.selected)
                                    let price = (selected.length) * 100
                                    this.setState({
                                        seats: data,
                                        selected_seats: selected,
                                        price: price
                                    })
                                }}><Image style={{ width: 20, height: 20, tintColor: v.selected ? 'red' : 'gray', margin: 5, alignSelf: 'center' }} source={require('../icons/cinema-chair.png')} /></TouchableOpacity>
                            })

                        }
                    </View>
                </ScrollView>

                <View style={{ backgroundColor: 'white', padding: 5 }}>
                    <Button
                        containerStyle={{ width: '95%', alignSelf: 'center' }}
                        buttonStyle={{ backgroundColor: 'dodgerblue' }}
                        titleStyle={{ fontFamily: 'Nexa-Light', color: 'white' }}
                        title={'Pay ' + '\u20B9' + this.state.price}
                        onPress={() => {
                            if (this.state.price !== 0) {
                                if(this.state.date !== '' && this.state.time !== -1){
                                    this.props.navigation.navigate('PayTicket', { id: this.props.navigation.getParam('id'), price: this.state.price, seats: this.state.selected_seats, time: this.state.time, date: this.state.date })
                                } else {
                                    this.setState({
                                        isVisible: true
                                    })
                                }
                              
                            }
                        }}
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})