import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const staffData = authService.getAll().filter(user => user.role === 'staff');
    setStaff(staffData);
    setLoading(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusTag status={row.status} />
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'btn-view',
      onClick: (row) => navigate(`/staff/${row.id}`),
      show: (row) => row.id === currentUser?.id || checkPermission('canManageStaff')
    }
  ];

  const stats = [
    {
      title: 'Total Staff',
      value: staff.length
    },
    {
      title: 'Active Staff',
      value: staff.filter(member => member.status === 'active').length
    },
    {
      title: 'On Leave',
      value: staff.filter(member => member.status === 'on_leave').length
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading staff members...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Staff Management</h1>
          {checkPermission('canManageStaff') && (
            <button
              className="btn-primary"
              onClick={() => navigate('/staff/add')}
            >
              Add Staff
            </button>
          )}
        </div>

        <div className="stats-row">
          {stats.map((stat, index) => (
            <Card
              key={index}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            data={staff}
            actions={actions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffPage; 