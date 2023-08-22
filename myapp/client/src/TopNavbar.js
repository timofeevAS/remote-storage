import React, { useState,useMemo,useCallback } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FilterForm from "./FilterForm";
import { Modal } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import { faSearch,faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { debounce }  from 'lodash'



const StyledFormControl = styled(Form.Control)`
  border: none;
  outline: none;
  box-shadow: none;
  background-color: #f8f8fa;
`;

const SquareButton = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  background-color: #f8f8fa;
  padding: 4px;
`;


const TopNavbar = ({ handleFilterSubmit }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search bar query
  const [showFilterModal, setShowFilterModal] = useState(false); // State for Filters 
  const [filters, setFilters] = useState({
    uploadDateFrom: '',
    uploadDateTo: '',
    selectedFileType: '',
    search: ''
    // Another filters
  });

  const debouncedSearch = useCallback(debounce((value) => {
    { /* Debounced search function with 500 milliseconds delay */ }
    console.log('====>', value.search);
    handleFilterSubmit(value);
  }, 500),[]);

  const handleQueryChange = (event) => {
    { /*Handle for search bar query and call debounced function */ }
    setSearchQuery(event.target.value);
    const newFilters = { ...filters, search: event.target.value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  
  const handleApplyFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    console.log('newFilters: ',{...filters, ...newFilters})
    handleFilterSubmit(newFilters);
    handleCloseFilterModal();
  };

  const handleShowFilterModal = () => {
      setShowFilterModal(true);
    };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="ligth">
      <Container fluid>
        <Navbar.Brand href="#">Documents</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          </Nav>
          <SquareButton>
          <Form className="d-flex">
          <h6>В Навбаре будут фильтры, поиск,</h6>
            <InputGroup>
              <Button variant="outline-light" id="button-addon1" style={{border:"none",outline:"none"}}>
                  <FontAwesomeIcon icon={faSearch} style={{color:"black"}} />
              </Button>
              <StyledFormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleQueryChange}
              />
              <Button variant="outline-light" id="button-addon1" style={{border:"none",outline:"none"}} onClick={handleShowFilterModal}>
                <FontAwesomeIcon icon={faFilter} style={{color:"black"}} />
              </Button>
            </InputGroup>
          </Form>
          </SquareButton>
          {/* Modal window for filters */}
          <Modal show={showFilterModal} onHide={handleCloseFilterModal}>
            <Modal.Header closeButton>
              <Modal.Title>Filter Files</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FilterForm handleFilterSubmit={handleApplyFilters} initFilters={filters} />
            </Modal.Body>
          </Modal>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;