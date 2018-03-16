import React, { Component } from 'react';
import {View, Text,StyleSheet, TouchableOpacity} from 'react-native';

import { Container, Content, Header, Icon, Left, Title, Body, Button } from 'native-base';

import {StackNavigator} from 'react-navigation';

var t = require('tcomb-form-native');
var Form = t.form.Form;
import axios from 'axios';

export default class Registration extends Component{
    
    static navigationOptions={
        title : 'Registration',
        headerStyle:{backgroundColor:'#fff'},
        headerTitleStyle:{color:'#212121'},
        Header:true
    }

    componentDidMount() {
        debugger;
        axios.get('/Register/GetRegistration/'+this.props.navigation.state.params.UserID)
        .then(function (response) {
            debugger;
            var regi= response.data.registration;
            this.setState({
                status: (response.data.registration.IsOTPVerified === null || response.data.registration.IsOTPVerified === true) ? true : false,
                reg: response.data.registration,
            });
            //alert(this.state.status+'<<<<>>>>'+response.data.registration.IsOTPVerified);
            console.log(this.state.status);
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });
    }

    constructor(props)
    {
        super(props);
        this.state ={
            status:true,
            reg:{
                ID:null,
                Email:null,
                FullName: null,             
                MobileNo: null, 
                Password: null,
                OTPNo:null,
                IsOTPSent:null,
                OTPSentDate:null,
                IsOTPReSent:null,
                OTPSentCount:null,
                CountryCode:null,
                IsOTPVerified:null
            },
            OtpOptions:{
                fields:{
                    OTPN:{
                        label: 'OTP',
                        placeholder:'Please Enter OTP Number',
                        help: 'Resend OTP'
                    }
                }
            },
            registrationOption:{
                //auto: 'placeholders'
                fields:{
                    FullName: {
                        label: 'Full Name',
                        placeholder:'Enter Your Full Name',
                        //error:'Please Enter Your Name'        
                    },
                    MobileNo: {
                        label: 'Mobile No',
                        placeholder:'Enter Your Mobile No',
                        //error:'Please Enter Your Mobile Number'        
                    },
                    Email: {
                        label: 'Email ID',
                        placeholder:'Enter Your Email ID'
                    },
                    Password: {
                        label: 'Password',
                        placeholder:'Enter Your Password',
                        password: true,
                        secureTextEntry: true,
                        //error:'Please Enter Your Password'        
                    } ,
                    ReEnterPassword: {
                        label: 'Re-Password',
                        placeholder:'Re-Enter Your Password',
                        password: true,
                        secureTextEntry: true,
                        error:'Password Mismatch'        
                    }
                }
            }
        },
        this.Otp=t.struct({
            OTPN:t.Number
        })
        
        const ConfirmPasswordEquality = t.refinement(t.String, value => {
            return value === this.state.reg.Password
        })
        
        this.registration = t.struct({
            Email:t.String,
            FullName: t.String,             
            MobileNo: t.Number,  
            Password: t.String,
            ReEnterPassword: ConfirmPasswordEquality,       
        });        
    }

    SaveRegistration = () => {
        Keyboard.dismiss();
        var value = this.refs.form.getValue();
        
        if (value) {
            var data = {
                ID:this.state.reg.ID,
                Email:this.state.reg.Email,
                FullName:this.state.reg.FullName,
                MobileNo:this.state.reg.MobileNo,
                Password:this.state.reg.Password
            }
            axios({
                method: 'post',
                url: '/Register/Save',
                data: data
              })
              .then(function (response) { 
                debugger;   
                this.setState({
                    reg: response.data.registration,
                    status: response.data.registration.IsOTPVerified===null || response.data.registration.IsOTPVerified===true ? true : false
                });       
              }.bind(this))
              .catch(function (error) {
                console.log(error);
            });
        }
    }

    
    UpdateOTPStatus = () => {
        Keyboard.dismiss();
        var value = this.refs.form.getValue();        
        if (value) {
            var data = {
                ID:this.state.reg.ID,
                OTPNo:value.OTPN
            }
            debugger;
            axios({
                method: 'post',
                url: '/Register/UpdateOTPStatus',
                data: data
            })
            .then(function (response) { 
                debugger;  
                    if(response.data.msg=="Failed"){
                        alert("Invalid OTP. Please try with correct OTP.");
                    }
                    else
                    {
                        this.props.navigation.navigate('FarmProfile'); 
                    }
            }.bind(this))

            .catch(function (error) {
                console.log(error);
            });
        }
    }

    onChange = (reg) => {
        this.setState({reg:reg});
    }

    render(){
        return(
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Registration</Title>
                    </Body>
                </Header>
                <Content style={styles.container}>
                    <View>
                        <Form
                            ref='form'
                            type={this.state.status? this.registration:this.Otp}
                            options={this.state.status? this.state.registrationOption:this.state.OtpOptions}
                            value={this.state.reg}
                            onChange={this.onChange}
                        />

                        <Button success block rounded onPress={this.state.status ? this.SaveRegistration.bind(this):this.UpdateOTPStatus.bind(this)}>
                            <Text style={{color:'#fff', fontWeight:'bold', fontSize:18}}>{this.state.status?'Sign Up':'Submit'}</Text>
                        </Button>
                    </View>
                </Content>
            </Container>                
        );
    }  
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //marginTop: 120,
        padding: 20,
        backgroundColor: '#ffffff',      
    }
  });
