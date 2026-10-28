# فونت‌های لوکال

## مراحل اضافه کردن فونت:

### 1. فایل‌های فونت رو اینجا بذارید:

- `your-font.woff2` (بهترین فرمت)
- `your-font.woff` (fallback)
- `your-font.ttf` (fallback)

### 2. فونت در `app/app.css` تعریف شده:

```css
@font-face {
  font-family: "YourCustomFont";
  src:
    url("/fonts/your-font.woff2") format("woff2"),
    url("/fonts/your-font.woff") format("woff"),
    url("/fonts/your-font.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### 3. در Tailwind config اضافه شده:

```css
--font-sans: "YourCustomFont", "Vazirmatn", ...;
```

## استفاده:

فونت خودکار در تمام سایت اعمال میشه یا می‌تونید با کلاس‌های Tailwind استفاده کنید:

- `font-sans` (پیش‌فرض)
- یا custom class تعریف کنید
