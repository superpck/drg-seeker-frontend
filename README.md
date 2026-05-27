# DRG Seeker Frontend
ระบบการบันทึกข้อมูลผู้ป่วยในเพื่อส่งไปประมวลผลใน DRG Seeker API

## ข้อมูลโปรเจกต์

- Name: `drg-seeker-frontend`
- Version: `1.0.0`
- Sub version: `2026.05.27-1`
- Package manager: `npm@11.12.0`

## ความต้องการระบบ

- Node.js 20+
- npm 11+

## ติดตั้ง

```bash
npm install
```

## รันระบบ (Development)

```bash
npm start
```

โปรเจกต์นี้รันที่ `http://localhost:4201`

## คำสั่งที่ใช้บ่อย

- `npm start` : รัน Angular dev server ที่พอร์ต 4201 และเปิดเบราว์เซอร์อัตโนมัติ
- `npm run build` : สร้างไฟล์ build ของแอปพลิเคชัน
- `npm run watch` : build แบบ watch mode (config `development`)
- `npm test` : รันการทดสอบ

## ฟีเจอร์หลัก

- ระบบล็อกอินและการจัดการสถานะ session
- ฟอร์ม DRG seeker พร้อมแสดงตัวอย่าง payload
- คำนวณ DRG แบบจำลองผ่าน `DrgService`
- การค้นหาข้อมูลจาก AN เมื่อ onchange:
  - ช่อง `an` จะเรียก `onAnChange()`
  - เรียก `HisService.getIpd(an)`
  - นำข้อมูลที่ได้มา patch กลับเข้า form

## หมายเหตุการเชื่อมต่อ HIS

`HisService.getIpd()` ปัจจุบันเป็น stub ที่คืนค่า fake `{}`

ให้เชื่อม API จริงของสถานพยาบาลที่ไฟล์:

- `src/app/services/his.service.ts`

รูปแบบข้อมูลที่คืนกลับควรตรงตาม `HisIpdFormValue` เพื่อให้ map เข้า form ได้โดยตรง

## ไฟล์สำคัญ

- DRG page component: `src/app/pages/drg-seeker/drg-seeker.page.ts`
- DRG page template: `src/app/pages/drg-seeker/drg-seeker.page.html`
- HIS service: `src/app/services/his.service.ts`
- DRG service (mock): `src/app/services/drg.service.ts`

## หมายเหตุ

- Form ใช้ Reactive Forms พร้อม strict typing
- ช่อง Secondary diagnosis (`sdx`) และ procedure (`proc`) จะแสดงแบบลำดับตามการกรอกช่องก่อนหน้า
