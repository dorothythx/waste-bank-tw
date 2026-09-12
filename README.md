# ธนาคารขยะโรงเรียนแตลศิริวิทยา — Prototype

เว็บแอปพลิเคชันต้นแบบ (Prototype) สำหรับสาธิตการทำงานของระบบธนาคารขยะโรงเรียน
ใช้ข้อมูลจำลอง (Mock Data) เก็บใน LocalStorage ของเบราว์เซอร์ ไม่มีการเชื่อมต่อ Backend
หรือธุรกรรมจริงใด ๆ

## เทคโนโลยีที่ใช้

- React 19 + Vite
- React Router (client-side routing, role-based guards)
- lucide-react (ไอคอน SVG)
- LocalStorage สำหรับเก็บข้อมูลระหว่างการใช้งาน (persist ข้าม refresh)

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ลิงก์ซึ่งแสดงในเทอร์มินัล (ปกติคือ http://localhost:5173)

## Build สำหรับ Production

```bash
npm run build
```

ไฟล์ที่ build แล้วจะอยู่ในโฟลเดอร์ `dist/`

## Deploy บน Netlify

โปรเจกต์นี้มีไฟล์ `netlify.toml` และ `public/_redirects` เตรียมไว้แล้ว
(กำหนด build command เป็น `npm run build`, publish directory เป็น `dist`,
และ redirect ทุกเส้นทางไปที่ `index.html` เพื่อให้ client-side routing ทำงานถูกต้อง)

วิธี Deploy:
1. Push โปรเจกต์นี้ขึ้น GitHub
2. เข้า Netlify → "Add new site" → "Import an existing project"
3. เลือก repository นี้ Netlify จะอ่านค่าจาก `netlify.toml` ให้อัตโนมัติ
4. กด Deploy

หรือใช้ Netlify CLI:
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## โครงสร้างโปรเจกต์

```
src/
  data/           ข้อมูลกลาง (ประเภทขยะ ราคา, ข้อมูลจำลองเริ่มต้น, เมนู navigation)
  store/          Context + Reducer สำหรับข้อมูลหลัก (DataContext) และสถานะผู้ใช้ (AuthContext)
  utils/          ฟังก์ชันช่วยจัดรูปแบบตัวเลข/วันที่ และสร้างรหัสอัตโนมัติ
  components/
    ui/           Components พื้นฐานที่ใช้ซ้ำ (Button, Card, Table, Modal, Alert, Badge, EmptyState)
    layout/       Sidebar, AppLayout (โครงหน้าหลังล็อกอิน)
    AccountStatement.jsx   ตารางบัญชีที่ใช้ร่วมกันทั้งหน้าเจ้าหน้าที่และสมาชิก
  pages/
    public/       Home (Landing Page), Login (Demo Mode), NotAuthorized
    staff/        Dashboard, สมาชิก, รับซื้อขยะ, สินค้าคงคลัง, บัญชีสมาชิก, ขายขยะ, ถอนเงิน, ค่าใช้จ่าย
    member/       Dashboard, บัญชีสมาชิกของฉัน
  routes/         ProtectedRoute (ตรวจสอบสิทธิ์ตามบทบาท Demo)
```

## หลักการออกแบบข้อมูล (สำคัญ)

- **สมาชิกและธุรกรรมเป็น Central Data Source เดียว** (`DataContext.jsx`) ทุกหน้าดึงข้อมูล
  ผ่าน selector เดียวกัน (เช่น `selectMemberBalance`, `selectInventory`, `selectTotals`)
  จึงไม่มีการ Hard-code ตัวเลขซ้ำในแต่ละหน้า
- **ยอดเงินสมาชิกและสินค้าคงคลังคำนวณจากรายการธุรกรรมเสมอ** ไม่มีการเก็บค่า Balance/Stock
  แยกไว้ต่างหากที่อาจไม่ตรงกัน
- **รหัสสมาชิกสร้างอัตโนมัติ** รูปแบบ `TW001`, `TW002`, ... เรียงลำดับต่อจากสมาชิกล่าสุด
- **ราคาขยะและประเภทขยะอยู่ใน `src/data/wasteTypes.js`** ที่เดียว พร้อมโครงสร้างที่รองรับ
  การเพิ่ม Subcategory ในอนาคตโดยไม่ต้องแก้ Core

## Demo Mode

หน้า Login ไม่มีการตรวจสอบรหัสผ่านจริง ให้เลือกได้ว่าจะทดลองใช้งานในฐานะ "เจ้าหน้าที่"
หรือ "สมาชิก" (เลือกสมาชิกจากรายชื่อจำลอง) และสามารถกด "เปลี่ยนบทบาท" จาก Sidebar
เพื่อกลับไปหน้า Login ใหม่ได้ตลอดเวลา

## รีเซ็ตข้อมูล Demo

ข้อมูลทั้งหมดเก็บใน LocalStorage ของเบราว์เซอร์ (key: `watebank_prototype_data_v1` และ
`watebank_prototype_session_v1`) หากต้องการรีเซ็ตกลับไปเป็นข้อมูลเริ่มต้น ให้ล้าง
LocalStorage ของเว็บไซต์นี้ผ่าน DevTools ของเบราว์เซอร์ (Application → Local Storage →
ลบทั้งสอง key) แล้ว Refresh หน้าเว็บ
