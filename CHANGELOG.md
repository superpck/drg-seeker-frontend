# บันทึกการเปลี่ยนแปลง

การเปลี่ยนแปลงสำคัญทั้งหมดของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

## [Unreleased]

### เพิ่ม
- เพิ่ม flow สำหรับค้นหาข้อมูลจาก AN ตอน onchange ในหน้า DRG
- เพิ่ม interface `HisIpdFormValue` เพื่อกำหนดรูปแบบข้อมูล HIS ที่ map กลับเข้า form
- เพิ่ม `onAnChange()` ใน DRG page component เพื่อเรียก HIS service และ patch ค่ากลับเข้า form
- เพิ่ม token interceptor สำหรับแนบ `Authorization` และ header ตาม `tokenName` อัตโนมัติ
- เพิ่มการตรวจสอบอายุแบบเงื่อนไข OR: `Age (0-124)` หรือ `Age Day (0-365)`
- เพิ่มการแจ้งเตือนผ่าน `pk-toastr` เมื่อข้อมูล required ไม่ครบหรือข้อมูลไม่ถูกต้อง
- เพิ่ม mapping DRG error code (1-10) เป็นข้อความอ่านง่าย และถือเป็น error เมื่อ `err` มีค่า
- เพิ่ม mock `HisService.saveIPD()` และเรียกใช้งานตามค่า config `saveHIS`

### เปลี่ยนแปลง
- อัปเดต AN input ใน DRG page template ให้ trigger lookup ผ่าน `(change)`
- อัปเดต signature ของ `HisService.getIpd(an)` ให้คืนค่า `Promise<Partial<HisIpdFormValue>>`
- คง `getIpd()` เป็น fake/stub ที่คืนค่า (`{}`) เพื่อให้แต่ละสถานพยาบาลนำไปต่อ API จริงเอง
- ปรับ DRG service ให้เรียก API จริงที่ `/seeker` (ยกเลิก mock response)
- ปรับรูปแบบ request payload ให้ส่ง `sdx1..sdx12` และ `proc1..proc20` แทน array
- รองรับ response โครงสร้าง `{ status, data, tgrp }` และ parse `tgrp.metadata`
- ปรับ UI แสดงผล `status`, `tgrp file`, `tgrp desc`, `tgrp version`
- ปรับ flow รับผลลัพธ์ให้ปิด loading ทุกกรณี ป้องกันปุ่มค้าง `Searching...`

## [2026.05.27-1]

### เพิ่ม
- เริ่มต้นตั้งค่า frontend ด้วย Angular 21
- เพิ่มหน้าแบบฟอร์ม DRG และ mock DRG service
- เพิ่มโครงสร้าง login service และ routing
