import React, { useState, useEffect, useRef } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import { GrMapLocation } from 'react-icons/gr';

import HCPContext from './store/hcp-context';

// Components
import Layout from './components/Layout/Layout';
import Landing from './components/Landing/Landing';
import QnA from './components/QnA/QnA';
import HCPMap from './components/HCPMap/HCPMap'

// Styling
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const refHCP = useRef(null);

  const [showhcp, setShowHCP] = useState(false);
  const [appQueryParams, setAppQueryParams] = useState('');

  const history = useHistory();
  const location = useLocation();

  const setShowHCPMap = (newState) => {

    setShowHCP(() => {

      const queryParams = new URLSearchParams(location.search);
      let curQueryParams = queryParams.toString();
      if (newState) {
        window.scrollTo(0, 0);


        // ---- Update URL
        queryParams.set('showhcp', 'on')

        curQueryParams = queryParams.toString();

        history.push({
          pathname: location.pathname,
          search: curQueryParams,
        });


      } else {

        if (queryParams.has('showhcp')) {
          queryParams.delete('showhcp');

          curQueryParams = queryParams.toString();

          history.replace({
            pathname: location.pathname,
            search: curQueryParams,
          })
        }

      }

      setAppQueryParams(curQueryParams);
      return newState;
    });

  };

  useEffect(() => {
    
      if (showhcp) {
        handleShowModal();
      } else {
        handleHideModal();
      }
      
  }, [showhcp]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    // When render the app for the first time
    if (queryParams.get('showhcp') === 'on') {
      // setShowHCPMap(true);
      handleShowModal();
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const linkFindHCPHandler = () => {
      // setShowHCPMap(true);
      handleShowModal();
  };

  const linkFindHCP = (<div>
    <Link
        to={{
            pathname: location.pathname
        }}
        onClick={linkFindHCPHandler}>
        <GrMapLocation /> Find Healthcare Providers Near You
    </Link>
</div>);

const [fullscreenModal, setFullscreenModal] = useState("true");
const [showModal, setShowModal] = useState(false);

const handleShowModal = () => {
  setFullscreenModal("true");
  setShowModal(true);
  setShowHCPMap(true);
}

const handleHideModal = () => {
  setFullscreenModal("false");
  setShowModal(false);
  setShowHCPMap(false);
}

  return (
    <HCPContext.Provider value={{
      showhcp,
      setShowHCPMap,
      appQueryParams,
      linkFindHCP,
      linkFindHCPHandler
    }}>
      <Layout>

        <div ref={refHCP}>
          {showhcp ? (<div>
            <Modal show={showModal} 
              fullscreen={fullscreenModal} 
              onHide={handleHideModal}
              animation={false}
              centered
              >
              <Modal.Header closeButton>
                <Modal.Title><GrMapLocation /> Find Healthcare Provider</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <HCPMap />
                </div>
              </Modal.Body>
            </Modal>
          </div>) : null}
        </div>

        <Switch>
          <Route path='/' exact>
            <Landing />
          </Route>
          <Route path="/askbuddy">
            <QnA />
          </Route>
          <Route path='*'>
            <Redirect to='/' />
          </Route>

        </Switch>
      </Layout>
    </HCPContext.Provider>
  );
}

export default App;
