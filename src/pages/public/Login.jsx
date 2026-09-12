import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Recycle, ArrowLeft, UserCog, GraduationCap, Info } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useDataStore, selectMembersWithBalance } from '../../store/DataContext';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { loginAsStaff, loginAsMember } = useAuth();
  const { state } = useDataStore();
  const members = selectMembersWithBalance(state);

  const [role, setRole] = useState('staff');
  const [memberId, setMemberId] = useState(members[0]?.id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'staff') {
      loginAsStaff();
      navigate('/staff/dashboard');
    } else {
      loginAsMember(memberId);
      navigate('/member/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          กลับหน้าแรก
        </Link>
        <div className="login-brand">
          <Recycle size={30} color="var(--green-600)" style={{ margin: '0 auto' }} />
          <div className="name">ธนาคารขยะโรงเรียนแตลศิริวิทยา</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">รหัสสมาชิก / ชื่อผู้ใช้</label>
            <input id="username" placeholder="เช่น TW001 หรือ staff01" disabled />
          </div>
          <div className="field">
            <label htmlFor="password">รหัสผ่าน</label>
            <input id="password" type="password" placeholder="••••••••" disabled />
          </div>

          <div className="demo-mode-box">
            <div className="title">
              <Info size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
              Prototype Mode / Demo Mode — ระบบนี้ไม่มีการตรวจสอบรหัสผ่านจริง กรุณาเลือกบทบาทเพื่อทดลองใช้งาน
            </div>
            <div className="role-options">
              <label className={`role-option ${role === 'staff' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="staff"
                  checked={role === 'staff'}
                  onChange={() => setRole('staff')}
                />
                <UserCog size={16} />
                ทดลองใช้งานในฐานะเจ้าหน้าที่
              </label>
              <label className={`role-option ${role === 'member' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="member"
                  checked={role === 'member'}
                  onChange={() => setRole('member')}
                />
                <GraduationCap size={16} />
                ทดลองใช้งานในฐานะสมาชิก
              </label>
            </div>

            {role === 'member' && (
              <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
                <label htmlFor="member-select">เลือกสมาชิกสำหรับทดลองใช้งาน</label>
                <select id="member-select" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} — {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <Button type="submit" block>
            เข้าสู่ระบบ
          </Button>
        </form>
      </div>
    </div>
  );
}
