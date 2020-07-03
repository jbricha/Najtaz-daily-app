// Components/Login.js
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { loginUserWithApi } from '../Models/NajtazApi'

const DEFAULT_EMAIL = "jalal.bricha@actschool.ma"
const DEFAULT_PASSWORD = "toto"

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.typedEmail = DEFAULT_EMAIL
        this.typedPassword = DEFAULT_PASSWORD
        this.loggedUser = {}
        this.state = {
            loginError : ""
        }
    }
    
    _loginUser = () => {

        if(this.typedEmail || this.typedPassword) {

            console.log("Login user with email : " + this.typedEmail + 
                    " and pwd :" + this.typedPassword)

            loginUserWithApi(this.typedEmail,this.typedPassword)
                .then(data => {
                    if(String(data.statusCode).startsWith('4')) {
                        this.setState({loginError : data.message})
                    } else if(data.status=="success") {
                        
                        this.loggedUser = data.response

                        if(this.loggedUser.userRole == "COORD") {
                            this.props.navigation.navigate("GroupActivity", {loggedUser : this.loggedUser, comingFrom : "login"})
                        }
                        if(this.loggedUser.userRole == "OBS") {
                            this.props.navigation.navigate("ReportTotalPresences", {loggedUser : this.loggedUser, comingFrom : "login"})
                        }
                        if(this.loggedUser.userRole == "PARTICIPANT") {
                        }
                    }
                })
        } else {
            this.setState({loginError : "Veuillez saisir un email et un mot de passe de Connexion"})
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../assets/najtaz-logo.png')} />
                {/* <Text style={styles.logo}>HeyAPP</Text> */}
                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Votre email"
                        defaultValue={DEFAULT_EMAIL}
                        onChangeText={(text) => this.typedEmail = text} />
                </View>
                <View style={styles.inputView} >
                    <TextInput
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Votre mot de passe"
                        defaultValue={DEFAULT_PASSWORD}
                        onChangeText={(text) => this.typedPassword = text} />
                </View>
                <TouchableOpacity style={styles.errorView} >
                    <Text style={styles.errorText}>{this.state.loginError}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginBtn} onPress={this._loginUser}>
                    <Text style={styles.loginText}>Se Connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        // fontWeight: "bold",
        // fontSize: 50,
        // color: "#fb5b5a",
        width: "20%",
        height: "20%",
        padding: "20%"
    },
    inputView: {
        width: "80%",
        backgroundColor: "#F5F5F5",
        borderRadius: 25,
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        height: 50,
        color: "#003f5c"
    },
    errorView: {
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        color: "red",
        fontSize: 11,
        textAlign: "center"
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "black",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    loginText: {
        color: "white"
    },
    forgotText: {
        color: "black",
        fontSize: 11,
        marginTop: 20,
        marginBottom: 80
    }
});

export default Login