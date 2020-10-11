import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, YellowBox } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import Account from './account';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Axios from 'axios';
import { movie_apis } from './apis';
import { ListItem } from 'react-native-elements';
import MovieDetails from './movieDetails';
import BookTickets from './bookTickets';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PayTicket from './payTicket';
import MyTickets from './myTickets';
class Home extends Component {
    static navigationOptions = {
        title: 'Movies',
        headerTitleStyle: { fontFamily: 'Nexa-Bold', color: 'white' },
        headerStyle: { backgroundColor: '#FF6B6B' }
    }
    constructor() {
        super();
        YellowBox.ignoreWarnings([
            'Warning', 'Accessing', "ListItem"
        ])
    }
    state = {
        show_auth: false,
        page: 1,
        data: [],
        haveData: false,
        visible: false
    }
    componentDidMount = () => {
        this.getMoviesList()
        // firestore()
        //     .collection('Users')
        //     .doc(auth().currentUser.uid)
        //     .set({
        //         name: auth().currentUser.displayName,
        //         email: auth().currentUser.email,
        //         purchased_history: []
        //     })
        //     .then(() => {
        //         console.log('User added!');
        //     });
    }
    getMoviesList = () => {
        Axios.get(movie_apis.get_movies + this.state.page + '&api_key=' + movie_apis.api_key,
            {
                headers: {
                    'Authoization': 'Bearer ' + movie_apis.access_token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response)
                if (response.status == 200 && response.data.results.length !== 0) {

                    let data = this.state.data
                    let concat_array = data.concat(response.data.results)
                    this.setState({ data: concat_array, visible: true, haveData: true })
                }
                console.log(this.state.data)
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
                            data={this.state.data}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={() => this.setState({ page: this.state.page + 1 }, () => this.getMoviesList())}
                            renderItem={({ item, index }) => {
                                return (
                                    <ListItem
                                        title={item.title}
                                        subtitle={<Text numberOfLines={3} style={{ fontFamily: 'Nexa-Light', color: 'gray' }}>Overview: {item.overview}</Text>}
                                        leftIcon={<Image style={{ width: 60, height: 85 }} source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }} />}
                                        titleStyle={{ fontFamily: 'Nexa-Bold' }}
                                        onPress={() => this.props.navigation.navigate('MovieDetails', { title: item.title, id: item.id })}
                                        containerStyle={{ margin: 5, borderRadius: 5 }}
                                        chevron
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

const HomeTab = createStackNavigator({
    Home: Home,
    MovieDetails: MovieDetails,
    BookTickets: BookTickets,
    PayTicket: PayTicket
});
const AccountTab = createStackNavigator({
    Account: Account,
    MyTickets: MyTickets
})
const Tabs = createBottomTabNavigator({
    Home: HomeTab,
    Account: AccountTab
}, {
    defaultNavigationOptions: ({ navigation }) => ({

        tabBarIcon: ({ focused }) => {
            const { routeName } = navigation.state;
            if (routeName === 'Home') {
                return <Icon name='home' size={20} color={focused ? '#FF6B6B' : 'gray'} />
            } else if (routeName === 'Account') {
                return <Icon name='user-alt' size={20} color={focused ? '#FF6B6B' : 'gray'} />
            }

        },
        tabBarOptions: {

            pressColor: '#FF6B6B',
            style: {
                height: 60,
            },
            activeTintColor: '#FF6B6B',
            inactiveTintColor: 'gray',
            labelStyle: {
                fontFamily: 'Nexa-Light',
                fontSize: 12,
                marginBottom: 6,
            },
        },

    })
}

);

export default createAppContainer(Tabs);
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})