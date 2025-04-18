import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { locationService } from '../../services/mockData';
import { Form, FormInput, FormSelect } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AddLocationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    status: 'active',
    clientId: clientId ? Number(clientId) : null
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      locationService.add(formData);
      if (clientId) {
        navigate(`/clients/${clientId}`);
      } else {
        navigate('/locations');
      }
    } catch (err) {
      setError('Failed to add location. Please try again.');
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Add New Location</h1>
        </div>

        <div className="card">
          <Form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            
            <FormInput
              label="Location Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />

            <div className="form-actions">
              <button
                type="button"
                className="button"
                onClick={() => clientId ? navigate(`/clients/${clientId}`) : navigate('/locations')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button is-primary"
              >
                Add Location
              </button>
            </div>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddLocationPage; 