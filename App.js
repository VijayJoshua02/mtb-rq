import React, { Component } from 'react';
import { View, StyleSheet, Text, Animated, YellowBox, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements';
import { createAppContainer, NavigationActions, StackActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import auth from '@react-native-firebase/auth'
class App extends Component {
  static navigationOptions = {
    headerShown: false
  }
  state = {
    show_auth: false,
  }
  constructor(props) {
    super(props)
    this.fadeAnimation1 = new Animated.Value(0)
    this.fadeAnimation2 = new Animated.Value(0)
    this.fadeAnimation3 = new Animated.Value(0)
    YellowBox.ignoreWarnings([
      'Warning', 'Accessing'
    ])
  }
  componentDidMount() {
    Animated.timing(this.fadeAnimation1, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
    Animated.timing(this.fadeAnimation2, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
    Animated.timing(this.fadeAnimation3, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start()


    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          show_auth: false
        })
        AsyncStorage.getItem('token')
        .then(value => {
          if(value == auth().currentUser.uid){
            setTimeout(() => {
              this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'home' })
                ]
              }))
           }, 2000)
          } else {
            this.setState({
              show_auth: true
            })
          }
        })
      } else {
        this.setState({
          show_auth: true
        })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginHorizontal: 40, marginTop: '25%' }}>
          <Animated.Text style={[styles.app_title, { opacity: this.fadeAnimation1 }]}>
            Movie
        </Animated.Text>
          <Animated.Text style={[styles.app_title, { opacity: this.fadeAnimation2 }]}>Ticket</Animated.Text>
          <Animated.Text style={[styles.app_title, { opacity: this.fadeAnimation3 }]}>Booking</Animated.Text>
        </View>
        {this.state.show_auth ?

          <View>
            <View style={{ alignItems: 'flex-end', marginTop: 150 }}>
              <Button
                title={'Register'}
                titleStyle={{ fontFamily: 'Nexa-Light', color: '#FF6B6B', fontSize: 20 }}
                buttonStyle={{ backgroundColor: 'white' }}
                containerStyle={{ marginHorizontal: 50, margin: 10, width: '40%' }}
                raised
                onPress={() => this.props.navigation.navigate('register')}
              />
              <Button
                title={'Login'}
                titleStyle={{ fontFamily: 'Nexa-Light', color: 'white', fontSize: 20 }}
                buttonStyle={{ backgroundColor: '#FF6B6B', borderColor: 'white', borderWidth: 1 }}
                containerStyle={{ marginHorizontal: 50, margin: 5, width: '40%' }}
                raised
                onPress={() => this.props.navigation.navigate('login')}
              />
            </View>
            <View style={{ marginTop: '25%', alignSelf: 'center' }}>
              <Text style={{ fontFamily: 'Nexa-Light', color: 'white', textDecorationLine: 'underline', textDecorationColor: 'white' }}
                onPress={() => {
                  this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'home' })
                    ]
                  }))
                }}>skip</Text>
            </View>
          </View> : <View />
        }

      </View>
    )
  }
}
const AppNavigator = createStackNavigator({
  app: App,
  home: {
    screen: Home,
    navigationOptions: {
      headerShown: false
    },

  }, register: {
    screen: Register
  }, login: {
    screen: Login
  }

})
export default createAppContainer(AppNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B'
  },
  app_title: {
    fontFamily: 'Nexa-Bold', color: 'white', fontSize: 45
  }
})