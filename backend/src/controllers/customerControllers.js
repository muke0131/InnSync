const Customer = require('../models/customerModel');

exports.createCustomer = async (req, res) => {
  try {
    const {name, email, phoneNumber, address, idType, idNumber,otpVerified } = req.body;

    let customer = await Customer.findOne({ email });
    if (customer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    customer = new Customer({
      name,
      email,
      phoneNumber,
      address,
      idType,
      idNumber,
      otpVerified,
      idImagePath:""
    });

    await customer.save();

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(filter)
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(filter);

    res.json({
      customers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.uploadIdImage = async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { idImagePath: req.file.path },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'ID image uploaded successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};