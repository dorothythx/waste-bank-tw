import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { useDataStore, selectInventory } from '../../store/DataContext';
import { formatCurrency, formatNumber } from '../../utils/format';
import { INVENTORY_STATUS } from '../../data/wasteTypes';

const STATUS_TONE = {
  [INVENTORY_STATUS.IN_STOCK]: 'green',
  [INVENTORY_STATUS.LOW]: 'red',
  [INVENTORY_STATUS.OUT]: 'gray',
};

export default function Inventory() {
  const { state } = useDataStore();
  const inventory = selectInventory(state);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inventory;
    return inventory.filter((i) => i.name.toLowerCase().includes(q));
  }, [inventory, query]);

  const columns = [
    { key: 'name', header: 'ประเภทขยะ' },
    { key: 'quantity', header: 'จำนวนคงเหลือ', align: 'right', render: (r) => formatNumber(r.quantity) },
    { key: 'unit', header: 'หน่วย' },
    { key: 'purchasePrice', header: 'ราคาซื้อ', align: 'right', render: (r) => formatCurrency(r.purchasePrice) },
    { key: 'salePrice', header: 'ราคาขาย', align: 'right', render: (r) => formatCurrency(r.salePrice) },
    {
      key: 'status',
      header: 'สถานะ',
      render: (r) => {
        const status = statusFor(r.quantity);
        return <Badge tone={STATUS_TONE[status]}>{status}</Badge>;
      },
    },
  ];

  return (
    <AppLayout title="สินค้าคงคลัง">
      <PageHeader
        title="สินค้าคงคลัง"
        description="ปริมาณขยะคงเหลือคำนวณจากรายการรับซื้อและขายทั้งหมดโดยอัตโนมัติ"
      />

      <div className="field" style={{ maxWidth: 320 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--gray-400)' }} />
          <input
            style={{ paddingLeft: 36 }}
            placeholder="ค้นหาตามประเภทขยะ"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Table columns={columns} rows={filtered} emptyTitle="ไม่พบประเภทขยะที่ค้นหา" />
    </AppLayout>
  );
}

function statusFor(quantity) {
  if (quantity <= 0) return INVENTORY_STATUS.OUT;
  if (quantity <= 10) return INVENTORY_STATUS.LOW;
  return INVENTORY_STATUS.IN_STOCK;
}
