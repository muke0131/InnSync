const mongoose=require("mongoose");
const Room=require("../models/roomsModel")

exports.createRoom=async (req,res)=>{
    try{
        const {roomNumber,category,capacity,pricePerNight,amenities,status}=req.body;
        if(!roomNumber || !category || !capacity || !pricePerNight || !amenities || !status){
            return res.status(404).json({
                success:false,
                message:"All fields are required"
            })
        }

        const roomExist=await Room.findOne({roomNumber:roomNumber});

        if(roomExist){
            return res.status(402).json({
                success:false,
                message:"Room with same number already exists"
            })
        }

        const newRoom=await Room.create({
            roomNumber,
            category,
            capacity,
            pricePerNight,
            amenities,
            status
        })

        return res.status(200).json({
            success:true,
            message:"New room added successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
          });
    }
}

//Get all rooms

exports.getAllRooms = async (req, res) => {
    try {
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Filtering
      const filter = {};
      if (req.query.type) filter.type = req.query.type;
      if (req.query.status) filter.status = req.query.status;
      if (req.query.minPrice) filter.pricePerNight = { $gte: parseInt(req.query.minPrice) };
      if (req.query.maxPrice) {
        filter.pricePerNight = { ...filter.pricePerNight, $lte: parseInt(req.query.maxPrice) };
      }
  
      // Sorting
      const sort = {};
      if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
      }
  
      // Fetch rooms
      const rooms = await Room.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
  
      // Get total count for pagination
      const total = await Room.countDocuments(filter);
  
      // Send response
      res.status(200).json({
        status: 'success',
        data: {
          rooms,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalResults: total,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while fetching rooms',
        error: error.message,
      });
    }
  };


  exports.getAllRooms = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const filter = {};
      if (req.query.type) filter.type = req.query.type;
      if (req.query.status) filter.status = req.query.status;
      if (req.query.minPrice) filter.pricePerNight = { $gte: parseInt(req.query.minPrice) };
      if (req.query.maxPrice) {
        filter.pricePerNight = { ...filter.pricePerNight, $lte: parseInt(req.query.maxPrice) };
      }
  
      const sort = {};
      if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
      }
  
      const rooms = await Room.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
  
      const total = await Room.countDocuments(filter);
  
      res.json({
        rooms,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  exports.getRoomById = async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  exports.updateRoom = async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
  
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      res.json({
        message: 'Room updated successfully',
        room
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  exports.deleteRoom = async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

  exports.getAvailableRooms = async (req, res) => {
    try {
      const { startDate, endDate, type } = req.query;
  
      const filter = {
        status: 'available'
      };
  
      if (type) filter.type = type;
  
      
      const availableRooms = await Room.find(filter);
  
      res.json(availableRooms);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };