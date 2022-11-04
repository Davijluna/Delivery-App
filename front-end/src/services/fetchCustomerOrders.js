import axios from 'axios';

export async function fetchCustomerOrders(token) {
  return axios.get('http://localhost:3001/sales', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.data);
}

export async function fetchCustomerOrdersById(id, token) {
  return axios.get(`http://localhost:3001/sales/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.data);
}
