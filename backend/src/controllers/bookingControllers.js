
const Booking = require('../models/bookingModel');
const Room = require('../models/roomsModel');
const Invoice = require('../models/invoiceModel'); 
const PDFDocument = require('pdfkit');
const fs = require('fs'); 
const path = require('path'); 

exports.createBooking = async (req, res) => {
  try {
    const { roomId, customerId, checkInDate, checkOutDate, numberOfguests } = req.body;

    const room = await Room.findById(roomId);
    if (!room || room.status !== 'available') {
      return res.status(400).json({ message: 'Room not available' });
    }

    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    const booking = new Booking({
      roomId,
      customerId,
      checkInDate,
      checkOutDate,
      numberOfguests,
      totalPrice,
      status: 'confirmed'
    });

    await booking.save();

    room.status = 'ocuppied';
    await room.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
    .populate('customerId')
      .populate('roomId')
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('roomId')
      .populate('customerId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.checkInCustomer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'checked-in';
    await booking.save();

    await Room.findByIdAndUpdate(booking.roomId, { status: 'occupied' });

    res.json({
      message: 'Customer checked in successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.checkOutCustomer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'customerId',
        select: 'name email phoneNumber address idType idNumber idImagePath'
      })
      .populate('roomId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'checked-out';
    await booking.save();
    await Room.findByIdAndUpdate(booking.roomId._id, { status: 'available' });

    const { status, issueDate, dueDate, paymentMethod, notes } = req.body;

    const invoice = new Invoice({
      bookingId: booking._id,
      customerId: booking.customerId._id,
      totalAmount: booking.totalPrice,
      status,
      issueDate,
      dueDate,
      paymentMethod,
      notes,
    });
    await invoice.save();

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '..', 'invoices', `invoice-${booking._id}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${invoice._id}`);
    doc.text(`Booking ID: ${booking._id}`);
    doc.text(`Customer Name: ${booking.customerId.name}`);
    doc.text(`Room Number: ${booking.roomId.roomNumber}`);
    doc.text(`Check-in Date: ${booking.checkInDate.toDateString()}`);
    doc.text(`Check-out Date: ${booking.checkOutDate.toDateString()}`);
    doc.text(`Total Amount: $${booking.totalPrice}`);
    doc.text(`Payment Method: ${paymentMethod}`);
    doc.text(`Notes: ${notes}`);
    
    doc.addPage();
    
    if (booking.customerId.idImagePath) {
      const idImagePath = path.join(__dirname, '..', booking.customerId.idImagePath);
      
      if (fs.existsSync(idImagePath)) {
        doc.fontSize(14).text('Customer ID Image:', { align: 'center' });
        doc.image(idImagePath, {
          fit: [500, 500], 
          align: 'center',
          valign: 'center',
        });
      } else {
        doc.fontSize(14).text('ID Image not found.', { align: 'center', color: 'red' });
      }
    } else {
      doc.fontSize(14).text('No ID image available for this customer.', { align: 'center', color: 'gray' });
    }

    doc.end();

    writeStream.on('finish', () => {
      res.json({
        message: 'Customer checked out successfully, invoice generated',
        booking,
        invoice,
        pdfUrl: `/download/invoice-${booking._id}.pdf`
      });
    });

  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};