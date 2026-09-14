import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader, StatCard } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Alert from '../../components/ui/Alert';
import {
  useDataStore,
  selectMemberBalance,
  selectMemberTransactions,
} from '../../store/DataContext';
import { formatCurrency, formatDate, formatNumber } from '../../utils/format';

const TYPE_LABEL = { purchase: 'รับซื้อ', withdrawal: 'ถอนเงิน' };
const MEMBER_TYPE_LABEL = { student: 'นักเรียน', community: 'สมาชิกชุมชน' };

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useDataStore();
  const member = state.members.find((m) => m.id === id);
  const balance = member ? selectMemberBalance(state, id) : 0;
  const transactions = member ? selectMemberTransactions(state, id) : [];
  const [copyMessage, setCopyMessage] = useState('');
  const [copyError, setCopyError] = useState('');

  if (!member) {
    return (
      <AppLayout title="สมาชิก">
        <p>ไม่พบข้อมูลสมาชิกรหัส {id}</p>
        <Link to="/staff/members">
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
            กลับไปหน้าสมาชิก
          </button>
        </Link>
      </AppLayout>
    );
  }

  const handleCopyPhone = async () => {
    setCopyError('');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(member.phone);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = member.phone;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (!ok) throw new Error('copy command failed');
      }
      setCopyMessage('คัดลอกเบอร์โทรศัพท์แล้ว');
      setTimeout(() => setCopyMessage(''), 2500);
    } catch {
      setCopyError('ไม่สามารถคัดลอกเบอร์โทรศัพท์ได้ กรุณาคัดลอกด้วยตนเอง');
      setTimeout(() => setCopyError(''), 3500);
    }
  };

  const columns = [
    { key: 'date', header: 'วันที่', render: (r) => formatDate(r.date) },
    { key: 'description', header: 'รายการ' },
    { key: 'type', header: 'ประเภท', render: (r) => TYPE_LABEL[r.type] },
    {
      key: 'amount',
      header: 'จำนวนเงิน',
      align: 'right',
      render: (r) => (
        <span className={r.type === 'withdrawal' ? 'num-out' : 'num-in'}>
          {r.type === 'withdrawal' ? '-' : '+'}
          {formatCurrency(r.amount)}
        </span>
      ),
    },
    {
      key: 'balanceAfter',
      header: 'คงเหลือ',
      align: 'right',
      render: (r) => formatCurrency(r.balanceAfter),
    },
  ];

  return (
    <AppLayout title="รายละเอียดสมาชิก">
      <button className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/staff/members')}>
        <ArrowLeft size={16} />
        กลับไปหน้าสมาชิก
      </button>

      <PageHeader
        title={`${member.name} (${member.id})`}
        description={`ประเภทสมาชิก: ${MEMBER_TYPE_LABEL[member.memberType] || MEMBER_TYPE_LABEL.community}`}
      />

      {copyMessage && <Alert type="success">{copyMessage}</Alert>}
      {copyError && <Alert type="error">{copyError}</Alert>}

      <div className="section">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>เบอร์โทรศัพท์</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 600 }}>{member.phone}</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              aria-label="คัดลอกเบอร์โทรศัพท์"
              onClick={handleCopyPhone}
            >
              {copyMessage ? <Check size={14} /> : <Copy size={14} />}
              คัดลอก
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="stat-grid">
          <StatCard label="ยอดเงินคงเหลือปัจจุบัน" value={formatCurrency(balance)} />
          <StatCard label="จำนวนธุรกรรมทั้งหมด" value={formatNumber(transactions.length)} unit="รายการ" />
          {member.memberType === 'student' && (
            <>
              <StatCard label="รหัสนักเรียน" value={member.studentId || '-'} />
              <StatCard label="ระดับชั้น" value={member.gradeLevel || '-'} />
            </>
          )}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">ประวัติธุรกรรมแบบย่อ</h3>
        <Table
          columns={columns}
          rows={transactions}
          emptyTitle="ยังไม่มีรายการธุรกรรม"
        />
      </div>
    </AppLayout>
  );
}
