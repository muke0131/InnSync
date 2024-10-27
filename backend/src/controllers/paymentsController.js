
const Payment = require('../models/paymentModel');
const Booking = require('../models/bookingModel');
const Invoice = require('../models/invoiceModel');

exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this booking' });
    }

    const payment = new Payment({
      bookingId,
      amount,
      paymentMethod,
      status: 'completed',
      transactionId: generateTransactionId(),
      paidAt:Date.now()
    });

    await payment.save();

    booking.isPaid = true;
    await booking.save();

    await Invoice.findOneAndUpdate({ bookingId }, { status: 'paid' });

    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;

    const payments = await Payment.find(filter)
      .populate('bookingId')
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(filter);

    res.json({
      payments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('bookingId');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      message: 'Payment updated successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment has already been refunded' });
    }


    payment.status = 'refunded';
    await payment.save();

    await Booking.findByIdAndUpdate(payment.bookingId, { isPaid: false });
    await Invoice.findOneAndUpdate({ bookingId: payment.bookingId }, { status: 'refunded' });

    res.json({
      message: 'Payment refunded successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPaymentsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payments = await Payment.find({ bookingId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

function generateTransactionId() {
  return 'TRX' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}