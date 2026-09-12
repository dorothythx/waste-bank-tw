import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/ui/Card';
import AccountStatement from '../../components/AccountStatement';
import { useAuth } from '../../store/AuthContext';

export default function MemberAccount() {
  const { session } = useAuth();

  return (
    <AppLayout title="บัญชีสมาชิกของฉัน">
      <PageHeader
        title="บัญชีสมาชิกของฉัน"
        description="ยอดเงินและประวัติธุรกรรมทั้งหมดของคุณ"
      />
      <AccountStatement memberId={session.memberId} />
    </AppLayout>
  );
}
