import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/ui/Card';
import AccountStatement from '../../components/AccountStatement';
import { useDataStore, selectMembersWithBalance } from '../../store/DataContext';

export default function MemberAccounts() {
  const { state } = useDataStore();
  const members = selectMembersWithBalance(state);
  const [memberId, setMemberId] = useState(members[0]?.id || '');

  return (
    <AppLayout title="บัญชีสมาชิก">
      <PageHeader
        title="บัญชีสมาชิก"
        description="เลือกสมาชิกเพื่อตรวจสอบยอดเงินและประวัติธุรกรรมทั้งหมด"
      />

      <div className="field" style={{ maxWidth: 320 }}>
        <label htmlFor="member-pick">เลือกสมาชิก</label>
        <select id="member-pick" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.id} — {m.name}
            </option>
          ))}
        </select>
      </div>

      <AccountStatement memberId={memberId} />
    </AppLayout>
  );
}
