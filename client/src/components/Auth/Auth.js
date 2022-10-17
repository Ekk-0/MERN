import React, {useState, useEffect} from 'react'
import useStyles from './styles'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { GoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { gapi } from "gapi-script";
import Icon from './icon'
import {useDispatch} from 'react-redux';

import Input from './Input';
import {signin, signup} from '../../actions/auth';

function Auth() {
    const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

    const classes = useStyles();
    const history = useHistory();
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    useEffect(() => {
      function start() {
        gapi.client.init({
          clientId: "616907974075-rnd986mrnbpn5ho03ku3hdub8uqcq4ua.apps.googleusercontent.com",
          scope: 'email',
        });
      }
  
      gapi.load('client:auth2', start);
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();

      if(isSignUp) {
        dispatch(signup(formData, history));
      }else {
        dispatch(signin(formData, history))
      }
    }

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const switchMode = () => {
      setIsSignUp((prevIsSignUp) => !prevIsSignUp);
      setShowPassword(false);
    }

    const googleSuccess = async (res) => {
      const result = res?.profileObj;
      const token = res?.tokenId;

      try {
        dispatch({ type: 'AUTH', data: {result, token}});

        history.push('/');
      } catch (error) {
        console.log(result);
      }
      
    }

    const googleFailure = (error) => {
      console.log(error);
      console.log("Google Sign In was unsuccessful. Try Again Later");
    }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignUp && (
                <>
                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )
            }
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword}  />
            { isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type='password' />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleSubmit} >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            clientId="616907974075-rnd986mrnbpn5ho03ku3hdub8uqcq4ua.apps.googleusercontent.com"
            render={(renderProps) => <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disable={renderProps.disabled} startIcon={<Icon />} variant="contained">Google Sign In</Button>}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            
            cookiePolicy={'single_host_origin'}
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth