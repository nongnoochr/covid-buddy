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
  const [quickSearch, setQuickSearch] = useState('All');
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
        queryParams.set('showhcp', 'on');
        queryParams.set('quicksearch', quickSearch);
        

        history.push({
          pathname: location.pathname,
          search: queryParams.toString()
        });

      } else {

        if (queryParams.has('showhcp')) {
          queryParams.delete('showhcp');
          queryParams.delete('quicksearch');

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
    addQuickSearchToUrl(quickSearch);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [quickSearch])

  const linkFindHCPHandler = (qs='All') => {
      setQuickSearch(qs);
      handleShowModal();
      
  };

  const getLinkFindHCP = (qs='All') => {
    return (<div style={{marginTop: '1em'}}>
      <Link
          to={{
              pathname: location.pathname
          }}
          onClick={() => linkFindHCPHandler(qs)}>
          <GrMapLocation /> { (!qs || (qs === 'All')) ? 'Find Healthcare Providers Near You' : 
              `Find suggested Healthcare Providers Near You - ${qs}`}
      </Link>

  </div>);
  } 

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
  setQuickSearch('All');
  // addQuickSearchToUrl('');
}

const addQuickSearchToUrl = (qs) => {
  const queryParams = new URLSearchParams(location.search);
  // Only add quicksearch when dialog is shown
  if (showhcp && Boolean(qs)) {
    queryParams.set('quicksearch', qs);  
  } else {
    queryParams.delete('quicksearch');

  }

  const curQueryParams = queryParams.toString();

  history.push({
    pathname: location.pathname,
    search: curQueryParams,
  });
}

  return (
    <HCPContext.Provider value={{
      showhcp,
      setShowHCPMap,
      appQueryParams,
      getLinkFindHCP,
      linkFindHCPHandler,
      quickSearch, 
      setQuickSearch,
      addQuickSearchToUrl
    }}>
      <Layout>

        <div ref={refHCP}>
          {showhcp ? (<div>
            <Modal show={showModal} 
              fullscreen={fullscreenModal} 
              onHide={handleHideModal}
              animation={false}
              scrollable={true}

              // Note:
              // 1. dialogClassName won't be applied if fullscreen prop is set
              // 2. The back button won't be availble in a larger screen. 
              // We need a back button now because we can't programmatically reset
              // view to the home screen after initializing SDK
              
              // dialogClassName="modal-90w"
              // size="lg"

              centered
              >
              <Modal.Header closeButton>
                <Modal.Title><span className="icon-text"><GrMapLocation /> </span>Find Healthcare Providers</Modal.Title>
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
