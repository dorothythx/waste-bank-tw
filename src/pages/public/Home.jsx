import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Leaf,
  Coins,
  ClipboardList,
  Users,
  UserCog,
  GraduationCap,
} from 'lucide-react';

const GOALS = [
  { title: 'ลดปริมาณขยะภายในโรงเรียน', icon: Leaf },
  { title: 'เพิ่มมูลค่าให้กับขยะรีไซเคิล', icon: Coins },
  { title: 'สร้างระบบจัดการธนาคารขยะอย่างเป็นระบบ', icon: ClipboardList },
  { title: 'ส่งเสริมการมีส่วนร่วมของนักเรียนและสมาชิก', icon: Users },
];

const PROCESS_STEPS = [
  { no: '01', title: 'คัดแยก', desc: 'นักเรียนคัดแยกขยะรีไซเคิลตามประเภท' },
  { no: '02', title: 'ตรวจสอบ', desc: 'เจ้าหน้าที่ตรวจสอบชนิดและปริมาณ' },
  { no: '03', title: 'รับซื้อ', desc: 'บันทึกการรับซื้อและโอนเข้าบัญชีสมาชิก' },
  { no: '04', title: 'จัดเก็บ', desc: 'ขยะเข้าสู่สินค้าคงคลังของธนาคาร' },
  { no: '05', title: 'จำหน่าย', desc: 'ขายต่อให้ผู้รับซื้อที่ร่วมโครงการ' },
];

const NEWS = [
  {
    date: '3 วันที่แล้ว',
    title: 'เปิดรับสมาชิกใหม่ประจำภาคเรียน',
    desc: 'นักเรียนที่สนใจสมัครเป็นสมาชิกธนาคารขยะสามารถติดต่อได้ที่เจ้าหน้าที่ประจำจุดรับซื้อ',
  },
  {
    date: '1 สัปดาห์ที่แล้ว',
    title: 'สรุปยอดรับซื้อขยะประจำเดือน',
    desc: 'ยอดรวมขยะรีไซเคิลที่รับซื้อในเดือนนี้เพิ่มขึ้นจากเดือนก่อนหน้า ขอบคุณสมาชิกทุกคน',
  },
  {
    date: '2 สัปดาห์ที่แล้ว',
    title: 'ปรับปรุงจุดคัดแยกขยะหน้าโรงอาหาร',
    desc: 'เพิ่มถังคัดแยกประเภทขวดแก้วและโลหะ เพื่อความสะดวกในการนำมาขาย',
  },
];

const TIPS = [
  'ล้างและตากขวดพลาสติกให้แห้งก่อนนำมาขาย จะได้ราคาดีกว่าขยะเปียกชื้น',
  'แยกกระดาษที่เปื้อนคราบอาหารออกจากกระดาษสะอาด เพราะรับซื้อคนละราคา',
  'บีบกระป๋องให้แบนเพื่อประหยัดพื้นที่จัดเก็บในธนาคารขยะ',
];

export default function Home() {
  return (
    <div>
      <header className="public-header">
        <div className="container public-header-inner">
          <div className="public-brand">
            <img src="/taelsiri-logo.png" alt="ตราโรงเรียนแตลศิริวิทยา" className="brand-logo" />
            ธนาคารขยะแตลศิริวิทยา
          </div>
          <Link to="/login">
            <button className="btn btn-primary btn-sm">เข้าสู่ระบบ</button>
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-eyebrow">ระบบต้นแบบเพื่อการนำเสนอ</div>
            <h1>ธนาคารขยะโรงเรียนแตลศิริวิทยา</h1>
            <p className="hero-sub">
              เปลี่ยนขยะให้มีคุณค่า สร้างการจัดการขยะอย่างเป็นระบบภายในโรงเรียน
            </p>
            <div className="hero-actions">
              <Link to="/login">
                <button className="btn btn-primary">
                  เข้าสู่ระบบ
                  <ArrowRight size={16} />
                </button>
              </Link>
              <a href="#concept">
                <button className="btn btn-outline">เรียนรู้เกี่ยวกับโครงการ</button>
              </a>
            </div>
          </div>
          <div className="hero-diagram" id="concept">
            <div className="flow-step">
              <span className="dot" />
              นักเรียน/สมาชิกนำขยะมาคัดแยกและขาย
            </div>
            <div className="flow-step">
              <span className="dot" />
              ธนาคารขยะบันทึกการรับซื้อ
            </div>
            <div className="flow-step">
              <span className="dot" />
              ยอดเงินสมาชิกเพิ่มขึ้นทันที
            </div>
            <div className="flow-step">
              <span className="dot" />
              ขยะเข้าสู่สินค้าคงคลัง
            </div>
            <div className="flow-step">
              <span className="dot" />
              ธนาคารขยะขายต่อให้ผู้รับซื้อ
            </div>
            <div className="flow-step">
              <span className="dot" />
              เกิดระบบจัดการขยะที่ตรวจสอบได้
            </div>
          </div>
        </div>
      </section>

      <section className="section-public">
        <div className="container">
          <div className="section-heading">
            <h2>วัตถุประสงค์ของโครงการ</h2>
          </div>
          <div className="goal-grid">
            {GOALS.map((g) => (
              <div className="goal-card" key={g.title}>
                <g.icon size={22} color="var(--green-600)" style={{ marginBottom: 10 }} />
                <p style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{g.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-public alt">
        <div className="container">
          <div className="section-heading">
            <h2>กระบวนการจัดการขยะ</h2>
            <p>ห้าขั้นตอนหลักตั้งแต่คัดแยกจนถึงจำหน่าย</p>
          </div>
          <div className="process-rail">
            {PROCESS_STEPS.map((step) => (
              <div className="process-step" key={step.no}>
                <div className="step-no">{step.no}</div>
                <div style={{ fontWeight: 600, color: 'var(--green-900)', marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-public">
        <div className="container">
          <div className="section-heading">
            <h2>วิธีใช้งานระบบ</h2>
            <p>ระบบแบ่งการใช้งานตามบทบาทของผู้ใช้ เพื่อความชัดเจนและปลอดภัยของข้อมูล</p>
          </div>
          <div className="usage-grid">
            <div className="usage-card card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <UserCog size={20} color="var(--green-600)" />
                <h3 style={{ marginBottom: 0 }}>เจ้าหน้าที่</h3>
              </div>
              <ul>
                <li>จัดการสมาชิก</li>
                <li>รับซื้อขยะ</li>
                <li>ตรวจสอบสินค้าคงคลัง</li>
                <li>ดูบัญชีสมาชิก</li>
                <li>ขายขยะ</li>
                <li>บันทึกการถอนเงิน</li>
                <li>บันทึกค่าใช้จ่าย</li>
              </ul>
            </div>
            <div className="usage-card card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <GraduationCap size={20} color="var(--green-600)" />
                <h3 style={{ marginBottom: 0 }}>สมาชิก</h3>
              </div>
              <ul>
                <li>ดูยอดเงินของตนเอง</li>
                <li>ดูประวัติรายการของตนเอง</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-public alt">
        <div className="container">
          <div className="demo-banner">
            <strong>โหมดสาธิต (Demo Mode): </strong>
            ระบบนี้เป็น Prototype สำหรับสาธิตการทำงาน โดยใช้ข้อมูลจำลองและไม่มีการทำธุรกรรมจริง
          </div>
        </div>
      </section>

      <section className="section-public">
        <div className="container">
          <div className="section-heading">
            <h2>ข่าวสารและประกาศ</h2>
          </div>
          <div className="news-grid">
            {NEWS.map((n) => (
              <div className="news-card" key={n.title}>
                <div className="date">{n.date}</div>
                <h4>{n.title}</h4>
                <p>{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-public alt">
        <div className="container">
          <div className="section-heading">
            <h2>เกร็ดความรู้เรื่องการคัดแยกขยะ</h2>
          </div>
          <div className="tips-list">
            {TIPS.map((t) => (
              <div className="tip-item" key={t}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="foot-brand">
            <img src="/taelsiri-logo.png" alt="ตราโรงเรียนแตลศิริวิทยา" className="brand-logo" />
            <div className="foot-title">ธนาคารขยะโรงเรียนแตลศิริวิทยา</div>
          </div>
          <p>ระบบต้นแบบ (Prototype) สำหรับนำเสนอแนวทางการพัฒนาระบบธนาคารขยะของโรงเรียน</p>
          <p>ข้อมูลทั้งหมดเป็นข้อมูลจำลอง (Mock Data) สำหรับการนำเสนอ Prototype ไม่ใช่ธุรกรรมจริง</p>
        </div>
      </footer>
    </div>
  );
}
