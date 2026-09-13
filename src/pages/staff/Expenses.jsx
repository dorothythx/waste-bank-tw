import { useState } from 'react';
import { Save } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader, StatCard } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useDataStore, selectExpensesSorted, selectTotals, validateDataAction } from '../../store/DataContext';
import { EXPENSE_CATEGORIES } from '../../data/wasteTypes';
import { formatCurrency, formatDate } from '../../utils/format';

function todayIso() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export default function Expenses() {
  const { state, dispatch } = useDataStore();
  const expenses = selectExpensesSorted(state);
  const totals = selectTotals(state);

  const [date, setDate] = useState(todayIso());
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setDate(todayIso());
    setCategory(EXPENSE_CATEGORIES[0]);
    setDescription('');
    setAmount('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date) {
      setError('กรุณาเลือกวันที่');
      return;
    }

    if (!category) {
      setError('กรุณาเลือกประเภทค่าใช้จ่าย');
      return;
    }

    if (!description.trim()) {
      setError('กรุณากรอกรายละเอียด');
      return;
    }

    const amountNum = Number(amount);

    if (!amount || Number.isNaN(amountNum) || amountNum <= 0) {
      setError('จำนวนเงินต้องเป็นตัวเลขที่มากกว่า 0');
      return;
    }

    setError('');

    const action = {
      type: 'ADD_EXPENSE',
      payload: {
        date,
        category,
        description: description.trim(),
        amount: amountNum,
      },
    };
    const validationError = validateDataAction(state, action);
    if (validationError) {
      setError(validationError);
      return;
    }

    dispatch(action);

    setSuccess(
      `บันทึกค่าใช้จ่าย "${description.trim()}" จำนวน ${formatCurrency(amountNum)} เรียบร้อยแล้ว`
    );

    resetForm();
    setTimeout(() => setSuccess(''), 4000);
  };

  const columns = [
    { key: 'date', header: 'วันที่', render: (r) => formatDate(r.date) },
    { key: 'category', header: 'ประเภท' },
    { key: 'description', header: 'รายละเอียด' },
    {
      key: 'amount',
      header: 'จำนวนเงิน',
      align: 'right',
      render: (r) => formatCurrency(r.amount),
    },
  ];

  return (
    <AppLayout title="ค่าใช้จ่าย">
      <PageHeader
        title="บันทึกค่าใช้จ่ายของธนาคารขยะ"
        description="บันทึกค่าใช้จ่ายที่เกิดขึ้นจากการดำเนินงานของธนาคารขยะ"
      />

      {success && <Alert type="success">{success}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="section">
        <StatCard
          label="ค่าใช้จ่ายทั้งหมด"
          value={formatCurrency(totals.totalExpenses)}
        />
      </div>

      <form onSubmit={handleSubmit} className="card section">
        <h3 className="card-title">เพิ่มรายการค่าใช้จ่าย</h3>

        <div className="form-row">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="date">วันที่</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="category">ประเภทค่าใช้จ่าย</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="amount">จำนวนเงิน</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label htmlFor="description">รายละเอียด</label>
          <input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="เช่น ซื้อถุงมือสำหรับคัดแยกขยะ"
          />
        </div>

        <div className="form-actions">
          <Button type="submit">
            <Save size={16} />
            บันทึกค่าใช้จ่าย
          </Button>
        </div>
      </form>

      <div className="section">
        <h3 className="section-title">รายการค่าใช้จ่ายทั้งหมด</h3>
        <Table
          columns={columns}
          rows={expenses}
          emptyTitle="ยังไม่มีรายการค่าใช้จ่าย"
        />
      </div>
    </AppLayout>
  );
}