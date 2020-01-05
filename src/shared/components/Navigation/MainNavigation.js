import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../../../shared/components/UIElements/Backdrop/Backdrop';
import './MainNavigation.css';

const MainNavigation = props => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  function drawerIsOpenHandler() {
    setDrawerIsOpen(true);
  }

  function closeSideDrawerHandler() {
    setDrawerIsOpen(false);
  }
  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeSideDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} closeSideDrawer={closeSideDrawerHandler}>
        <NavLinks />
      </SideDrawer>
      <MainHeader>
        <button
          className='main-navigation__menu-btn'
          onClick={drawerIsOpenHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className='main-navigation__title'>
          <Link to='/'>Your Places</Link>
        </h1>
        <nav className='main-navigation__header-nav'>
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
