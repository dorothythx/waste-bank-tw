import { NavLink } from 'react-router-dom';
import { LogOut, RefreshCcw } from 'lucide-react';
import { STAFF_NAV, MEMBER_NAV } from '../../data/navigation';
import { useAuth } from '../../store/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { session, logout } = useAuth();
  const nav = session.role === 'staff' ? STAFF_NAV : MEMBER_NAV;

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/taelsiri-logo.png" alt="ตราโรงเรียนแตลศิริวิทยา" className="brand-logo" />
            <span className="name">ธนาคารขยะ<br />โรงเรียนแตลศิริวิทยา</span>
          </div>
          <div className="sub">{session.role === 'staff' ? 'โหมดเจ้าหน้าที่ (Demo)' : 'โหมดสมาชิก (Demo)'}</div>
        </div>
        <nav>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={onClose}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/login" style={{ width: '100%' }}>
            <button className="btn btn-outline btn-sm btn-block">
              <RefreshCcw size={16} />
              เปลี่ยนบทบาท
            </button>
          </NavLink>
          <button className="btn btn-outline btn-sm btn-block" onClick={logout} style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
            <LogOut size={16} />
            ออกจากระบบ
          </button>
        </div>
      </aside>
    </>
  );
}
