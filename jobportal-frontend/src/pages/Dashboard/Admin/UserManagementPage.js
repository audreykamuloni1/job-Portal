import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CircularProgress from '@mui/material/CircularProgress';
import adminService from '../../../services/adminService';
import { useLoading } from '../../../contexts/LoadingContext';
import { showSuccessToast, showErrorToast } from '../../../utils/notifications';
import { useEffect, useCallback } from 'react'; // Import useEffect and useCallback

// Removed sampleUsers

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const { showLoading, hideLoading, isLoading } = useLoading();

  const fetchUsers = useCallback(async () => {
    showLoading('Loading users...');
    try {
      const data = await adminService.getAllUsers();
      // Ensure roles is always an array and status is derived from enabled field if not present
      const processedUsers = data.map(user => ({
        ...user,
        roles: Array.isArray(user.roles) ? user.roles : (user.roles ? [user.roles.name] : []), // Assuming role might be obj like {id, name}
        status: user.enabled ? 'Enabled' : 'Disabled',
      }));
      setUsers(processedUsers);
    } catch (error) {
      showErrorToast(error.message || 'Failed to fetch users.');
      setUsers([]);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]); // Add dependencies for useCallback

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search - basic filter by username or email
  const filteredUsers = users.filter(user => 
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'Enabled' ? 'Deactivating' : 'Activating';
    showLoading(`${action} user...`);
    try {
      if (currentStatus === 'Enabled') {
        await adminService.deactivateUser(userId);
      } else {
        await adminService.activateUser(userId);
      }
      showSuccessToast(`User ${action.toLowerCase().replace('ing', 'ed')} successfully!`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      showErrorToast(error.message || `Failed to ${action.toLowerCase()} user.`);
    } finally {
      hideLoading();
    }
  };
  
  // const handleEditUser = (userId) => { // Placeholder for future edit functionality
  //   console.log(`Edit user ID: ${userId}`);
  // };

  const displayedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (isLoading && users.length === 0) {
    return (
        <Container sx={{py:4, textAlign:'center'}}>
            <CircularProgress />
            <Typography>Loading users...</Typography>
        </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        User Management
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Users (by username or email)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="user management table">
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role(s)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': {backgroundColor: 'action.hover'} }}
              >
                <TableCell component="th" scope="row">{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles.map(role => typeof role === 'object' ? role.name : role).join(', ')}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={user.status} 
                    color={user.enabled ? 'success' : 'default'} 
                    size="small" 
                    variant={user.enabled ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color={user.enabled ? "error" : "success"} // More intuitive colors for action
                    onClick={() => handleToggleUserStatus(user.id, user.status)}
                    title={user.enabled ? "Deactivate User" : "Activate User"}
                  >
                    {user.enabled ? <ToggleOffIcon /> : <ToggleOnIcon />} 
                  </IconButton>
                  <IconButton 
                    color="secondary" 
                    // onClick={() => handleEditUser(user.id)} // Future edit functionality
                    title="Edit User (Future)"
                    disabled 
                  >
                    <EditIcon fontSize="small"/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
             {displayedUsers.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} align="center">
                        No users found matching your criteria.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default UserManagementPage;
