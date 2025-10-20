const express = require('express');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /api/send-email
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, message } = req.body || {};
    if (!name || !message) return res.status(400).json({ error: 'Missing fields: name and message are required' });

    const results = { whatsapp: null };

    // Require Twilio for WhatsApp sending
    if (!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM)) {
      return res.status(500).json({ error: 'WhatsApp sending not configured (TWILIO_* env vars missing).' });
    }

    try {
      const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const body = `New contact from ${name}:\n\n${message}`;
      const to = `whatsapp:+5585989045569`;
      const from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
      const msg = await twilio.messages.create({ body, to, from });
      results.whatsapp = { ok: true, sid: msg.sid };
    } catch (twErr) {
      console.error('whatsapp send error', twErr);
      results.whatsapp = { ok: false, error: String(twErr) };
      return res.status(500).json({ error: 'Failed to send WhatsApp message', details: results });
    }

    return res.json({ ok: true, results });
  } catch (err) {
    console.error('send-email error', err);
    return res.status(500).json({ error: 'Failed to process request' });
  }
});

app.listen(PORT, () => console.log(`Email API running on port ${PORT}`));
