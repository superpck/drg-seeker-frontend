# บันทึกการเปลี่ยนแปลง

การเปลี่ยนแปลงสำคัญทั้งหมดของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

## [Unreleased]

### เพิ่ม
- เพิ่ม flow สำหรับค้นหาข้อมูลจาก AN ตอน onchange ในหน้า DRG
- เพิ่ม interface `HisIpdFormValue` เพื่อกำหนดรูปแบบข้อมูล HIS ที่ map กลับเข้า form
- เพิ่ม `onAnChange()` ใน DRG page component เพื่อเรียก HIS service และ patch ค่ากลับเข้า form

### เปลี่ยนแปลง
- อัปเดต AN input ใน DRG page template ให้ trigger lookup ผ่าน `(change)`
- อัปเดต signature ของ `HisService.getIpd(an)` ให้คืนค่า `Promise<Partial<HisIpdFormValue>>`
- คง `getIpd()` เป็น fake/stub ที่คืนค่า (`{}`) เพื่อให้แต่ละสถานพยาบาลนำไปต่อ API จริงเอง

## [2026.05.27-1]

### เพิ่ม
- เริ่มต้นตั้งค่า frontend ด้วย Angular 21
- เพิ่มหน้าแบบฟอร์ม DRG และ mock DRG service
- เพิ่มโครงสร้าง login service และ routing
