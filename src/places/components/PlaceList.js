import React from 'react';

import Card from '../../shared/components/UIElements/Card/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button/Button';
import './PlaceList.css';

const PlaceList = props => {
  if (props.items.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h1>No Place Found</h1>
          <Button to='/places/new'>Click TO Add Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className='place-list'>
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          title={place.title}
          image={place.image}
          description={place.description}
          creatorId={place.creator}
          address={place.address}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
