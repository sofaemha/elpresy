
Kamu adalah software engineer yang bekerja pada project ELPRESY — aplikasi Next.js 16 berbasis 
machine learning untuk prediksi konsumsi daya listrik AC (skripsi S1 Informatika).

## Konteks Codebase yang Harus Dipahami

### Stack
- Next.js 16 App Router, TypeScript strict, Tailwind CSS v4
- shadcn/ui + Base UI, Drizzle ORM + PostgreSQL
- Auth: better-auth (`@/lib/auth`)
- next-intl untuk semua string user-facing
- Ikuti DESIGN.md secara ketat (dark-mode eksklusif, gold #C9A84C, bg #09090B, card #111113, border rgba(201,168,76,0.15))

### Skema Database (predictions table — `src/lib/db/schema.ts`)
```ts
predictions: {
  id:               uuid          // PK
  userId:           text          // FK → users.id
  amperePerCycle:   real          // Input: arus listrik (A)
  dailyUsageHours:  real          // Input: jam penggunaan harian
  predictionPeriod: integer       // Jumlah hari prediksi
  resultLower:      real          // Batas bawah prediksi (Wh)
  resultUpper:      real          // Batas atas prediksi (Wh)
  totalAmpere:      real          // Total akumulasi ampere seluruh periode
  chartData:        jsonb         // Array<{ day: number; ampere: number }>
  createdAt:        timestamp
}
```

### Server Actions yang Sudah Ada (`src/app/actions/predictions.ts`)
- `getPredictions()` → returns `Prediction[]` milik user yang login, diurutkan `desc(createdAt)`
- `savePrediction(data)` → insert prediction baru

### Evaluate Page (yang sudah dibuat sebelumnya)
- Berada di `src/app/[locale]/(app)/evaluate/page.tsx`
- Menampilkan Metrik Evaluasi Model (MSE, MAE, RMSE, R²)
- Perlu ditambahkan section baru: "Active Prediction Selector"

---

## Tugas

Buat fitur **Active Prediction Selector** yang menjadi bagian dari halaman evaluate.
Fitur ini memungkinkan user memilih satu prediksi dari riwayat mereka sebagai 
"active prediction" yang akan digunakan sebagai basis data aktual (actual values) 
pada perhitungan metrik evaluasi model.

---

## Spesifikasi Fitur Lengkap

### 1. Komponen: Trigger Section — `src/components/dashboard/section/evaluate/active-prediction.tsx`

Buat komponen client (`"use client"`) bernama `ActivePrediction` dengan props:
```ts
interface ActivePredictionProps {
  predictions: Prediction[];  // List dari getPredictions()
  activePredictionId: string | null;
  onSelect: (id: string | null) => void;
  // Computed stats dari prediksi yang aktif (null jika belum ada yang dipilih)
  activeStats: ActivePredictionStats | null;
}

interface ActivePredictionStats {
  totalAmpere: number;      // totalAmpere dari record prediksi
  avgAmpere: number;        // totalAmpere / predictionPeriod
  rangeMin: number;         // resultLower (dari DB)
  rangeMax: number;         // resultUpper (dari DB)
  executedAt: string;       // createdAt diformat: "DD MMM YYYY, HH:mm"
  predictionPeriod: number; // jumlah hari
  amperePerCycle: number;   // input A
  dailyUsageHours: number;  // input jam
}
```

**Layout komponen ini (Trigger Section):**
Sebuah card dengan:
- Header: judul "Active Prediction" + badge yang menunjukkan status 
  (jika belum dipilih: badge abu "Not Selected", jika dipilih: badge hijau "Active")
- Tombol "Select Prediction" / "Change Prediction" yang membuka dialog
- Jika `activeStats` tersedia, tampilkan 4 stat cards dalam grid 2x2:

  | Card | Nilai |
  |---|---|
  | Total Ampere | `activeStats.totalAmpere` A dengan 3 desimal |
  | Avg Ampere/Day | `activeStats.avgAmpere` A dengan 3 desimal |
  | Range | `activeStats.rangeMin` – `activeStats.rangeMax` A |
  | Executed | `activeStats.executedAt` (tanggal + waktu) |

  Di bawah grid 2x2, tampilkan 1 baris info sekunder kecil:
  `{predictionPeriod} days · {amperePerCycle}A/cycle · {dailyUsageHours}h/day`

- Jika belum ada prediksi sama sekali (predictions.length === 0), tampilkan empty state:
  ikon Zap, teks "No predictions yet", link ke halaman predict

---

### 2. Komponen: Dialog/Modal — `src/components/dashboard/section/evaluate/prediction-selector-dialog.tsx`

Buat komponen client menggunakan Dialog dari shadcn/ui dengan:

**Header Dialog:**
- Judul: "Select Active Prediction"
- Deskripsi: "Choose one prediction to use as the basis for model evaluation."
- Input search untuk memfilter list berdasarkan tanggal atau nilai ampere

**List Prediksi (table-like long card list):**
Setiap item adalah sebuah card horizontal memanjang dengan:
- **Tidak ada gap antar item** — items langsung bersebelahan (stacked list, seperti tabel)
- Border pemisah antar item: `border-b border-border` (kecuali item terakhir)
- Item pertama: `rounded-t-lg`, item terakhir: `rounded-b-lg` (border-radius hanya di ujung)
- Seluruh list dibungkus container dengan `border border-border rounded-lg overflow-hidden`

**Struktur setiap item card:**
┌──────────────────────────────────────────────────────────────────────────┐
│ [checkbox/indicator] │ Tanggal & Waktu │ TotalA │ AvgA │ Range │ Days│
└──────────────────────────────────────────────────────────────────────────┘

Detail kolom per item:
- **Kiri (checkmark/indicator):** 
  - Jika item ini adalah `activePredictionId`: tampilkan circle hijau dengan checkmark (✓),
    background card menjadi `bg-[#0d2218]` (hijau gelap subtle) dan left border 2px `border-l-2 border-[#22c55e]`
  - Jika tidak aktif: tampilkan circle kosong abu-abu
- **Tanggal:** `createdAt` format "DD MMM YYYY" (baris 1) + "HH:mm" (baris 2, muted)
- **Total Ampere:** nilai `totalAmpere` + label "Total A" kecil di bawahnya
- **Avg/Day:** `totalAmpere / predictionPeriod` + label "Avg/Day" kecil
- **Range:** `resultLower` – `resultUpper` + label "Range (A)" kecil
- **Period:** `predictionPeriod` + "days" + label "Period" kecil

**Interaksi:**
- Click item → set sebagai active (highlight hijau muncul)
- Click lagi pada item yang sudah aktif → deselect (kembali ke not selected)
- Tombol "Confirm" di footer dialog → tutup dialog dan panggil `onSelect`
- Tombol "Clear Selection" (jika ada yang dipilih) → reset ke null
- Scroll jika list panjang: dialog content max-height: 60dvh, overflow-y: auto

**Styling khusus item yang aktif/selected:**
- Background: `bg-[#0d2218]` (gelap kehijauan, bukan neon)
- Left border: `border-l-2 border-[#22c55e]` (green-500)
- Text warna tetap normal (`--color-text`) kecuali badge/indicator
- Transisi smooth: `transition-all duration-200`

**Empty state dalam dialog** (jika tidak ada prediksi):
- Teks "No predictions available. Run a prediction first."

---

### 3. Server Action Baru — tambahkan ke `src/app/actions/predictions.ts`

```ts
export async function getPredictionById(id: string): Promise<Prediction | null>
```
Ambil satu prediksi berdasarkan id, verifikasi milik user yang login.

---

### 4. Update Halaman Evaluate — `src/app/[locale]/(app)/evaluate/page.tsx`

Halaman evaluate saat ini adalah server component. 
Perlu di-refactor menjadi `"use client"` agar dapat mengelola state `activePredictionId`.

**Tambahkan:**
1. State: `const [activePredictionId, setActivePredictionId] = useState<string | null>(null)`
2. Load `predictions` via `getPredictions()` di awal (gunakan `useEffect` karena jadi client component)
3. Hitung `activeStats` dari prediksi yang dipilih:
   ```ts
   const activeStats = useMemo(() => {
     if (!activePredictionId || !predictions.length) return null;
     const p = predictions.find(pred => pred.id === activePredictionId);
     if (!p) return null;
     return {
       totalAmpere: p.totalAmpere,
       avgAmpere: parseFloat((p.totalAmpere / p.predictionPeriod).toFixed(3)),
       rangeMin: p.resultLower,
       rangeMax: p.resultUpper,
       executedAt: new Date(p.createdAt).toLocaleString("id-ID", {
         day: "2-digit", month: "short", year: "numeric",
         hour: "2-digit", minute: "2-digit"
       }),
       predictionPeriod: p.predictionPeriod,
       amperePerCycle: p.amperePerCycle,
       dailyUsageHours: p.dailyUsageHours,
     };
   }, [activePredictionId, predictions]);
   ```
4. Render komponen `<ActivePrediction>` di atas section metrik evaluasi (MSE, MAE, dsb.)
5. Jika ada `activePredictionId`, tampilkan section evaluasi metrik.
   Jika tidak ada, tampilkan placeholder/callout:
   "Select an active prediction above to compute evaluation metrics."

---

### 5. Translation Keys — tambahkan ke `messages/id.json` dan `messages/en.json`

Namespace `"evaluate"` (yang sudah ada), tambahkan keys baru:

**English (`en.json`):**
```json
{
  "evaluate": {
    "...keys yang sudah ada...",
    "activePrediction": {
      "title": "Active Prediction",
      "description": "Select a prediction to use as actual data for model evaluation.",
      "statusActive": "Active",
      "statusNotSelected": "Not Selected",
      "btnSelect": "Select Prediction",
      "btnChange": "Change Prediction",
      "emptyTitle": "No predictions yet",
      "emptyDescription": "Run a prediction first to use it for evaluation.",
      "emptyAction": "Go to Predict",
      "statsTotal": "Total Ampere",
      "statsAvg": "Avg Ampere/Day",
      "statsRange": "Range",
      "statsExecuted": "Executed",
      "statsMeta": "{period} days · {ampere}A/cycle · {hours}h/day"
    },
    "selector": {
      "title": "Select Active Prediction",
      "description": "Choose one prediction to use as the basis for model evaluation.",
      "searchPlaceholder": "Search by date or value...",
      "colDate": "Date",
      "colTotal": "Total A",
      "colAvg": "Avg/Day",
      "colRange": "Range (A)",
      "colPeriod": "Period",
      "btnConfirm": "Confirm Selection",
      "btnClear": "Clear Selection",
      "emptySearch": "No predictions match your search.",
      "emptyList": "No predictions available. Run a prediction first."
    },
    "noActiveCallout": "Select an active prediction above to compute evaluation metrics."
  }
}
```

---

## Aturan Wajib (Tidak Boleh Dilanggar)

1. **Output kode lengkap, tidak dipotong** — dilarang menulis `// rest of code here` atau sejenisnya
2. **Setiap file diawali komentar path:** `// filepath: src/...`
3. **TypeScript strict** — dilarang menggunakan `any`. Gunakan tipe dari `@/lib/db/schema.ts` (`Prediction`, `NewPrediction`)
4. **Tailwind CSS v4 utilities only** — tidak ada inline styles kecuali nilai yang benar-benar tidak tersedia di Tailwind (contoh: warna custom spesifik seperti `#0d2218`)
5. **Ikuti DESIGN.md:**
   - Dark mode eksklusif
   - Gold accent `#C9A84C` hanya untuk emphasis, bukan flood-fill
   - Card background `#111113`, border `rgba(201,168,76,0.15)`
   - Font: Space Grotesk untuk angka/heading besar, DM Sans untuk label/body
6. **Dialog menggunakan shadcn/ui Dialog** (sudah tersedia di project — jangan reinvent)
7. **Semua string user-facing pakai next-intl** (`useTranslations("evaluate")`)
8. **Animasi harus punya `prefers-reduced-motion` override**
9. **Responsive** dari 375px hingga 1440px+ (mobile-first)
10. **Semantic HTML** (`<section>`, `<ul>`, `<li>` untuk list prediksi, dsb.)
11. **Jangan modifikasi skema DB** — gunakan field yang sudah ada di `predictions` table
12. Setelah selesai, tambahkan section `## What was generated` yang merangkum semua file yang dibuat/dimodifikasi

## Urutan Output File

Hasilkan file dalam urutan ini:
1. `src/app/actions/predictions.ts` (tambahkan `getPredictionById`)
2. `src/components/dashboard/section/evaluate/active-prediction.tsx`
3. `src/components/dashboard/section/evaluate/prediction-selector-dialog.tsx`
4. `src/app/[locale]/(app)/evaluate/page.tsx` (update/refactor)
5. `messages/en.json` (tambahkan keys baru ke namespace evaluate)
6. `messages/id.json` (terjemahan Indonesia)