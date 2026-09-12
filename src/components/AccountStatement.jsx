import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, StatCard } from './ui/Card';
import Table from './ui/Table';
import { useDataStore, selectMemberBalance, selectMemberTransactions } from '../store/DataContext';
import { formatCurrency, formatDate } from '../utils/format';

const FILTERS = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'purchase', label: 'รับซื้อ' },
  { id: 'withdrawal', label: 'ถอนเงิน' },
];

export default function AccountStatement({ memberId }) {
  const { state } = useDataStore();
  const member = state.members.find((m) => m.id === memberId);
  const balance = memberId ? selectMemberBalance(state, memberId) : 0;
  const allTx = memberId ? selectMemberTransactions(state, memberId) : [];

  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let rows = allTx;
    if (filter !== 'all') rows = rows.filter((t) => t.type === filter);
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((t) => t.description.toLowerCase().includes(q));
    return rows;
  }, [allTx, filter, query]);

  if (!member) {
    return <p style={{ color: 'var(--gray-600)' }}>กรุณาเลือกสมาชิกเพื่อดูบัญชี</p>;
  }

  const columns = [
    { key: 'date', header: 'วันที่', render: (r) => formatDate(r.date) },
    { key: 'description', header: 'รายการ' },
    {
      key: 'credit',
      header: 'เงินเข้า',
      align: 'right',
      render: (r) => (r.credit ? <span className="num-in">+{formatCurrency(r.credit)}</span> : '—'),
    },
    {
      key: 'debit',
      header: 'เงินออก',
      align: 'right',
      render: (r) => (r.debit ? <span className="num-out">-{formatCurrency(r.debit)}</span> : '—'),
    },
    {
      key: 'balanceAfter',
      header: 'คงเหลือ',
      align: 'right',
      render: (r) => formatCurrency(r.balanceAfter),
    },
  ];

  return (
    <div>
      <Card className="section">
        <div className="form-row">
          <div>
            <div className="hint">รหัสสมาชิก</div>
            <div style={{ fontWeight: 600 }}>{member.id}</div>
          </div>
          <div>
            <div className="hint">ชื่อ</div>
            <div style={{ fontWeight: 600 }}>{member.name}</div>
          </div>
          <div>
            <div className="hint">เบอร์โทร</div>
            <div style={{ fontWeight: 600 }}>{member.phone}</div>
          </div>
        </div>
      </Card>

      <div className="section">
        <StatCard label="ยอดเงินคงเหลือปัจจุบัน" value={formatCurrency(balance)} />
      </div>

      <div className="section" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f.id)}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--gray-400)' }} />
          <input
            style={{ paddingLeft: 36 }}
            placeholder="ค้นหารายการ"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        rows={filtered}
        emptyTitle="ยังไม่มีรายการธุรกรรม"
      />
    </div>
  );
}
