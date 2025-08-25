import * as React from 'react';
import * as Label from '@radix-ui/react-label';
import * as Toast from '@radix-ui/react-toast';
// import StarRating from '../components/StarRating';
import { useAuth } from '../hooks/useAuth';
import api from '../hooks/api';
import '../styles/StoreList.css';

function StoreList() {
  const [stores, setStores] = React.useState([]);
  const [search, setSearch] = React.useState({ name: '', address: '' });
  const [toast, setToast] = React.useState({ open: false, message: '', type: 'info' });
  const { user } = useAuth();
  // Sorting state
  const [sort, setSort] = React.useState({ field: 'name', direction: 'asc' });

  // Map frontend sort fields to backend orderBy params
  const getOrderByParam = (field) => {
    if (field === 'averageRating') return 'averageRating';
    if (['name', 'address'].includes(field)) return field;
    return 'name';
  };

  React.useEffect(() => {
    api.get('/stores', {
      params: {
        ...search,
        orderBy: getOrderByParam(sort.field),
        order: sort.direction.toUpperCase(),
      },
    })
      .then((response) => setStores(response.data))
      .catch(() => setToast({ open: true, message: 'Failed to load stores', type: 'error' }));
  }, [search, user, sort]);

  const handleSearch = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  // Sorting handler
  const handleSort = (field) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'asc' };
    });
  };

  const handleRate = async (storeId, newRating) => {
    if (newRating < 1 || newRating > 5) {
      setToast({ open: true, message: 'Rating must be between 1 and 5', type: 'error' });
      return;
    }
    try {
      await api.post('/ratings', { storeId, rating: newRating });
      const response = await api.get('/stores', {
        params: {
          ...search,
          orderBy: getOrderByParam(sort.field),
          order: sort.direction.toUpperCase(),
        },
      });
      setStores(response.data);
      setToast({ open: true, message: 'Rating saved!', type: 'success' });
    } catch (err) {
      setToast({ open: true, message: 'Failed to save rating', type: 'error' });
    }
  };

  // Star rating component
  const StarRating = ({ rating, onRate, disabled }) => (
    <span>
      {[1, 2, 3, 4, 5].map((num) => (
        <span
          key={num}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: num <= rating ? '#ffc107' : '#e4e5e9',
            fontSize: '1.5rem',
            transition: 'color 0.2s',
            marginRight: 2,
            opacity: disabled ? 0.5 : 1
          }}
          onClick={() => !disabled && onRate(num)}
          data-testid={`star-${num}`}
        >
          ★
        </span>
      ))}
    </span>
  );

  return (
    <Toast.Provider swipeDirection="right" duration={4000}>
      <div className="storelist-center-outer">
        <div className="storelist-center-box">
          <h2 className="storelist-title">Stores</h2>
          <Toast.Root
            open={toast.open}
            onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
            style={{
              background: toast.type === 'error' ? '#b91c1c' : toast.type === 'success' ? '#166534' : '#27272a',
              color: '#f4f4f5',
              borderRadius: 8,
              padding: 16,
              minWidth: 220,
              fontWeight: 500,
              fontSize: 16,
              boxShadow: '0 2px 16px #000a',
              display: toast.open ? 'block' : 'none',
              zIndex: 9999
            }}
          >
            <Toast.Title>{toast.message}</Toast.Title>
          </Toast.Root>
          <Toast.Viewport style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }} />
      {/* Removed Add Store button and dialog */}
      <div className="storelist-search-row">
        <div className="storelist-search-group">
          <Label.Root htmlFor="search-name" className="storelist-search-label">Name</Label.Root>
          <input id="search-name" name="name" className="storelist-search-input" placeholder="Search by name" onChange={handleSearch} />
        </div>
        <div className="storelist-search-group">
          <Label.Root htmlFor="search-address" className="storelist-search-label">Address</Label.Root>
          <input id="search-address" name="address" className="storelist-search-input" placeholder="Search by address" onChange={handleSearch} />
        </div>
      </div>
      <div className="storelist-table-container">
        <table className="storelist-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                Name {sort.field === 'name' ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('address')}>
                Address {sort.field === 'address' ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('averageRating')}>
                Average Rating {sort.field === 'averageRating' ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Your Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>
                  {store.averageRating !== undefined && store.averageRating !== null
                    ? Number(store.averageRating).toFixed(2)
                    : 'N/A'}
                </td>
                <td>
                  <StarRating
                    rating={store.userRating || 0}
                    onRate={(num) => handleRate(store.id, num)}
                    disabled={user?.role === 'System Administrator' || user?.role === 'Store Owner'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      </div>
    </Toast.Provider>
  );
}

export default StoreList;