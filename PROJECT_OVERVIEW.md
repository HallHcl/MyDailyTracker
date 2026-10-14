# 📊 My Daily Tracker - Project Overview & Technical Documentation

> **ระบบบันทึกรายรับ-รายจ่ายประจำวันสไตล์ Google Sheets Dark Theme**  
> ซิงค์ข้อมูล Real-Time 100% ผ่าน **Google Firebase Firestore**, รองรับการจัดการหลายบัญชีธนาคาร (**Dynamic Multi-Bank Management**), บริหารหลายสกุลเงิน (**Multi-Currency**), และรองรับการทำงานแบบ **Offline PWA**

---

## 📖 1. ภาพรวมโครงการ (Executive Summary)

**My Daily Tracker** เป็นเว็บแอปพลิเคชันรูปแบบ **Progressive Web App (PWA)** ที่พัฒนาขึ้นเพื่อตอบสนองการบันทึกรายรับ-รายจ่ายประจำวันอย่างรวดเร็ว สะดวก และแม่นยำ โดยถูกออกแบบมาเพื่อรองรับกรณีการใช้งานจริง เช่น:
1. **การบริหารหลายบัญชีธนาคาร (Multi-Bank):** สามารถกดเพิ่มบัญชีใหม่ เปลี่ยนชื่อ หรือลบบัญชีได้อย่างอิสระ โดยข้อมูลเงินและประวัติรายการของแต่ละบัญชีถูกแยกออกจากกันอย่างเด็ดขาด
2. **การบริหารหลายสกุลเงิน (Multi-Currency):** จัดการเงินบาท (`THB`), สกุลเงินในเกม (`WIP`, `MAYG`) หรือคริปโตเคอร์เรนซี โดยไม่ปะปนยอดคงเหลือ
3. **การซิงค์ข้อมูลบน Cloud แบบ Real-Time 100%:** ใช้ **Google Firebase Cloud Firestore** ทำให้ทุกอุปกรณ์ (คอมพิวเตอร์, โน้ตบุ๊ก, แท็บเล็ต, สมาร์ตโฟน) เห็นข้อมูลตรงกันทันทีแบบเรียลไทม์ โดยไม่มีค่าใช้จ่ายเซิร์ฟเวอร์ใดๆ (ใช้งานบน Firebase Spark Plan ฟรีถาวร)
4. **ความสวยงามและคุ้นเคย:** อินเทอร์เฟซธีม **Google Sheets Dark Mode** พร้อมแถบสูตร (`fx`), ชิปแสดงยอดคงเหลือ และมุมมองสถิติสไตล์สเปรดชีต

---

## 🛠️ 2. เทคโนโลยีที่ใช้ (Tech Stack & Architecture)

| ส่วนประกอบ | เทคโนโลยีที่เลือกใช้ | รายละเอียดการทำงาน |
|---|---|---|
| **Frontend Core** | HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 | ไม่ใช้เฟรมเวิร์กขนาดใหญ่ เพื่อความเร็วสูงสุด โหลดเร็ว น้ำหนักเบา และเสถียร |
| **Design System** | Vanilla CSS Variables, Flexbox, CSS Grid | ธีม Google Sheets Dark Theme (`#0F9D58` Accent, `#1a1a1f` Panel, Custom Typography) |
| **Cloud Database** | Google Firebase Cloud Firestore (v10.8.0 Compat) | รับ-ส่งข้อมูลแบบ Real-Time WebSocket/Snapshot Listeners แยกคอลเลกชันตามบัญชี |
| **Offline Persistence** | Firestore IndexedDB Persistence & HTML5 LocalStorage | บันทึกข้อมูลและแคชลงเครื่องทันที ใช้งานต่อได้แม้ขณะไม่มีสัญญาณอินเทอร์เน็ต |
| **PWA & Caching** | Service Worker (`sw.js`) & Web App Manifest (`manifest.json`) | รองรับการ Add to Home Screen บนมือถือและ Install App บนเดสก์ท็อป |
| **Hosting & CI/CD** | GitHub Pages (`origin/main`) | เผยแพร่เว็บอัตโนมัติผ่าน GitHub Pages |

---

## ✨ 3. คุณสมบัติเด่นของระบบ (Core Features Breakdown)

### 3.1 ระบบจัดการบัญชีธนาคารแบบ Dynamic (Bank Accounts Management)
- **เพิ่ม Bank ใหม่ (`+ เพิ่ม`):** อยู่ที่แถบด้านบนของส่วน ACTIVE ACCOUNT ในแถบเมนูข้าง (Sidebar) กรอกชื่อบัญชีที่ต้องการ (เช่น `SCB`, `KBank`, `BBL`, `เงินสด`) แล้วระบบจะสร้างพื้นที่จัดเก็บข้อมูลแยกบน Cloud ทันที
- **เปลี่ยนชื่อ Bank (`✏️`):** แก้ไขชื่อบัญชีได้ตลอดเวลาผ่าน Modal โดยชื่อใหม่จะถูกอัปเดตและซิงค์ไปยังทุกอุปกรณ์ทันที
- **ลบ Bank (`🗑️`):** รองรับการลบบัญชีพร้อมลบข้อมูลที่เกี่ยวข้องบน Cloud พร้อม Modal แจ้งเตือนยืนยันความปลอดภัย โดยมีระบบ Safeguard ป้องกันไม่ให้ลบบัญชีสุดท้าย เพื่อให้มีบัญชีใช้งานอย่างน้อย 1 บัญชีเสมอ
- **การแยกข้อมูลบัญชี:** แต่ละบัญชีจะมี:
  - ยอดเงินตั้งต้น (Initial Balances) ของตนเอง
  - ประวัติรายการธุรกรรม (Transactions) ของตนเอง
  - ยอดคงเหลือสะสม (Remaining Balances) ของตนเอง

### 3.2 การซิงค์ข้อมูล Real-Time 100% (Firebase Cloud Firestore)
- ข้อมูลทุกอย่างที่บันทึก (ทั้งการเพิ่ม, แก้ไข, ลบรายการรับ-จ่าย หรือการเปลี่ยนชื่อบัญชี) จะถูกบันทึกขึ้น Firestore ทันที
- มีระบบ **Debounce 250ms** ป้องกันการส่งคำขอเขียนซ้ำซ้อน
- แสดงสถานะการเชื่อมต่อบนแถบ Sidebar แบบเรียลไทม์:
  - 🟢 **Synced to Cloud (ชื่อบัญชี)**: เชื่อมต่อและซิงค์ข้อมูลสำเร็จ
  - 🟡 **Syncing to Cloud...**: กำลังบันทึกข้อมูลขึ้นเซิร์ฟเวอร์
  - 🔴 **Cloud Permission Error**: ปัญหาการเข้าถึง
  - ⚪ **Saved to Local Storage**: ทำงานในโหมดออฟไลน์

### 3.3 แถบป้อนข้อมูลสไตล์ช่องสูตร Formula Bar (`fx`)
- ออกแบบตามฟอร์แมต Formula Bar ของ Google Sheets:
  - ช่องกรอกจำนวนเงิน (`Amount`)
  - เมนูเลือกสกุลเงิน (`Currency`)
  - ช่องระบุคำอธิบาย (`Description`)
  - ปุ่ม `+ Income` (รายรับ - สีเขียว) และ `- Expense` (รายจ่าย - สีแดง)
- รองรับการกดปุ่ม `Enter` เพื่อกระโดดไปช่องถัดไปหรือบันทึกข้อมูลได้อย่างรวดเร็ว

### 3.4 การสลับ 2 มุมมองหลัก (Dual Sheet Views)
1. **📊 Dashboard Sheet:**
   - **Accounts Summary Card:** ตารางเปรียบเทียบเงินตั้งต้น, รวมรายรับ, รวมรายจ่าย และเงินคงเหลือสะสม
   - **Daily Breakdown List:** สรุปยอดรายรับ-รายจ่ายรวมในแต่ละวัน พร้อมระบบแบ่งหน้า (5 วันต่อ 1 หน้า)
   - **6-Month Comparison Bar Chart:** กราฟแท่งคู่เปรียบเทียบรายรับ (สีเขียว) vs รายจ่าย (สีแดง) ย้อนหลัง 6 เดือนล่าสุด พร้อมตัวเลือกสลับสกุลเงิน (Currency Selector) และตัวเลขยอดสุทธิรายเดือน
   - **Activity Stats:** สรุปจำนวนวันที่มีการบันทึกและจำนวนบันทึกทั้งหมด
2. **📄 Tracker Sheet:**
   - ตารางสเปรดชีตคอลัมน์ A ถึง G (Date, Time, Type, Amount, Currency, Description, Balance)
   - ระบบแบ่งหน้า (11 รายการต่อ 1 หน้า) เพื่อความสบายตา
   - ปุ่มลบรายการรายแถว และระบบคลิกแก้ไขรายการ (Edit Modal)

### 3.5 ระบบกรองตามเดือนและปี (Dynamic Month Filter)
- สแกนวันที่ในประวัติรายการทั้งหมดเพื่อสร้างรายการเดือนให้อัตโนมัติ (เช่น `แสดงทุกเดือน (All Time)`, `ตุลาคม 2026`)
- เมื่อเลือกเดือน ทั้งตาราง Tracker และกราฟใน Dashboard จะคำนวณและแสดงเฉพาะข้อมูลของเดือนนั้นทันที

### 3.6 รูปแบบสรุปข้อความสำหรับเกมเมอร์ (Gamer Clipboard Formatter)
- ปุ่ม **📋 Copy Clipboard** สำหรับคัดลอกสรุปรายวันในรูปแบบข้อความพร้อมส่งลงกลุ่มหรือแชต:
  ```text
  ###### 14/10/2026. เงินที่ได้จากเกม [รายรับ...]/ = รวมเงินรายวันทีได้จากเกม +[รวมรับ] THB = เสียเงินวันนี้ -[รวมจ่าย] THB = รวมทั้งวันวันนี้ [ยอดสุทธิ] THB = รวมเงินเก่าทั้งหมดใน บช [ยอดสะสม] THB
  ```

---

## ☁️ 4. สถาปัตยกรรมฐานข้อมูล Cloud Firestore

ระบบใช้ฐานข้อมูล **Google Cloud Firestore (Document Database)** ภายใต้คอลเลกชัน `trackers`:

```text
Firestore Database: (default)
└── collection: "trackers"
    ├── doc: "_accounts_list"
    │   └── fields:
    │       ├── updatedAt: 1791962988472 (timestamp)
    │       └── accounts: [
    │             { "id": "account_1", "name": "Bank1" },
    │             { "id": "account_2", "name": "Bank2" },
    │             { "id": "acc_1791963000000", "name": "SCB" }
    │           ]
    │
    ├── doc: "account_1"
    │   └── fields:
    │       ├── id: "account_1"
    │       ├── name: "Bank1"
    │       ├── updatedAt: 1791962988472
    │       ├── initialBalances: { "THB": 5000, "WIP": 200 }
    │       └── transactions: [
    │             {
    │               "id": "tx_1791960000000_abc",
    │               "date": "2026-10-14",
    │               "timestamp": 1791960000000,
    │               "type": "income",
    │               "currency": "THB",
    │               "amount": 1500,
    │               "tag": "เงินเดือน",
    │               "runningBalance": 6500
    │             }
    │           ]
    │
    └── doc: "account_2"
        └── ...
```

### กฎความปลอดภัยของ Firestore (Security Rules)
ตั้งค่าในแท็บ Rules บน Firebase Console เพื่อให้ใช้งานได้ถาวรโดยไม่มีวันหมดอายุ:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 📁 5. โครงสร้างไฟล์ในโปรเจกต์ (File Structure)

```text
MyDailyTracker/
├── index.html            # Entry point ตัวนำทางอัตโนมัติไปยัง money.html
├── money.html            # หน้าจอเว็บแอปพลิเคชันหลัก (Sidebar, Topbar, Modals, Dual Sheets)
├── script.js             # Logic กลาง: Firebase Firestore Sync, Dynamic Accounts, Calculations, PWA
├── style.css             # การตั้งค่าพื้นฐานและตัวแปรหลัก
├── favicon.svg           # ไอคอน Favicon รูปกราฟสเปรดชีต
├── manifest.json         # PWA Manifest (ไอคอน, ธีมสี, และคุณสมบัติการติดตั้งแอป)
├── sw.js                 # Service Worker (Cache Versioning v10 & Offline Cache Management)
├── GEMINI.md             # กฎและข้อบังคับในการพัฒนาโปรเจกต์ (Auto Git Push, Backend-First)
├── README.md             # สรุปแนะนำโปรเจกต์ฉบับย่อบน GitHub
├── PROJECT_OVERVIEW.md   # เอกสารเชิงลึกฉบับสมบูรณ์ (ไฟล์นี้)
└── css/
    └── components.css    # ระบบจัดสไตล์ UI: Sidebar, Bank Items, Cards, Tables, Modals, Toast
```

---

## 🔑 6. โครงสร้างคีย์ข้อมูลใน LocalStorage (Offline Cache)

| Key | Type | คำอธิบาย |
|---|---|---|
| `tracker_accounts_list` | `Array<Object>` | แคชรายชื่อบัญชีทั้งหมด e.g. `[{"id":"account_1","name":"Bank1"},...]` |
| `tracker_currentAccountId` | `String` | ID ของบัญชีธนาคารที่กำลังเปิดใช้งานอยู่ในปัจจุบัน |
| `tracker_{accountId}_initialBalances` | `Object` | เงินตั้งต้นของบัญชีนั้นๆ e.g. `{"THB": 10000}` |
| `tracker_{accountId}_transactions` | `Array<Object>` | อาร์เรย์ประวัติรายการของบัญชีนั้นๆ |
| `tracker_{accountId}_lastLoginDate` | `String` | วันที่เข้าใช้งานล่าสุดของบัญชีนั้นๆ e.g. `"2026-10-14"` |
| `tracker_{accountId}_deletedIds` | `Array<String>` | รายการ ID ที่ถูกลบ เพื่อตรวจสอบความสอดคล้อง |

---

## 🚀 7. คู่มือการติดตั้งใช้งาน (User Guide & PWA Installation)

### การเข้าใช้งานออนไลน์:
- เข้าใช้งานได้ทันทีที่: **[https://hallhcl.github.io/MyDailyTracker/](https://hallhcl.github.io/MyDailyTracker/)**

### การติดตั้งเป็นแอป (PWA):
1. **บนสมาร์ตโฟน (Android / Chrome):** แตะที่เมนู 3 จุดมุมขวาบน > เลือก **"ติดตั้งแอป" (Install App)** หรือ **"เพิ่มลงในหน้าจอหลัก" (Add to Home screen)**
2. **บน iPhone / iPad (Safari):** แตะปุ่มแชร์ (Share) > เลือก **"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)**
3. **บนเดสก์ท็อป (Chrome / Edge):** คลิกไอคอนรูปคอมพิวเตอร์/หน้าจอที่แถบ Address bar มุมขวาบน > เลือก **"ติดตั้ง MyDailyTracker" (Install)**

---

*เอกสารได้รับการปรับปรุงล่าสุด: ตุลาคม 2026*  
*สร้างสรรค์และพัฒนาโดยทีม Antigravity AI* 🚀
