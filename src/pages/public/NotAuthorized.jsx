import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import Button from '../../components/ui/Button';

export default function NotAuthorized() {
  const { session } = useAuth();
  const homePath = session.role === 'staff' ? '/staff/dashboard' : session.role === 'member' ? '/member/dashboard' : '/login';

  return (
    <div className="blocked-page">
      <div className="blocked-card">
        <div className="icon-wrap">
          <ShieldAlert size={30} />
        </div>
        <h2 style={{ marginBottom: 8 }}>ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: 20 }}>
          บทบาทปัจจุบันของคุณไม่สามารถเข้าถึงหน้านี้ได้ในระบบต้นแบบนี้
        </p>
        <Link to={homePath}>
          <Button>กลับสู่หน้าหลักของฉัน</Button>
        </Link>
      </div>
    </div>
  );
}
