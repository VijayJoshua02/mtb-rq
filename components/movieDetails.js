import Axios from 'axios';
import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { movie_apis } from './apis';
import auth from '@react-native-firebase/auth';
export default class MovieDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
            headerTitleStyle: { fontFamily: 'Nexa-Bold', color: 'white' },
            headerStyle: { backgroundColor: '#FF6B6B' },
            headerTintColor: 'white'
        }
    }
    state = {
        visible: false,
        haveData: false,
        poster: '',
        overview: '',
        runtime: '',
        genres: [],
        release_date: '',
        vote_average: '', 
        showBooking: false
    }
    componentDidMount = () => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({showBooking: true})
            }
         });
      
        Axios.get(movie_apis.get_movie_details + this.props.navigation.getParam('id') + '?api_key=' + movie_apis.api_key)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    this.setState({
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
                        <ScrollView>
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Image style={{ width: 250, height: 400, borderRadius: 5 }} source={{ uri: 'https://image.tmdb.org/t/p/w500' + this.state.poster }} />
                            </View>
                            <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                    <Icon name='star' color={'#ebd534'} size={15} />
                                    <Text style={{ fontFamily: 'Nexa-Bold', fontSize: 13, marginHorizontal: 5 }}>{this.state.vote_average}</Text>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>{Math.floor(this.state.runtime / 60)}h {this.state.runtime % 60}m |
                                {
                                            this.state.genres.map((v, i) => {
                                                return (
                                                    <Text> {v.name}{i !== (this.state.genres.length - 1) ? "," : ""}</Text>
                                                )
                                            })
                                        }
                                    </Text>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ fontFamily: 'Nexa-Light' }}>{this.state.overview}</Text>
                                </View>
                            </View>
                            {
                                this.state.showBooking ? 
                                <View style={{ marginVertical: 15 }}>
                                <Button
                                    title={'Book Tickets'}
                                    titleStyle={{ fontFamily: 'Nexa-Bold', color: 'white' }}
                                    buttonStyle={{ backgroundColor: 'dodgerblue', margin: 5 }}
                                    containerStyle={{width: '75%', alignSelf: 'center'}}
                                    onPress={() => this.props.navigation.navigate('BookTickets', {title: this.props.navigation.getParam('title'), id: this.props.navigation.getParam('id')})}
                                    icon={<Icon name={'ticket'} color={'white'} size={20} style={{marginRight: 10}}/>}
                                />
                            </View> : <View/>
                            }
                           
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