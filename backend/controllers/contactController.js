import { body, validationResult } from 'express-validator';

const SUBJECTS = ['General Inquiry', 'Technical Support', 'Billing Question', 'Author Services'];

export const validateContactMessage = [
  body('firstName').trim().isLength({ min: 1, max: 80 }).withMessage('First name is required'),
  body('lastName').optional({ checkFalsy: true }).trim().isLength({ max: 80 }).withMessage('Last name is too long'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email address is required'),
  body('subject').isIn(SUBJECTS).withMessage('Please select a valid subject'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5,000 characters'),
];

const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));

export const sendContactMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { firstName, lastName = '', email, subject, message } = req.body;
  const recipient = process.env.CONTACT_RECIPIENT;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!recipient || !apiKey || !from) {
    return res.status(503).json({
      message: 'Contact email is not configured yet. Please try again later.',
    });
  }

  try {
    const senderName = `${firstName} ${lastName}`.trim();
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `[ReadSphere] ${subject} — ${senderName}`,
        text: `From: ${senderName} <${email}>\nSubject: ${subject}\n\n${message}`,
        html: `<h2>New ReadSphere contact message</h2><p><strong>From:</strong> ${escapeHtml(senderName)} &lt;${escapeHtml(email)}&gt;</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!response.ok) {
      const details = await response.json().catch(() => ({}));
      console.error('Contact email delivery failed:', details);
      return res.status(502).json({ message: 'We could not send your message. Please try again later.' });
    }

    return res.status(202).json({ message: 'Message sent successfully.' });
  } catch (error) {
    return next(error);
  }
};
