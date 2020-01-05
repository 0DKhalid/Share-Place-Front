import React from 'react';

import UserItem from './UserItem';
import './UserList.css';

const UserList = props => {
  if (!props.items.length) {
    return (
      <div className='center'>
        <h1>No Users Found!</h1>
      </div>
    );
  }

  return (
    <ul className='users-list'>
      {props.items.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
          image={user.image}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
