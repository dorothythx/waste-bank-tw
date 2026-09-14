import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import { useDataStore, selectMembersWithBalance, validateDataAction } from '../../store/DataContext';
import { formatCurrency, formatPhoneInput, isValidPhoneDigits, normalizePhoneNumber } from '../../utils/format';

const MEMBER_TYPE_LABEL = { student: 'นักเรียน', community: 'สมาชิกชุมชน' };

export default function Members() {
  const { state, dispatch } = useDataStore();
  const navigate = useNavigate();
  const members = selectMembersWithBalance(state);

  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memberType, setMemberType] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        (m.studentId || '').toLowerCase().includes(q)
    );
  }, [members, query]);

  const openAdd = () => {
    setName('');
    setPhone('');
    setMemberType('student');
    setStudentId('');
    setGradeLevel('');
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
    if (!isValidPhoneDigits(phone)) {
      setError('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
      return;
    }
    if (memberType === 'student') {
      if (!studentId.trim()) {
        setError('กรุณากรอกรหัสนักเรียน');
        return;
      }
      if (!gradeLevel.trim()) {
        setError('กรุณากรอกระดับชั้น');
        return;
      }
    }

    dispatch({
      type: 'ADD_MEMBER',
      payload: {
        name: name.trim(),
        phone: normalizePhoneNumber(phone),
        memberType,
        studentId: memberType === 'student' ? studentId.trim() : null,
        gradeLevel: memberType === 'student' ? gradeLevel.trim() : null,
      },
    });
    setShowAdd(false);
    setSuccess(`เพิ่มสมาชิก "${name.trim()}" เรียบร้อยแล้ว`);
    setTimeout(() => setSuccess(''), 3500);
  };

  const openDelete = (member) => {
    setDeleteTarget(member);
    setDeleteError('');
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setDeleteError('');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const action = { type: 'DELETE_MEMBER', payload: { memberId: deleteTarget.id } };
    const validationError = validateDataAction(state, action);
    if (validationError) {
      setDeleteError(validationError);
      return;
    }

    dispatch(action);
    setSuccess(`ลบสมาชิก "${deleteTarget.name}" เรียบร้อยแล้ว`);
    setTimeout(() => setSuccess(''), 3500);
    setDeleteTarget(null);
    setDeleteError('');
  };

  const columns = [
    { key: 'id', header: 'รหัสสมาชิก' },
    { key: 'name', header: 'ชื่อสมาชิก' },
    {
      key: 'memberType',
      header: 'ประเภทสมาชิก',
      render: (r) => (
        <Badge tone={r.memberType === 'student' ? 'green' : 'gray'}>
          {MEMBER_TYPE_LABEL[r.memberType] || MEMBER_TYPE_LABEL.community}
        </Badge>
      ),
    },
    { key: 'phone', header: 'เบอร์โทรศัพท์' },
    {
      key: 'balance',
      header: 'ยอดเงินคงเหลือ',
      align: 'right',
      render: (r) => formatCurrency(r.balance),
    },
    {
      key: 'actions',
      header: 'การดำเนินการ',
      align: 'right',
      render: (r) => (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          aria-label={`ลบสมาชิก ${r.name}`}
          onClick={(e) => {
            e.stopPropagation();
            openDelete(r);
          }}
        >
          <Trash2 size={14} />
          ลบ
        </button>
      ),
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
            placeholder="ค้นหาด้วยรหัสสมาชิก ชื่อ หรือรหัสนักเรียน"
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
            <label htmlFor="member-type">ประเภทสมาชิก</label>
            <select
              id="member-type"
              value={memberType}
              onChange={(e) => setMemberType(e.target.value)}
            >
              <option value="student">นักเรียน</option>
              <option value="community">สมาชิกชุมชน</option>
            </select>
          </div>
          {memberType === 'student' && (
            <>
              <div className="field">
                <label htmlFor="member-student-id">รหัสนักเรียน</label>
                <input
                  id="member-student-id"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="เช่น 65001"
                />
              </div>
              <div className="field">
                <label htmlFor="member-grade-level">ระดับชั้น</label>
                <input
                  id="member-grade-level"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="เช่น ม.5/1"
                />
              </div>
            </>
          )}
          <div className="field">
            <label htmlFor="member-phone">เบอร์โทรศัพท์</label>
            <input
              id="member-phone"
              value={phone}
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
              placeholder="เช่น 081-234-5678"
              inputMode="numeric"
              maxLength={12}
            />
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

      <Modal open={!!deleteTarget} title="ยืนยันการลบสมาชิก" onClose={closeDelete}>
        {deleteError && <Alert type="error">{deleteError}</Alert>}
        <p style={{ marginBottom: 16, color: 'var(--gray-700)' }}>
          ต้องการลบสมาชิก "{deleteTarget?.name}" ({deleteTarget?.id}) ใช่หรือไม่ การลบไม่สามารถย้อนกลับได้
        </p>
        <div className="form-actions">
          <Button variant="danger" onClick={handleConfirmDelete}>
            <Trash2 size={16} />
            ยืนยันลบ
          </Button>
          <Button type="button" variant="secondary" onClick={closeDelete}>
            ยกเลิก
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
