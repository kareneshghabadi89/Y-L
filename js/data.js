/* =====================================================================
   این تنها فایلی است که برای عوض کردن نقاشی‌ها و موسیقی باید ویرایش کنی.
   راهنمای کامل در README.md
   ===================================================================== */

/* ---------- نقاشی‌ها ----------
   file        : اسم فایل عکس داخل پوشه assets/images  (حروف بزرگ و کوچک مهم است)
   title       : عنوان (اختیاری - اگر نمی‌خوای، بنویس  title: ""  )
   description : توضیح کوتاه (اختیاری - اگر نمی‌خوای، بنویس  description: ""  )
   برای اضافه کردن نقاشی جدید، یک خط مثل خط‌های پایین کپی کن و اسم فایل را عوض کن.
   حواست باشد آخر هر خط (به جز آخرین خط) کاما باشد. */
window.ARTWORKS = [
  { file: "painting-01.jpg", title: "Painting #01", description: "این یکی واقعاً یکی از موردعلاقه‌های منه." },
  { file: "painting-02.jpg", title: "Painting #02", description: "" },
  { file: "painting-03.jpg", title: "Painting #03", description: "" },
  { file: "painting-04.jpg", title: "Painting #04", description: "" },
  { file: "painting-05.jpg", title: "Painting #05", description: "" },
  { file: "painting-06.jpg", title: "Painting #06", description: "" }
];

/* ---------- موسیقی ----------
   file     : مسیر فایل mp3 (فایل را در پوشه assets/music بگذار)
   title    : اسم آهنگ که در پخش‌کننده نشان داده می‌شود
   autoplay : اگر true باشد سایت تلاش می‌کند خودکار پخش کند؛
              اگر مرورگر اجازه ندهد، دکمه پخش نشان داده می‌شود و کاربر خودش می‌زند.
   volume   : صدای اولیه بین 0 تا 1
   اگر فایل mp3 وجود نداشته باشد، پخش‌کننده خودش پنهان می‌شود و سایت سالم می‌ماند. */
window.MUSIC = {
  file: "assets/music/background.mp3",
  title: "Background music",
  autoplay: true,
  volume: 0.6
};
