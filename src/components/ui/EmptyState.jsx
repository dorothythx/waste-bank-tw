import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'ยังไม่มีข้อมูล', description }) {
  return (
    <div className="empty-state">
      <Inbox size={30} strokeWidth={1.5} style={{ margin: '0 auto 10px', color: 'var(--gray-400)' }} />
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
  );
}
