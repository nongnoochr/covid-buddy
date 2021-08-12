import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';

import HCPContext from '../../store/hcp-context.js';

// Styling
import classes from './Layout.module.css';

// Icons
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { GrMapLocation } from 'react-icons/gr';
import { BiHome, BiHide } from 'react-icons/bi';

const Layout = (props) => {

  // --- Contexts

  const ctx = useContext(HCPContext);

  // --- Handlers
  const toggleMapStateHandler = () => {
    ctx.setShowHCPMap(!ctx.showhcp);
  };

  // --- Helpers

  const prefixHCPButtonLabel = ctx.showhcp ? 'Hide' : 'Find';

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" >
        <Navbar.Brand
          as={Link}
          to={
            {
              pathname: '/',
              search: ctx.appQueryParams
            }
          }
          data-testid="nav-item-brand"
        >
          <span className={classes['nav-icon-home']}><BiHome /></span>
          <span 
            data-testid="nav-item-brand-text"
            className="icon-text"><b>COVID-19 BUDDY</b></span>
        </Navbar.Brand>

        <Nav className={`mr-auto ${classes['nav-container']}`}
          navbarScroll
        >
          <Navbar.Text title="Ask Buddy">
            <NavLink data-testid="nav-item-askbuddy" className="nav-link" activeClassName="active"
              to={
                {
                  pathname: '/askbuddy',
                  search: ctx.appQueryParams
                }
              }
            >
              <RiQuestionAnswerLine />
              <span className="icon-text">Ask Buddy</span>
            </NavLink>
          </Navbar.Text>

        </Nav>
        <Form className="d-flex">
          <Button title={`${prefixHCPButtonLabel} Healthcare Providers`}
            variant="success"
            onClick={toggleMapStateHandler}
            active={ctx.showhcp}
          >
            {ctx.showhcp ? <BiHide /> : <GrMapLocation />}
            <span> {prefixHCPButtonLabel} Healthcare Providers</span>
          </Button>
        </Form>
      </Navbar>


      <div>

        {props.children}
      </div>

      

    </>
  );
}

export default Layout;
