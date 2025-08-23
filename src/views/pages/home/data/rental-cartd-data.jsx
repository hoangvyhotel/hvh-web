// Seed data for rental management based on UI mockup
export const rentalCardData = [
  {
    id: 1,
    roomNumber: '201',
    checkIn: '22-08-2025 22:26',
    checkOut: '23-08-2025 06:12',
    waterFee: 40000,
    totalAmount: 160000,
    status: 'active'
  },
  {
    id: 2,
    roomNumber: '103',
    checkIn: '22-08-2025 22:26',
    checkOut: '23-08-2025 08:06',
    waterFee: null,
    totalAmount: 200000,
    status: 'active'
  },
  {
    id: 3,
    roomNumber: '202',
    checkIn: '22-08-2025 22:26',
    checkOut: '23-08-2025 08:06',
    waterFee: null,
    totalAmount: 180000,
    status: 'active'
  },
  {
    id: 4,
    roomNumber: '101',
    checkIn: '22-08-2025 14:05',
    checkOut: '23-08-2025 10:06',
    waterFee: null,
    totalAmount: 300000,
    status: 'active'
  },
  {
    id: 5,
    roomNumber: '102',
    checkIn: '23-08-2025 06:12',
    checkOut: '23-08-2025 10:06',
    waterFee: null,
    totalAmount: 180000,
    status: 'active'
  },
  {
    id: 6,
    roomNumber: '303',
    checkIn: '22-08-2025 22:26',
    checkOut: '23-08-2025 10:06',
    waterFee: null,
    totalAmount: 200000,
    status: 'active'
  },
  {
    id: 7,
    roomNumber: '201',
    checkIn: '23-08-2025 06:59',
    checkOut: null,
    waterFee: null,
    totalAmount: null,
    status: 'checked-in'
  },
  {
    id: 8,
    roomNumber: '103',
    checkIn: '23-08-2025 08:06',
    checkOut: null,
    waterFee: null,
    totalAmount: null,
    status: 'checked-in'
  },
  {
    id: 9,
    roomNumber: '202',
    checkIn: '23-08-2025 10:06',
    checkOut: null,
    waterFee: null,
    totalAmount: null,
    status: 'checked-in'
  }
];

// Helper functions for rental data
export const getRentalsByRoom = (roomNumber) => {
  return rentalCardData.filter((rental) => rental.roomNumber === roomNumber);
};

export const getActiveRentals = () => {
  return rentalCardData.filter((rental) => rental.status === 'active');
};

export const getCheckedInRentals = () => {
  return rentalCardData.filter((rental) => rental.status === 'checked-in');
};

export const getTotalRevenue = () => {
  return rentalCardData.filter((rental) => rental.totalAmount).reduce((total, rental) => total + rental.totalAmount, 0);
};

export const formatCurrency = (amount) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return dateString;
};
