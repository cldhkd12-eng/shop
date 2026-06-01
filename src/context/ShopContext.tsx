import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
  initialProducts,
  initialOrders,
  initialReports,
  initialVendors,
} from '../mockData';
import type { Product, OrderItem, ReportItem, VendorItem } from '../mockData';

export interface CartItem {
  product: Product;
  quantity: number;
  option: string;
}

export interface User {
  name: string;
  role: 'consumer' | 'vendor' | 'admin';
  isLoggedIn: boolean;
}

interface ShopContextType {
  products: Product[];
  cartItems: CartItem[];
  orders: OrderItem[];
  reports: ReportItem[];
  vendors: VendorItem[];
  user: User;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
  login: (name?: string) => void;
  logout: () => void;
  addToCart: (product: Product, quantity: number, option: string) => void;
  updateCartQty: (productId: string, option: string, change: number) => void;
  removeFromCart: (productId: string, option: string) => void;
  clearCart: () => void;
  addNewProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  createOrder: (order: Omit<OrderItem, 'id'>) => void;
  updateOrderStatus: (orderId: string, status: OrderItem['status'], label: string) => void;
  updateReportStatus: (reportId: string, status: ReportItem['status']) => void;
  updateVendorStatus: (vendorId: string, status: VendorItem['status']) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: initialProducts[0], quantity: 1, option: '100ml' }, // Santal 33
    { product: initialProducts[3], quantity: 1, option: '100ml' }, // Bleu de Chanel
    { product: initialProducts[4], quantity: 2, option: '50ml' },  // Miss Dior
  ]);
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [vendors, setVendors] = useState<VendorItem[]>(initialVendors);
  
  const [user, setUser] = useState<User>({
    name: '손님',
    role: 'consumer',
    isLoggedIn: false,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeoutId, setToastTimeoutId] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutId) {
      window.clearTimeout(toastTimeoutId);
    }
    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    setToastTimeoutId(timer);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  const login = (name: string = '홍길동') => {
    setUser({
      name,
      role: 'consumer',
      isLoggedIn: true,
    });
    showToast(`${name}님, 로그인에 성공했습니다! 🎉`);
  };

  const logout = () => {
    setUser({
      name: '손님',
      role: 'consumer',
      isLoggedIn: false,
    });
    showToast('로그아웃 되었습니다.');
  };

  const addToCart = (product: Product, quantity: number, option: string) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.option === option
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, option }];
    });
    showToast('장바구니에 담겼습니다! 🛒');
  };

  const updateCartQty = (productId: string, option: string, change: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.option === option) {
          const nextQty = Math.max(1, item.quantity + change);
          return { ...item, quantity: nextQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string, option: string) => {
    setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.option === option)));
    showToast('장바구니에서 상품을 삭제했습니다.');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addNewProduct = (newProd: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const id = 'p' + (products.length + 1);
    const product: Product = {
      ...newProd,
      id,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts(prev => [product, ...prev]);
    showToast('새 상품이 성공적으로 등록되었습니다! 🍾');
  };

  const createOrder = (orderData: Omit<OrderItem, 'id'>) => {
    const id = 'o' + (orders.length + 1);
    const newOrder: OrderItem = {
      ...orderData,
      id,
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderItem['status'], label: string) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status, statusLabel: label } : order))
    );
    showToast(`주문 상태가 "${label}"로 변경되었습니다.`);
  };

  const updateReportStatus = (reportId: string, status: ReportItem['status']) => {
    setReports(prev =>
      prev.map(rep => (rep.id === reportId ? { ...rep, status } : rep))
    );
    const actionLabel = status === 'blinded' ? '블라인드 처리' : '정상 승인';
    showToast(`신고 건이 ${actionLabel} 완료되었습니다.`);
  };

  const updateVendorStatus = (vendorId: string, status: VendorItem['status']) => {
    setVendors(prev =>
      prev.map(v => (v.id === vendorId ? { ...v, status } : v))
    );
    const actionLabel = status === 'approved' ? '입점 승인 완료' : '반려 처리 완료';
    showToast(actionLabel);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cartItems,
        orders,
        reports,
        vendors,
        user,
        toastMessage,
        showToast,
        hideToast,
        login,
        logout,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        addNewProduct,
        createOrder,
        updateOrderStatus,
        updateReportStatus,
        updateVendorStatus,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
