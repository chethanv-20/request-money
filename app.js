const express = require('express');
const path = require('path');
const QRCode = require('qrcode');

const app = express();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to display the main page
app.get('/', (req, res) => {
    res.render('index', { paymentLink: '', qrCode: '', amount: '', upiId: '' });
});

// Route to handle form submission and generate the UPI payment link and QR code
app.post('/generate-link', async (req, res) => {
    const upiId = req.body.upiId;
    const amount = req.body.amount || 0; // Default to 0 if no amount is provided

    if (!upiId) {
        return res.render('index', {
            paymentLink: 'Please enter a valid UPI ID.',
            qrCode: '',
            amount: '',
            upiId: ''
        });
    }

    // Create the UPI deep link
    const paymentLink = `upi://pay?pa=${upiId}&pn=PayeeName&am=${amount}&cu=INR&tn=Payment+via+UPI`;

    // Generate QR code for the UPI deep link
    try {
        const qrCode = await QRCode.toDataURL(paymentLink);
        res.render('index', { qrCode, paymentLink, amount, upiId });
    } catch (err) {
        console.error('Error generating QR code:', err);
        res.render('index', {
            qrCode: 'Error generating QR code.',
            paymentLink: '',
            amount: '',
            upiId: ''
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
