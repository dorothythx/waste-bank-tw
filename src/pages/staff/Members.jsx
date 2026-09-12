import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useDataStore, selectMembersWithBalance } from '../../store/DataContext';
import { formatCurrency } from '../../utils/format';

export default function Members() {
  const { state, dispatch } = useDataStore();
  const navigate = useNavigate();
  const members = selectMembersWithBalance(state);

  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    );
  }, [members, query]);

  const openAdd = () => {
    setName('');
    setPhone('');
    setError('');
    setShowAdd(true);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('กรุณากรอกชื่อสมาชิก');
      return;
    }
    if (!phone.trim()) {
      setError('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }
    dispatch({ type: 'ADD_MEMBER', payload: { name: name.trim(), phone: phone.trim() } });
    setShowAdd(false);
    setSuccess(`เพิ่มสมาชิก "${name.trim()}" เรียบร้อยแล้ว`);
    setTimeout(() => setSuccess(''), 3500);
  };

  const columns = [
    { key: 'id', header: 'รหัสสมาชิก' },
    { key: 'name', header: 'ชื่อสมาชิก' },
    { key: 'phone', header: 'เบอร์โทรศัพท์' },
    {
      key: 'balance',
      header: 'ยอดเงินคงเหลือ',
      align: 'right',
      render: (r) => formatCurrency(r.balance),
    },
  ];

  return (
    <AppLayout title="สมาชิก">
      <PageHeader
        title="จัดการสมาชิก"
        description="รายชื่อสมาชิกธนาคารขยะทั้งหมด พร้อมยอดเงินคงเหลือปัจจุบัน"
        actions={
          <Button size="sm" onClick={openAdd}>
            <UserPlus size={16} />
            เพิ่มสมาชิก
          </Button>
        }
      />

      {success && <Alert type="success">{success}</Alert>}

      <div className="field" style={{ maxWidth: 320 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--gray-400)' }} />
          <input
            style={{ paddingLeft: 36 }}
            placeholder="ค้นหาด้วยรหัสสมาชิกหรือชื่อ"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        rows={filtered}
        emptyTitle="ไม่พบสมาชิกที่ค้นหา"
        onRowClick={(m) => navigate(`/staff/members/${m.id}`)}
      />
      <p className="hint" style={{ marginTop: 10 }}>คลิกที่แถวสมาชิกเพื่อดูรายละเอียดและประวัติธุรกรรม</p>

      <Modal open={showAdd} title="เพิ่มสมาชิก" onClose={() => setShowAdd(false)}>
        <form onSubmit={handleAdd}>
          {error && <Alert type="error">{error}</Alert>}
          <div className="field">
            <label>รหัสสมาชิก</label>
            <input value="สร้างอัตโนมัติเมื่อบันทึก" disabled />
          </div>
          <div className="field">
            <label htmlFor="member-name">ชื่อสมาชิก</label>
            <input id="member-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น สมชาย ใจดี" />
          </div>
          <div className="field">
            <label htmlFor="member-phone">เบอร์โทรศัพท์</label>
            <input id="member-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="เช่น 081-234-5678" />
          </div>
          <div className="field">
            <label>ยอดเงินเริ่มต้น</label>
            <input value="0 บาท" disabled />
            <span className="hint">ไม่อนุญาตให้กรอกยอดเงินเริ่มต้นเอง</span>
          </div>
          <div className="form-actions">
            <Button type="submit">บันทึกสมาชิก</Button>
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
