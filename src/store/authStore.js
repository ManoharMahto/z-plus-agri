import { create } from 'zustand';

const initialUser = {
  name: "Rameshwar Patel",
  email: "rameshwar.patel@kisanmail.in",
  phone: "9876543210",
  address: "Plot 42, Kisan Seva Kendra, Near Mandi Gate",
  city: "Indore",
  state: "Madhya Pradesh",
  pincode: "452001"
};

const initialSampleOrders = [
  {
    id: "ORD-94821",
    date: "10 Oct 2026",
    status: "Delivered",
    items: [
      {
        id: "1-100g",
        name: "Namdhari NS 585 Tomato Hybrid Seeds",
        price: 349,
        quantity: 2,
        selectedQtyOption: "100g",
        image: "https://picsum.photos/seed/tomato-seeds-585/400/300"
      },
      {
        id: "15-1kg",
        name: "Advanta Coral 4370 High Oil Mustard Seeds",
        price: 520,
        quantity: 1,
        selectedQtyOption: "1kg",
        image: "https://picsum.photos/seed/mustard-yellow-flowers/400/300"
      }
    ],
    totalAmount: 1218,
    paymentMethod: "UPI (Google Pay)",
    deliveryAddress: {
      name: "Rameshwar Patel",
      phone: "9876543210",
      address: "Plot 42, Kisan Seva Kendra, Near Mandi Gate, Indore, Madhya Pradesh - 452001"
    }
  }
];

const loadUser = () => {
  try {
    const saved = localStorage.getItem('z_plus_agri_user');
    return saved ? JSON.parse(saved) : initialUser;
  } catch (e) {
    return initialUser;
  }
};

const loadOrders = () => {
  try {
    const saved = localStorage.getItem('z_plus_agri_orders');
    return saved ? JSON.parse(saved) : initialSampleOrders;
  } catch (e) {
    return initialSampleOrders;
  }
};

export const useAuthStore = create((set, get) => ({
  user: loadUser(),
  isAuthenticated: true,
  orders: loadOrders(),

  login: (emailOrPhone, password) => {
    const user = {
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : "Kisan Mitr",
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@kisan.in`,
      phone: emailOrPhone.replace(/\D/g, '').slice(-10) || "9876543210",
      address: "Village Post Office, Block Agri Office",
      city: "Varanasi",
      state: "Uttar Pradesh",
      pincode: "221001"
    };
    localStorage.setItem('z_plus_agri_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return true;
  },

  register: (userData) => {
    const user = {
      name: userData.name || "Kisan Sathi",
      email: userData.email || "farmer@kisan.in",
      phone: userData.phone || "9876543210",
      address: userData.address || "Main Farm Road",
      city: userData.city || "Nagpur",
      state: userData.state || "Maharashtra",
      pincode: userData.pincode || "440001"
    };
    localStorage.setItem('z_plus_agri_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return true;
  },

  updateProfile: (updatedData) => {
    const currentUser = get().user || {};
    const newUser = { ...currentUser, ...updatedData };
    localStorage.setItem('z_plus_agri_user', JSON.stringify(newUser));
    set({ user: newUser });
  },

  logout: () => {
    localStorage.removeItem('z_plus_agri_user');
    set({ user: null, isAuthenticated: false });
  },

  addOrder: (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Confirmed",
      ...orderData
    };
    const updatedOrders = [newOrder, ...get().orders];
    localStorage.setItem('z_plus_agri_orders', JSON.stringify(updatedOrders));
    set({ orders: updatedOrders });
    return newOrder;
  }
}));
