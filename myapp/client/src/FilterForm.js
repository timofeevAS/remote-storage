import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const options = [
    { value: '', label: 'Любой' },
    { value: 'docx,doc,pdf', label: 'Документы' },
    { value: 'pdf', label: 'Файлы PDF' },
    { value: 'png,jpeg,jpg', label: 'Изображения' },
  ];
  


const FilterForm = ({ handleFilterSubmit, initFilters }) => {
  { /* Filter form in search bar */ }
  const [uploadDateFrom, setUploadDateFrom] = useState(initFilters.uploadDateFrom || '');
  const [uploadDateTo, setUploadDateTo] = useState(initFilters.uploadDateTo || '');
  const [selectedFileType, setSelectedFileType] = useState(initFilters.selectedFileType || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      uploadDateFrom: uploadDateFrom === '' ? null : uploadDateFrom,
      uploadDateTo: uploadDateTo === '' ? null : uploadDateTo,
      selectedFileType,
      // Add other filters here
    };
    handleFilterSubmit(filters);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setUploadDateFrom('');
    setUploadDateTo('');
    setSelectedFileType('');
  };

  

  return (
    <Form onSubmit={handleSubmit} onReset={handleClear}>
      <Form.Group controlId="uploadDateFrom">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
            type="date"
            value={uploadDateFrom}
            onChange={(e) => setUploadDateFrom(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="uploadDateTo">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={uploadDateTo}
          onChange={(e) => setUploadDateTo(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="fileType">
        <Form.Label>Select file type</Form.Label>
        <Form.Select
          aria-label="Select file type"
          value={selectedFileType}
          onChange={(e) => setSelectedFileType(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit">
        Apply Filters
      </Button>
      <Button variant="outline-success" type="reset">
        Clear
      </Button>
    </Form>
  );
};

export default FilterForm;