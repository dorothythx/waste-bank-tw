import AppLayout from '../../components/layout/AppLayout';
import { PageHeader, StatCard } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { useAuth } from '../../store/AuthContext';
import {
  useDataStore,
  selectMemberBalance,
  selectMemberTransactions,
} from '../../store/DataContext';
import { formatCurrency, formatDate, formatNumber } from '../../utils/format';

const TYPE_LABEL = { purchase: 'รับซื้อ', withdrawal: 'ถอนเงิน' };

export default function MemberDashboard() {
  const { session } = useAuth();
  const { state } = useDataStore();
  const member = state.members.find((m) => m.id === session.memberId);
  const balance = member ? selectMemberBalance(state, member.id) : 0;
  const transactions = member ? selectMemberTransactions(state, member.id) : [];
  const recent = transactions.slice(0, 6);

  const purchases = transactions.filter((t) => t.type === 'purchase');
  const totalQuantity = purchases.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const totalReceived = purchases.reduce((sum, t) => sum + (t.credit || 0), 0);

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
  ];

  if (!member) {
    return (
      <AppLayout title="Dashboard">
        <p>ไม่พบข้อมูลสมาชิก</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      <PageHeader
        title={`สวัสดี ${member.name}`}
        description={`รหัสสมาชิก ${member.id} — นี่คือภาพรวมบัญชีของคุณ`}
      />

      <div className="section">
        <div className="stat-grid">
          <StatCard label="ยอดเงินคงเหลือ" value={formatCurrency(balance)} />
          <StatCard label="ปริมาณขยะที่ขายให้ธนาคาร" value={formatNumber(totalQuantity)} unit="kg" />
          <StatCard label="มูลค่าที่ได้รับทั้งหมด" value={formatCurrency(totalReceived)} />
          <StatCard label="จำนวนธุรกรรม" value={formatNumber(transactions.length)} unit="รายการ" />
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">ธุรกรรมล่าสุดของฉัน</h3>
        <Table columns={columns} rows={recent} emptyTitle="ยังไม่มีรายการธุรกรรม" />
      </div>
    </AppLayout>
  );
}
