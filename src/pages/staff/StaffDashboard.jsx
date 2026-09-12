import { Link } from 'react-router-dom';
import { PackagePlus, Truck, UserPlus, Banknote } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader, StatCard } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { useDataStore, selectTotals, selectRecentTransactions } from '../../store/DataContext';
import { formatCurrency, formatDate, formatNumber } from '../../utils/format';

const TYPE_LABEL = { purchase: 'รับซื้อ', sale: 'ขาย', withdrawal: 'ถอนเงิน' };
const TYPE_TONE = { purchase: 'num-in', sale: 'num-in', withdrawal: 'num-out' };

export default function StaffDashboard() {
  const { state } = useDataStore();
  const totals = selectTotals(state);
  const recent = selectRecentTransactions(state, 8);

  const columns = [
    { key: 'date', header: 'วันที่', render: (r) => formatDate(r.date) },
    { key: 'description', header: 'รายการ' },
    { key: 'type', header: 'ประเภท', render: (r) => TYPE_LABEL[r.type] },
    {
      key: 'quantity',
      header: 'จำนวน',
      render: (r) => (r.quantity ? formatNumber(r.quantity, r.unit) : '—'),
    },
    {
      key: 'amount',
      header: 'จำนวนเงิน',
      align: 'right',
      render: (r) => (
        <span className={TYPE_TONE[r.type]}>
          {r.type === 'withdrawal' ? '-' : '+'}
          {formatCurrency(r.amount)}
        </span>
      ),
    },
  ];

  return (
    <AppLayout title="Dashboard">
      <PageHeader
        title="สวัสดี เจ้าหน้าที่ธนาคารขยะ"
        description="ภาพรวมข้อมูลของธนาคารขยะโรงเรียนแตลศิริวิทยา (ข้อมูลจำลองสำหรับสาธิต)"
      />

      <div className="section">
        <div className="stat-grid">
          <StatCard label="จำนวนสมาชิก" value={formatNumber(totals.memberCount)} unit="คน" />
          <StatCard label="ยอดขยะที่รับซื้อสะสม" value={formatNumber(totals.totalPurchaseQuantity)} unit="kg" />
          <StatCard label="มูลค่าการรับซื้อสะสม" value={formatCurrency(totals.totalPurchaseValue)} />
          <StatCard label="สินค้าคงเหลือรวม" value={formatNumber(totals.totalStock)} unit="kg" />
          <StatCard label="ยอดขายสะสม" value={formatCurrency(totals.totalSalesValue)} />
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">เมนูด่วน</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/staff/purchase">
            <button className="btn btn-primary btn-sm">
              <PackagePlus size={16} />
              รับซื้อขยะ
            </button>
          </Link>
          <Link to="/staff/sale">
            <button className="btn btn-secondary btn-sm">
              <Truck size={16} />
              ขายขยะ
            </button>
          </Link>
          <Link to="/staff/members">
            <button className="btn btn-secondary btn-sm">
              <UserPlus size={16} />
              เพิ่มสมาชิก
            </button>
          </Link>
          <Link to="/staff/withdrawal">
            <button className="btn btn-secondary btn-sm">
              <Banknote size={16} />
              ถอนเงิน
            </button>
          </Link>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">ธุรกรรมล่าสุด</h3>
        <Table
          columns={columns}
          rows={recent}
          emptyTitle="ยังไม่มีธุรกรรม"
          emptyDescription="เริ่มต้นด้วยการรับซื้อขยะจากสมาชิก"
        />
      </div>
    </AppLayout>
  );
}
