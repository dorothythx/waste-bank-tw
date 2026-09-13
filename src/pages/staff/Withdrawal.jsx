import { useState } from 'react';
import { Save } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import { useDataStore, selectMembersWithBalance } from '../../store/DataContext';
import { formatCurrency } from '../../utils/format';

export default function Withdrawal() {
  const { state, dispatch } = useDataStore();
  const members = selectMembersWithBalance(state);

  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const member = members.find((m) => m.id === memberId);
  const amountNum = Number(amount) || 0;
  const balanceAfter = (member?.balance || 0) - amountNum;

  const validate = () => {
    if (!memberId) return 'กรุณาเลือกสมาชิก';
    if (!amount || Number.isNaN(amountNum) || amountNum <= 0) return 'จำนวนเงินต้องมากกว่า 0';
    if (amountNum > (member?.balance || 0)) return 'จำนวนเงินต้องไม่เกินยอดเงินคงเหลือ';
    return '';
  };

  const handleReview = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    try {
      dispatch({ type: 'ADD_WITHDRAWAL', payload: { memberId, amount: amountNum } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกการถอนเงินได้');
      setConfirmOpen(false);
      return;
    }
    setConfirmOpen(false);
    setSuccess(`บันทึกการถอนเงิน ${formatCurrency(amountNum)} ให้ ${member.name} เรียบร้อยแล้ว`);
    setAmount('');
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <AppLayout title="ถอนเงิน">
      <PageHeader
        title="บันทึกการถอนเงินสมาชิก"
        description="บันทึกรายการถอนเงินสดของสมาชิก ยอดเงินคงเหลือจะลดลงทันที"
      />

      {success && <Alert type="success">{success}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleReview}>
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
          <div className="field" style={{ marginTop: 16, maxWidth: 260 }}>
            <label htmlFor="amount">จำนวนเงินที่ถอน</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
            <span className="hint">ถอนได้สูงสุด {member ? formatCurrency(member.balance) : '-'}</span>
          </div>
        </div>

        <div className="card section">
          <h3 className="card-title">ตัวอย่างรายการ</h3>
          <div className="form-row">
            <div>
              <div className="hint">ยอดก่อนถอน</div>
              <div style={{ fontWeight: 600 }}>{formatCurrency(member?.balance || 0)}</div>
            </div>
            <div>
              <div className="hint">จำนวนเงินที่ถอน</div>
              <div style={{ fontWeight: 600, color: 'var(--red-600)' }}>-{formatCurrency(amountNum)}</div>
            </div>
            <div>
              <div className="hint">ยอดหลังถอน</div>
              <div style={{ fontWeight: 600, color: balanceAfter < 0 ? 'var(--red-600)' : 'var(--green-800)' }}>
                {formatCurrency(Math.max(balanceAfter, 0))}
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit">
            <Save size={16} />
            บันทึกการถอนเงิน
          </Button>
        </div>
      </form>

      <Modal open={confirmOpen} title="ยืนยันการถอนเงิน" onClose={() => setConfirmOpen(false)}>
        <p style={{ marginBottom: 16, color: 'var(--gray-700)' }}>
          ยืนยันการถอนเงิน {formatCurrency(amountNum)} ให้กับ {member?.name} ({member?.id}) ใช่หรือไม่
        </p>
        <div className="form-actions">
          <Button onClick={handleConfirm}>ยืนยัน</Button>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            ยกเลิก
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
