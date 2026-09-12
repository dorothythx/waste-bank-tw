import {
  LayoutDashboard,
  Users,
  PackagePlus,
  Warehouse,
  Wallet,
  Truck,
  Banknote,
  Receipt,
} from 'lucide-react';

export const STAFF_NAV = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/members', label: 'สมาชิก', icon: Users },
  { to: '/staff/purchase', label: 'รับซื้อขยะ', icon: PackagePlus },
  { to: '/staff/inventory', label: 'สินค้าคงคลัง', icon: Warehouse },
  { to: '/staff/accounts', label: 'บัญชีสมาชิก', icon: Wallet },
  { to: '/staff/sale', label: 'ขายขยะ', icon: Truck },
  { to: '/staff/withdrawal', label: 'ถอนเงิน', icon: Banknote },
  { to: '/staff/expenses', label: 'ค่าใช้จ่าย', icon: Receipt },
];

export const MEMBER_NAV = [
  { to: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/member/account', label: 'บัญชีสมาชิกของฉัน', icon: Wallet },
];
