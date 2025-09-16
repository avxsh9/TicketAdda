// app.js
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

// Configure transporter (example: Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ticketadda.in@gmail.com',
    pass: 'ticketadda.in69' // create App Password if using Google (recommended)
  }
});

// endpoint that the frontend fallback posts to
app.post('/send-message', async (req, res) => {
  try {
    const { from_name, reply_to, subject, message } = req.body;
    if (!from_name || !reply_to || !subject || !message) {
      return res.status(400).send('Missing required fields');
    }

    const mailOptions = {
      from: `"${from_name}" <${reply_to}>`,
      to: 'ticketadda.in@gmail.com', // final destination
      subject: `[Help Center] ${subject}`,
      text: `From: ${from_name} <${reply_to}>\n\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Mail error', err);
    res.status(500).send('Failed to send email');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on', PORT));
