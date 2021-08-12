import React, { useState, useEffect } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import GitHubButton from 'react-github-btn';

// Components
import Layout from './components/Layout/Layout';
import Landing from './components/Landing/Landing';
import QnA from './components/QnA/QnA';
import HCPMap from './components/HCPMap/HCPMap'

import HCPContext from './store/hcp-context';

// Styling
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Icons
import { GrMapLocation } from 'react-icons/gr';


function App() {

  const history = useHistory();
  const location = useLocation();

  // --- states
  const [appQueryParams, setAppQueryParams] = useState('');
  const [fullscreenModal, setFullscreenModal] = useState("true");
  const [quickSearch, setQuickSearch] = useState('All');
  const [showhcp, setShowHCP] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /**
   * Set the Modal dialog state as well as updating the url based on its current state
   * @param {boolean} newState Modal dialog state (show ->true, hide -> false)
   */
  const setShowHCPMap = (newState) => {

    // Update the showhcp state as well as updating the current url
    setShowHCP(() => {
      const queryParams = new URLSearchParams(location.search);
      let curQueryParams = queryParams.toString();

      // If a new state is to show the Modal dialog
      if (newState) {

        // First, scroll to the top of the app
        window.scrollTo(0, 0);

        // Then, update URL to add query paramenters 'showhcp' and 'quicksearch'
        queryParams.set('showhcp', 'on');
        queryParams.set('quicksearch', quickSearch);

        history.push({
          pathname: location.pathname,
          search: queryParams.toString()
        });

      } else {
        // If a new state is to hide the Modal dialog

        // If the current url contains the 'showhcp' query parameter
        if (queryParams.has('showhcp')) {

          // Remove the query parameters 'showhcp' and 'quicksearch' from url
          // since we don't need them when the Modal Dialog is hidden
          queryParams.delete('showhcp');
          queryParams.delete('quicksearch');

          curQueryParams = queryParams.toString();

          history.replace({
            pathname: location.pathname,
            search: curQueryParams,
          })
        }
      }

      // Update the current query parameters string
      setAppQueryParams(curQueryParams);

      // Finally, set the 'showhcp' value
      return newState;
    });

  };

  // --- Effects

  // When 'showhcp' is updated, handle the Modal Dialog accordingly
  useEffect(() => {
    if (showhcp) {
      handleShowModal();
    } else {
      handleHideModal();
    }
  }, [showhcp]);  // eslint-disable-line react-hooks/exhaustive-deps

  // When 'quickSearch' is updated, update the url accordingly
  useEffect(() => {
    addQuickSearchToUrl(quickSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickSearch])

  // --- Helpers

  /**
   * Add a quicksearch value to the url only when the 'showhcp' value is true.
   * Otherwise, remove the 'quicksearch' Query parameter from the url
   * @param {string} qs Query parameter value for 'quicksearch'
   */
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

  /**
   * Get a JSX for the Find HCPs link (used in multiple child components)
   * @param {string} qs  Query parameter value for 'quicksearch'
   * @returns {JSX} JSX for the Find HCPs link
   */
  const getLinkFindHCP = (qs = 'All') => {
    return (
      <div style={{ marginTop: '1em' }}>
        <Link to={{ pathname: location.pathname }}
          onClick={() => linkFindHCPHandler(qs)}>
          <GrMapLocation />&nbsp;
          {(!qs || (qs === 'All')) ?
            'Find Healthcare Providers Near You'
            : `Find suggested Healthcare Providers Near You - ${qs}`}
        </Link>
      </div>);
  };

  // --- Handlers

  /**
   * Handler for a Find HCPs link
   * @param {string} qs Query parameter 'quicksearch' value
   */
  const linkFindHCPHandler = (qs = 'All') => {
    setQuickSearch(qs);
    handleShowModal();
  };

  /**
   * Handler when the Modal Dialog is shown
   */
  const handleShowModal = () => {
    setFullscreenModal("true");
    setShowModal(true);
    setShowHCPMap(true);
  }

  /**
   * Handler when the Modal Dialog is hidden
   */
  const handleHideModal = () => {
    setFullscreenModal("false");
    setShowModal(false);
    setShowHCPMap(false);
    setQuickSearch('All');
  }

  // -------------------------

  return (
    <>
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

          {/* Route for SPA */}
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

        <Modal
          show={showModal}
          // fullscreen={fullscreenModal}
          onHide={handleHideModal}
          animation={false}
          scrollable={true}

          // Note:
          // 1. dialogClassName won't be applied if fullscreen prop is set
          // 2. The back button won't be availble in a larger screen. 
          // We need a back button now because we can't programmatically reset
          // view to the home screen after initializing SDK

          dialogClassName="modal-width"
          size="lg"

          centered
        >
          <Modal.Header
            closeButton>
            <Modal.Title>
              <span className="icon-text"><GrMapLocation />&nbsp;</span>
              Find Healthcare Providers
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <HCPMap />
          </Modal.Body>
        </Modal>
      </HCPContext.Provider>

      <div className="container">
        <hr />
      </div>

      <section data-testid="github-container" className="container bottom-section">
        <GitHubButton href="https://github.com/nongnoochr/covid-buddy" 
          data-size="large"
          data-show-count="true" 
          aria-label="Star nongnoochr/covid-buddy on GitHub">
          Star
        </GitHubButton>
      </section>
    </>
  );
}

export default App;