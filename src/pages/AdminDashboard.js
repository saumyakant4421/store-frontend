
import React, { useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Label from '@radix-ui/react-label';
import { useAuth } from '../hooks/useAuth';
import api from '../hooks/api';
import '../styles/AdminDashboard.css';

/**
 * AdminDashboard - System Administrator dashboard for managing users and stores.
 * Features:
 * - Add/view/filter users (with Store Owner ratings)
 * - Add/view/filter stores
 * - View dashboard stats
 */

function AdminDashboard() {
  // State
  const [stats, setStats] = useState({ usersCount: 0, storesCount: 0, ratingsCount: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchUsers, setSearchUsers] = useState({ name: '', email: '', address: '', role: '' });
  const [searchStores, setSearchStores] = useState({ name: '', email: '', address: '' });
  const [userSort, setUserSort] = useState({ orderBy: 'name', order: 'ASC' });
  const [storeSort, setStoreSort] = useState({ orderBy: 'name', order: 'ASC' });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
  const [error, setError] = useState('');
  const [addStoreDialogOpen, setAddStoreDialogOpen] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '', owner: { name: '', email: '', password: '', address: '' } });
  const [storeMode, setStoreMode] = useState('existing');
  const { user } = useAuth();

  // Fetch dashboard stats, users, and stores
  const fetchDashboard = useCallback(() => {
    if (user?.role !== 'System Administrator') return;
    api.get('/admin/dashboard').then(res => setStats(res.data)).catch(() => setError('Failed to load dashboard'));
    api.get('/admin/users', { params: { ...searchUsers, ...userSort } }).then(res => setUsers(res.data)).catch(() => setError('Failed to load users'));
    api.get('/admin/stores', { params: { ...searchStores, ...storeSort } }).then(res => setStores(res.data)).catch(() => setError('Failed to load stores'));
  }, [user, searchUsers, searchStores, userSort, storeSort]);
  // Sorting handlers
  const handleUserSort = (field) => {
    setUserSort((prev) => ({
      orderBy: field,
      order: prev.orderBy === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };
  const handleStoreSort = (field) => {
    setStoreSort((prev) => ({
      orderBy: field,
      order: prev.orderBy === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Handlers
  const handleSearchUsers = (e) => {
    const { name, value } = e.target;
    setSearchUsers((prev) => ({ ...prev, [name]: value }));
  };
  const handleSearchStores = (e) => {
    const { name, value } = e.target;
    setSearchStores((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    if (newUser.name.length < 10 || newUser.name.length > 40) return setError('Name must be 10-40 characters');
    if (newUser.address.length > 400) return setError('Address must not exceed 400 characters');
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/.test(newUser.password)) return setError('Password must be 8-16 chars with uppercase and special char');
    try {
      await api.post('/admin/users', newUser);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal User' });
      fetchDashboard();
    } catch (err) {
      setError('Failed to add user');
    }
  };
  const handleAddStore = async (e) => {
    e.preventDefault();
    setError('');
    if (newStore.name.length < 20 || newStore.name.length > 60) return setError('Store name must be 20-60 characters');
    if (newStore.address.length > 400) return setError('Address must not exceed 400 characters');
    let payload = { name: newStore.name, email: newStore.email, address: newStore.address };
    if (storeMode === 'existing') {
      if (!newStore.ownerId) return setError('Owner ID required');
      payload.ownerId = newStore.ownerId;
    } else {
      const { name, email, password, address } = newStore.owner;
      if (!name || !email || !password || !address) return setError('All new owner fields required');
      payload.owner = { name, email, password, address };
    }
    try {
      await api.post('/stores', payload);
      setNewStore({ name: '', email: '', address: '', ownerId: '', owner: { name: '', email: '', password: '', address: '' } });
      setAddStoreDialogOpen(false);
      fetchDashboard();
    } catch (err) {
      setError('Failed to add store: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  // Render
  if (user?.role !== 'System Administrator') return <h2>Access Denied</h2>;

  return (
    <div className="admin-outer" style={{ minHeight: '100vh', background: '#18181b', paddingBottom: 40 }}>
      <div className="admin-box">
        <h2 className="admin-title">Admin Dashboard</h2>
        {error && <div className="admin-error">{error}</div>}
        {/* Dashboard Stats */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <div className="admin-stat-title">Total Users</div>
            <div className="admin-stat-value">{stats.usersCount}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-title">Total Stores</div>
            <div className="admin-stat-value">{stats.storesCount}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-title">Total Ratings</div>
            <div className="admin-stat-value">{stats.ratingsCount}</div>
          </div>
        </div>

        {/* Add User Form */}
        <form className="admin-form" onSubmit={handleAddUser}>
          <input className="admin-input" placeholder="Name (20-60 chars)" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
          <input className="admin-input" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
          <input className="admin-input" type="password" placeholder="Password (8-16 chars, uppercase, special char)" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
          <input className="admin-input" placeholder="Address (max 400 chars)" value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} required />
          <select className="admin-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} required>
            <option value="Normal User">Normal User</option>
            <option value="System Administrator">System Administrator</option>
            <option value="Store Owner">Store Owner</option>
          </select>
          <button type="submit" className="admin-btn">Add User</button>
        </form>

        {/* Users Table */}
        <h3 style={{ color: '#f4f4f5', marginTop: 32 }}>Users</h3>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <input className="admin-input" name="name" placeholder="Search by name" onChange={handleSearchUsers} />
          <input className="admin-input" name="email" placeholder="Search by email" onChange={handleSearchUsers} />
          <input className="admin-input" name="address" placeholder="Search by address" onChange={handleSearchUsers} />
          <input className="admin-input" name="role" placeholder="Search by role" onChange={handleSearchUsers} />
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleUserSort('name')}>
                Name {userSort.orderBy === 'name' ? (userSort.order === 'ASC' ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleUserSort('email')}>
                Email {userSort.orderBy === 'email' ? (userSort.order === 'ASC' ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleUserSort('address')}>
                Address {userSort.orderBy === 'address' ? (userSort.order === 'ASC' ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleUserSort('role')}>
                Role {userSort.orderBy === 'role' ? (userSort.order === 'ASC' ? '▲' : '▼') : ''}
              </th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ background: u.role === 'Store Owner' ? '#23272a' : undefined }}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td style={{ color: u.role === 'System Administrator' ? '#3b82f6' : u.role === 'Store Owner' ? '#ffd700' : '#f4f4f5', fontWeight: 500 }}>{u.role}</td>
                <td>
                  {u.role === 'Store Owner' && u.averageRating !== undefined
                    ? Number(u.averageRating).toFixed(2)
                    : u.role === 'Store Owner' ? 'N/A' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Stores Table */}
        <h3 style={{ color: '#f4f4f5', marginTop: 32 }}>Stores</h3>
        <Dialog.Root open={addStoreDialogOpen} onOpenChange={setAddStoreDialogOpen}>
          <Dialog.Trigger asChild>
            <button className="admin-btn" style={{ marginBottom: 16, background: '#3b82f6', color: '#fff', borderRadius: 8, fontWeight: 500 }}>Add Store</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay style={{ background: 'rgba(0,0,0,0.7)', position: 'fixed', inset: 0, zIndex: 100 }} />
            <Dialog.Content style={{ background: '#23232b', color: '#f4f4f5', borderRadius: 12, padding: 32, maxWidth: 440, width: '95%', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, boxShadow: '0 8px 32px #000a' }}>
              <Dialog.Title style={{ fontSize: 22, fontWeight: 600, marginBottom: 18, textAlign: 'center' }}>Add New Store</Dialog.Title>
              <form onSubmit={handleAddStore} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Label.Root htmlFor="store-name">Name</Label.Root>
                <input id="store-name" className="admin-input" placeholder="Name (20-60 chars)" value={newStore.name} onChange={e => setNewStore(s => ({ ...s, name: e.target.value }))} required />
                <Label.Root htmlFor="store-email">Email</Label.Root>
                <input id="store-email" className="admin-input" placeholder="Email" value={newStore.email} onChange={e => setNewStore(s => ({ ...s, email: e.target.value }))} required />
                <Label.Root htmlFor="store-address">Address</Label.Root>
                <input id="store-address" className="admin-input" placeholder="Address (max 400 chars)" value={newStore.address} onChange={e => setNewStore(s => ({ ...s, address: e.target.value }))} required />
                <div style={{ display: 'flex', gap: 16, margin: '10px 0 0 0', alignItems: 'center' }}>
                  <label style={{ marginRight: 12, fontWeight: 500 }}>
                    <input type="radio" checked={storeMode === 'existing'} onChange={() => setStoreMode('existing')} style={{ marginRight: 6 }} /> Assign Existing Owner
                  </label>
                  <label style={{ fontWeight: 500 }}>
                    <input type="radio" checked={storeMode === 'new'} onChange={() => setStoreMode('new')} style={{ marginRight: 6 }} /> Create New Owner
                  </label>
                </div>
                {storeMode === 'existing' ? (
                  <>
                    <Label.Root htmlFor="owner-id">Owner ID</Label.Root>
                    <input id="owner-id" className="admin-input" placeholder="Store Owner User ID" value={newStore.ownerId} onChange={e => setNewStore(s => ({ ...s, ownerId: e.target.value }))} required />
                  </>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Label.Root htmlFor="owner-name">Owner Name</Label.Root>
                      <input id="owner-name" className="admin-input" placeholder="Owner Name" value={newStore.owner.name} onChange={e => setNewStore(s => ({ ...s, owner: { ...s.owner, name: e.target.value } }))} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Label.Root htmlFor="owner-email">Owner Email</Label.Root>
                      <input id="owner-email" className="admin-input" placeholder="Owner Email" value={newStore.owner.email} onChange={e => setNewStore(s => ({ ...s, owner: { ...s.owner, email: e.target.value } }))} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Label.Root htmlFor="owner-password">Owner Password</Label.Root>
                      <input id="owner-password" className="admin-input" type="password" placeholder="Owner Password (min 6 chars)" value={newStore.owner.password} onChange={e => setNewStore(s => ({ ...s, owner: { ...s.owner, password: e.target.value } }))} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Label.Root htmlFor="owner-address">Owner Address</Label.Root>
                      <input id="owner-address" className="admin-input" placeholder="Owner Address" value={newStore.owner.address} onChange={e => setNewStore(s => ({ ...s, owner: { ...s.owner, address: e.target.value } }))} required />
                    </div>
                  </div>
                )}
                <button type="submit" className="admin-btn" style={{ width: '100%', marginTop: 16, background: '#3b82f6', color: '#fff', borderRadius: 8, fontWeight: 500 }}>Add Store</button>
                {error && <div className="admin-error" style={{ marginTop: 8 }}>{error}</div>}
              </form>
              <Dialog.Close asChild>
                <button style={{ position: 'absolute', top: 8, right: 8, background: 'none', color: '#f4f4f5', border: 'none', fontSize: 20, cursor: 'pointer' }}>&times;</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Stores Table */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <input className="admin-input" name="name" placeholder="Search by name" onChange={handleSearchStores} />
          <input className="admin-input" name="email" placeholder="Search by email" onChange={handleSearchStores} />
          <input className="admin-input" name="address" placeholder="Search by address" onChange={handleSearchStores} />
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleStoreSort('name')}>
                Name {storeSort.orderBy === 'name' ? (storeSort.order === 'ASC' ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleStoreSort('email')}>
                Email {storeSort.orderBy === 'email' ? (storeSort.order === 'ASC' ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleStoreSort('address')}>
                Address {storeSort.orderBy === 'address' ? (storeSort.order === 'ASC' ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleStoreSort('ownerId')}>
                Owner {storeSort.orderBy === 'ownerId' ? (storeSort.order === 'ASC' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.User?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;