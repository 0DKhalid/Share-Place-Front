import React, { useState, useContext } from 'react';
import { useForm } from '../../shared/hooks/form-hook';

import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import Card from '../../shared/components/UIElements/Card/Card';
import Input from '../../shared/components/FormElements/Input/Input';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/Validator';
import Button from '../../shared/components/FormElements/Button/Button';
import './Auth.css';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';

const Auth = props => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    console.log(formState);
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSuubmitHandler = async event => {
    event.preventDefault();
    // console.log(formState.inputs);
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('name', formState.inputs.name.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          formData
        );
        auth.login(responseData.userId, responseData.token);
      } catch (error) {}
    }
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? 'Login' : 'Sign UP'} Require</h2>
        <hr />
        <form onSubmit={authSuubmitHandler}>
          {!isLoginMode && (
            <Input
              id='name'
              element='input'
              type='text'
              label='Enter Your Name'
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id='image'
              center
              onInput={inputHandler}
              errorText='Please provid a image'
            />
          )}
          <Input
            id='email'
            element='input'
            type='email'
            label='E-mail'
            onInput={inputHandler}
            validators={[VALIDATOR_EMAIL()]}
            errorMsg='Plz Enter Valid Email'
          />
          <Input
            id='password'
            element='input'
            type='password'
            label='Password'
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorMsg='Plz Enter Valid Password (Length 6 Char At Least '
          />

          <Button type='submit' disabled={!formState.isValid}>
            {isLoginMode ? 'Login' : 'Sign UP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch To Sign UP
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
