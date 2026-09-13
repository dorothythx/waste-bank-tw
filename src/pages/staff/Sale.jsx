import { useState } from 'react';
import { Save } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useDataStore, selectStockFor, validateDataAction } from '../../store/DataContext';
import { WASTE_TYPES, getWasteType, MOCK_BUYERS } from '../../data/wasteTypes';
import { formatCurrency, formatNumber } from '../../utils/format';

export default function Sale() {
  const { state, dispatch } = useDataStore();

  const [buyer, setBuyer] = useState(MOCK_BUYERS[0]);
  const [wasteTypeId, setWasteTypeId] = useState(WASTE_TYPES[0].id);
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const wasteType = getWasteType(wasteTypeId);
  const stock = selectStockFor(state, wasteTypeId);
  const qtyNum = Number(quantity) || 0;
  const total = qtyNum * wasteType.salePrice;
  const stockAfter = stock - qtyNum;

  const resetForm = () => {
    setQuantity('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!quantity || Number.isNaN(qtyNum) || qtyNum <= 0) {
      setError('กรุณากรอกจำนวนที่ขายให้ถูกต้องและมากกว่า 0');
      return;
    }
    if (qtyNum > stock) {
      setError(`จำนวนที่ขายมากกว่าสินค้าคงเหลือ (คงเหลือ ${formatNumber(stock, wasteType.unit)})`);
      return;
    }

    const action = { type: 'ADD_SALE', payload: { buyer, wasteTypeId, quantity: qtyNum } };
    const validationError = validateDataAction(state, action);
    if (validationError) {
      setError(validationError);
      return;
    }

    dispatch(action);
    setSuccess(`บันทึกการขาย${wasteType.name}ให้ ${buyer} เรียบร้อยแล้ว มูลค่า ${formatCurrency(total)}`);
    resetForm();
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <AppLayout title="ขายขยะ">
      <PageHeader
        title="ขายขยะให้ผู้รับซื้อ"
        description="โรงเรียนขายขยะในสินค้าคงคลังให้ผู้รับซื้อภายนอก ยอดเงินสมาชิกจะไม่เปลี่ยนแปลง"
      />

      {success && <Alert type="success">{success}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <div className="card section">
          <div className="form-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="buyer">ผู้รับซื้อ</label>
              <select id="buyer" value={buyer} onChange={(e) => setBuyer(e.target.value)}>
                {MOCK_BUYERS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="waste-type">ประเภทขยะ</label>
              <select id="waste-type" value={wasteTypeId} onChange={(e) => setWasteTypeId(e.target.value)}>
                {WASTE_TYPES.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatCurrency(w.salePrice)}/{w.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row" style={{ marginTop: 16 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>สต๊อกปัจจุบัน</label>
              <input value={formatNumber(stock, wasteType.unit)} disabled />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="quantity">จำนวนที่ขาย ({wasteType.unit})</label>
              <input
                id="quantity"
                type="number"
                min="0"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>
        </div>

        <div className="section stat-grid">
          <div className="stat-card" style={{ borderLeftColor: stockAfter < 0 ? 'var(--red-600)' : 'var(--green-500)' }}>
            <div className="stat-label">สต๊อกหลังขาย</div>
            <div className="stat-value" style={{ color: stockAfter < 0 ? 'var(--red-600)' : undefined }}>
              {formatNumber(Math.max(stockAfter, 0))}
              <span className="stat-unit">{wasteType.unit}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">มูลค่าการขาย</div>
            <div className="stat-value">{formatCurrency(total)}</div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit">
            <Save size={16} />
            บันทึกการขาย
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            ล้างฟอร์ม
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
