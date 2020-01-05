import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { useForm } from '../../shared/hooks/form-hook';

import Input from '../../shared/components/FormElements/Input/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/Validator';
import { AuthContext } from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button/Button';
import './NewPlace.css';
import Card from '../../shared/components/UIElements/Card/Card';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const UpdatePlace = props => {
  const [place, setPlace] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [fromState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );
  const placeId = useParams().placeId;
  const auth = useContext(AuthContext);
  const histroyObj = useHistory();

  useEffect(() => {
    (async function() {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (error) {}
    })();
  }, [sendRequest, placeId, setFormData]);

  const updatePalceHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: fromState.inputs.title.value,
          description: fromState.inputs.description.value
        }),
        {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      );
      //redirct user => to his places page
      histroyObj.push(`/${auth.userId}/places`);
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!place && error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not Find Place</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && place && (
        <form className='place-form' onSubmit={updatePalceHandler}>
          <Input
            element='input'
            id='title'
            type='text'
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={place.title}
            initialValid={true}
            errorMsg='Plz Enter Valid Title'
          />
          <Input
            element='textarea'
            id='description'
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(5)]}
            initialValue={place.description}
            initialValid={true}
            errorMsg='Plz Enter Valid Description'
          />
          <Button type='submit' disabled={!fromState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
