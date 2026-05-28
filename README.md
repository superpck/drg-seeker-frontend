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
- คำนวณ DRG ผ่าน API จริงที่ endpoint `/seeker`
- แนบ token อัตโนมัติผ่าน HTTP interceptor โดยอ่านจาก `tokenName`
- การค้นหาข้อมูลจาก AN เมื่อ onchange:
  - ช่อง `an` จะเรียก `onAnChange()`
  - เรียก `HisService.getIpd(an)`
  - นำข้อมูลที่ได้มา patch กลับเข้า form

## โครงสร้างข้อมูลสำคัญ

- DRG search request ส่ง `sdx` และ `proc` แบบแยกคอลัมน์:
  - `sdx1..sdx12`
  - `proc1..proc20`
- DRG response รองรับโครงสร้างจาก backend แบบ:
  - `status`
  - `data[0]` (เช่น `drg`, `rw`, `adjrw`, `wtlos`, `ot`, `err`, `warn`)
  - `tgrp` (`FileName` + `metadata`)
- หน้า UI จะ parse `tgrp.metadata` แล้วแสดง:
  - `fileName`
  - `fileDescription`
  - `productVersion`

## Validation และ Error Handling

- ฟิลด์บังคับ: `sex`, `los`, `discht`, `pdx`
- เงื่อนไขอายุ: ต้องกรอกอย่างน้อยหนึ่งค่า (`Age 0-124` หรือ `Age Day 0-365`)
- ถ้าข้อมูลไม่ครบหรือไม่ถูกต้อง จะแจ้งเตือนผ่าน `pk-toastr`
- รองรับ DRG error code `1-10` และแปลงเป็นข้อความอ่านง่าย
- หาก `err` มีค่า (ไม่ใช่ `0`) จะถือว่าเป็นผลลัพธ์ผิดพลาดและไม่แสดงผล DRG ปกติ
- ป้องกันอาการปุ่มค้าง `Searching...` โดยปิดสถานะ loading ทุกกรณี

## DRG Warning Codes

ระบบรองรับการ decode Warning Code แบบ bit flags (รวมค่าได้หลายตัว) เช่น `10 = 2 + 8`

- **1**: SDx ใช้ไม่ได้ หรือซ้ำกับ PDx หรือซ้ำกันเอง
- **2**: SDx ไม่เหมาะกับอายุ
- **4**: SDx ไม่เหมาะกับเพศ หรือเป็นรหัสสำหรับเพศใดเพศหนึ่ง แต่ไม่มีข้อมูลเพศ
- **8**: Proc ใช้ไม่ได้ หรือซ้ำกันเอง
- **16**: Proc ไม่เหมาะกับเพศ หรือเป็นรหัสสำหรับเพศใดเพศหนึ่ง แต่ไม่มีข้อมูลเพศ
- **32**: ไม่มีข้อมูลเพศ หรือใช้รหัสนอกเหนือจากที่กำหนด
- **64**: ไม่มีประเภทการจำหน่ายออกจากโรงพยาบาล หรือใช้รหัสนอกเหนือจากที่กำหนด
- **128**: ไม่มีวันที่ และ/หรือ เวลา ที่รับไว้ในโรงพยาบาล หรือ มีแต่ไม่ถูกต้อง
- **256**: ไม่มีวันที่ และ/หรือ เวลา ที่จำหน่ายออกจากโรงพยาบาล หรือ มีแต่ไม่ถูกต้อง

ระบบจะ:
- Decode `warn` value เป็นรายการข้อความเตือนทั้งหมดที่ตรงตาม bit flags
- แสดงคำเตือนในรูปแบบ list ใน UI
- แจ้งเตือนผ่าน toast notification พร้อมนับจำนวนคำเตือน

## หมายเหตุการเชื่อมต่อ HIS

`HisService.getIpd()` ปัจจุบันเป็น stub ที่คืนค่า fake `{}`

`HisService.saveIPD()` มี mock flow สำหรับบันทึกผลกลับ HIS เมื่อเปิดใช้ `saveHIS` ใน config

ให้เชื่อม API จริงของสถานพยาบาลที่ไฟล์:

- `src/app/services/his.service.ts`

รูปแบบข้อมูลที่คืนกลับควรตรงตาม `HisIpdFormValue` เพื่อให้ map เข้า form ได้โดยตรง

## ไฟล์สำคัญ

- DRG page component: `src/app/pages/drg-seeker/drg-seeker.page.ts`
- DRG page template: `src/app/pages/drg-seeker/drg-seeker.page.html`
- HIS service: `src/app/services/his.service.ts`
- DRG service: `src/app/services/drg.service.ts`
- Token interceptor: `src/app/interceptors/token.interceptor.ts`

## หมายเหตุ

- Form ใช้ Reactive Forms พร้อม strict typing
- ช่อง Secondary diagnosis (`sdx`) และ procedure (`proc`) จะแสดงแบบลำดับตามการกรอกช่องก่อนหน้า
- การเปิด/ปิดบันทึกผล DRG กลับ HIS ควบคุมผ่าน `saveHIS` ใน `src/app/configs/config.ts`
