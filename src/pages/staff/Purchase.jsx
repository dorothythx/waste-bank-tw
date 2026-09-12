import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useDataStore, selectMembersWithBalance } from '../../store/DataContext';
import { WASTE_TYPES, getWasteType } from '../../data/wasteTypes';
import { formatCurrency, formatNumber } from '../../utils/format';

function emptyLine() {
  return { key: Math.random().toString(36).slice(2), wasteTypeId: WASTE_TYPES[0].id, quantity: '' };
}

export default function Purchase() {
  const { state, dispatch } = useDataStore();
  const members = selectMembersWithBalance(state);

  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [lines, setLines] = useState([emptyLine()]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const member = members.find((m) => m.id === memberId);

  const updateLine = (key, patch) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };
  const addLine = () => setLines((prev) => [...prev, emptyLine()]);
  const removeLine = (key) => setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.key !== key) : prev));

  const previewRows = lines
    .filter((l) => l.wasteTypeId && Number(l.quantity) > 0)
    .map((l) => {
      const wasteType = getWasteType(l.wasteTypeId);
      const total = Number(l.quantity) * wasteType.purchasePrice;
      return { ...l, wasteTypeName: wasteType.name, unit: wasteType.unit, price: wasteType.purchasePrice, total };
    });

  const grandTotal = previewRows.reduce((sum, r) => sum + r.total, 0);

  const resetForm = () => {
    setLines([emptyLine()]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!memberId) {
      setError('กรุณาเลือกสมาชิก');
      return;
    }
    const validItems = lines.filter((l) => l.wasteTypeId);
    for (const l of validItems) {
      if (!l.quantity || Number.isNaN(Number(l.quantity)) || Number(l.quantity) <= 0) {
        setError('กรุณากรอกจำนวนขยะให้ถูกต้องและมากกว่า 0 ทุกรายการ');
        return;
      }
    }
    if (previewRows.length === 0) {
      setError('กรุณาเพิ่มรายการขยะอย่างน้อย 1 รายการ');
      return;
    }

    dispatch({
      type: 'ADD_PURCHASE',
      payload: {
        memberId,
        items: previewRows.map((r) => ({ wasteTypeId: r.wasteTypeId, quantity: Number(r.quantity) })),
      },
    });

    setSuccess(`บันทึกการรับซื้อขยะจาก ${member?.name} เรียบร้อยแล้ว รวม ${formatCurrency(grandTotal)}`);
    resetForm();
    setTimeout(() => setSuccess(''), 4000);
  };

  const previewColumns = [
    { key: 'wasteTypeName', header: 'ประเภทขยะ' },
    { key: 'quantity', header: 'จำนวน', render: (r) => formatNumber(r.quantity, r.unit) },
    { key: 'price', header: 'ราคาต่อหน่วย', align: 'right', render: (r) => formatCurrency(r.price) },
    { key: 'total', header: 'รวม', align: 'right', render: (r) => formatCurrency(r.total) },
  ];

  return (
    <AppLayout title="รับซื้อขยะ">
      <PageHeader
        title="บันทึกการรับซื้อขยะ"
        description="สมาชิกนำขยะมาขาย ยอดเงินจะเข้าบัญชีสมาชิกและปริมาณขยะจะเพิ่มในสินค้าคงคลังทันที"
      />

      {success && <Alert type="success">{success}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <div className="card section">
          <div className="form-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="member">สมาชิก</label>
              <select id="member" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} — {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>ยอดเงินคงเหลือปัจจุบัน</label>
              <input value={member ? formatCurrency(member.balance) : '-'} disabled />
            </div>
          </div>
        </div>

        <div className="card section">
          <h3 className="card-title">รายการขยะที่รับซื้อ</h3>
          {lines.map((line, idx) => {
            const wasteType = getWasteType(line.wasteTypeId);
            return (
              <div key={line.key} className="form-row" style={{ alignItems: 'end', marginBottom: 12 }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>ประเภทขยะ</label>
                  <select
                    value={line.wasteTypeId}
                    onChange={(e) => updateLine(line.key, { wasteTypeId: e.target.value })}
                  >
                    {WASTE_TYPES.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({formatCurrency(w.purchasePrice)}/{w.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>จำนวน ({wasteType.unit})</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={line.quantity}
                    onChange={(e) => updateLine(line.key, { quantity: e.target.value })}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeLine(line.key)}
                    disabled={lines.length === 1}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            );
          })}
          <Button type="button" variant="secondary" size="sm" onClick={addLine}>
            <Plus size={15} />
            เพิ่มรายการ
          </Button>
        </div>

        <div className="section">
          <h3 className="section-title">ตรวจสอบรายการก่อนบันทึก</h3>
          <Table
            columns={previewColumns}
            rows={previewRows}
            emptyTitle="ยังไม่มีรายการที่กรอกครบถ้วน"
          />
          {previewRows.length > 0 && (
            <p style={{ textAlign: 'right', marginTop: 10, fontWeight: 600, color: 'var(--green-800)' }}>
              รวมทั้งหมด: {formatCurrency(grandTotal)}
            </p>
          )}
        </div>

        <div className="form-actions">
          <Button type="submit">
            <Save size={16} />
            บันทึกการรับซื้อ
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            ล้างฟอร์ม
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
