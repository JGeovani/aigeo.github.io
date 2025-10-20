# Geovani dos Santos — Portfolio

This repository contains a static portfolio site for Geovani dos Santos. It uses Tailwind CSS for styling and a small vanilla JS file for interactivity.

Quick start

1. Install dev dependencies (requires Node.js >= 16):

```powershell
cd website; npm install
```

2. Build CSS once:

```powershell
npm run build:css
```

3. Serve locally:

```powershell
npm start
# then open http://localhost:5000
```

Notes

- The project extracts CSS and JS into `css/` and `js/` folders.
- For quick testing you can also open `index.html` directly in a browser, but some features (smooth scrolling) work best when served.

Suggested next steps

- Add a small Tailwind config file to customize the theme and enable JIT build.
- Add accessibility and SEO meta tags.
- Add form submission backend or a serverless form provider integration.

Email server (local)

This project includes a minimal Express + Nodemailer server at `server.js` that exposes `POST /api/send-email` and forwards contact form submissions to an email address.

Setup steps (local):

1. Install dependencies (Node.js and npm required):

```powershell
cd website
npm install
```

2. Configure SMTP credentials via environment variables. You can copy `.env.example` and set values. Required variables:

- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE (true/false)
- SMTP_USER
- SMTP_PASS
- (optional) CONTACT_RECEIVER — defaults to `geovanis.business@gmail.com`

3. Start the email API server:

```powershell
node server.js
```

4. The client form is wired to POST to `/api/send-email` (same origin). If you run the API on another host/port, update `js/main.js` fetch URL or run a reverse proxy.

Note: The contact form now only collects Name and Message (no Email). The server expects `name` and `message` in the JSON body.

WhatsApp sending is the primary delivery method and must be configured via Twilio env vars. If Twilio variables aren't set the API will return an error.

Security notes

- Do not commit SMTP credentials to source control. Use environment variables or a secrets manager for production.
- Consider rate-limiting and CAPTCHA for public-facing forms to prevent spam.

Troubleshooting contact form errors

If you see "Sorry, there was a problem sending your message. Please try again later." in the UI, follow these steps:

1. Ensure the email API server is running. The server requires dependencies installed via `npm install`.

```powershell
cd website
npm install
node server.js
```

2. If `node server.js` fails with "Cannot find module 'express'", it means `node_modules` are missing — run `npm install` as above.

3. Check server logs in the terminal where you started `node server.js`. Nodemailer errors (authentication, connection) will be printed there.

4. Verify SMTP environment variables are set correctly (see `.env.example`). You can test connectivity by using `telnet` to the SMTP host/port or using a small Node script.

5. For local testing without SMTP, you can use a service like Mailtrap (safe test inbox) and point SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS to Mailtrap credentials.

6. If the API runs on a different host/port than the static site, either run both on the same origin or update `js/main.js` fetch URL to point at the correct API URL and ensure CORS is enabled.

WhatsApp notifications (optional)

This server can also send WhatsApp messages via Twilio when configured. To enable:

1. Create a Twilio account and enable the WhatsApp sandbox or register a WhatsApp sender number.
2. Set these environment variables (see `.env.example`):

 - TWILIO_ACCOUNT_SID
 - TWILIO_AUTH_TOKEN
 - TWILIO_WHATSAPP_FROM (format: `whatsapp:+1415XXXXXXX`)

When enabled, the server will attempt to send a WhatsApp message to the hard-coded recipient `+5585989045569` and will also send email if SMTP is configured. Check the server logs for Twilio send status and troubleshooting details.

Favicons generation

If you'd like crisp favicons for multiple platforms, there's a small generator that uses `sharp` and `png-to-ico` to produce PNGs and a multi-resolution `favicon.ico` from `assets/avatar.png`.

1. Install dev dependencies:

```powershell
cd website
npm install
```

2. Generate favicons:

```powershell
npm run gen:favicons
```

The generated files will be placed into `assets/favicons/` and the `site.webmanifest` references the 192/512 icons for PWA usage.

Publishing to GitHub Pages

This repository includes a GitHub Actions workflow that builds Tailwind CSS and deploys the `website/` folder to the `gh-pages` branch.

1. Create a GitHub repository and push your code (if you haven't already):

```powershell
git init
git add .
git commit -m "Initial website"
git remote add origin git@github.com:<your-username>/<repo>.git
git push -u origin main
```

2. The workflow triggers on pushes to `main` (or `master`). It will run, build CSS, and push the `website/` folder to the `gh-pages` branch automatically.

3. In your repository Settings → Pages, select the `gh-pages` branch as the source (if not automatically configured). The site will be available at https://<your-username>.github.io/<repo>/ within a few minutes after the workflow completes.

Notes:
- If your repo uses a different default branch, change the workflow `on.push.branches` accordingly.
 - If your repo uses a different default branch, change the workflow `on.push.branches` accordingly.
 - The Actions workflow is configured to run `npm install` by default so committing a `package-lock.json` is optional. If you prefer reproducible installs you can switch the workflow to `npm ci` and commit `package-lock.json`.


