import { useState } from 'react';
import { Menu, CircleUserRound } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../store/AuthContext';
import { useDataStore } from '../../store/DataContext';

export default function AppLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const { state } = useDataStore();

  const currentMember =
    session.role === 'member' ? state.members.find((m) => m.id === session.memberId) : null;

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="menu-btn" onClick={() => setOpen(true)} aria-label="เปิดเมนู">
              <Menu size={22} />
            </button>
            <span className="page-title">{title}</span>
          </div>
          <div className="who">
            <CircleUserRound size={20} color="var(--green-700)" />
            {session.role === 'staff' ? 'เจ้าหน้าที่ (Demo)' : currentMember ? `${currentMember.name} (${currentMember.id})` : 'สมาชิก'}
          </div>
        </header>
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
