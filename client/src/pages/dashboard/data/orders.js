// Dummy orders data
export const dummyOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'Delivered',
    items: [
      {
        name: 'Wireless Earbuds',
        quantity: 1,
        price: 2999,
        image: '/api/placeholder/80/80'
      }
    ],
    total: 2999,
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001'
    }
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'Processing',
    items: [
      {
        name: 'Smart Watch',
        quantity: 1,
        price: 5999,
        image: '/api/placeholder/80/80'
      },
      {
        name: 'Phone Case',
        quantity: 2,
        price: 499,
        image: '/api/placeholder/80/80'
      }
    ],
    total: 6997,
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001'
    }
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'Shipped',
    items: [
      {
        name: 'Laptop Bag',
        quantity: 1,
        price: 1999,
        image: '/api/placeholder/80/80'
      }
    ],
    total: 1999,
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001'
    }
  }
];

// Function to get orders (can be replaced with API call later)
export const getOrders = () => {
  return dummyOrders;
};

// Function to get order by ID
export const getOrderById = (orderId) => {
  return dummyOrders.find(order => order.id === orderId);
};