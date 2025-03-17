import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  device_type: {
    type: String,
    enum: ['Laptop', 'Desktop', 'All in one PC'],
    required: [true, "Device type is required"]
  },
  brand: {
    type: String,
    enum: ['HP', 'Dell', 'Lenovo', 'Acer', 'Asus', 'MSI', 'Microsoft', 'Samsung', 'Sony', 'Toshiba', 'LG', 'iBall', 'Fujitsu', 'Panasonic', 'Avita', 'Vaio', 'HCL', 'RDP', 'Nokia', 'Assembled', 'Other'],
    required: [true, "Brand is required"]
  },
  model_number: {
    type: String,
    required: [true, "Model number is required"],
    trim: true,
    minlength: [2, "Model number must be at least 2 characters long"],
    maxlength: [50, "Model number must not exceed 50 characters"]
  },
  serial_number: {
    type: String,
    required: [true, "Serial number is required"],
    trim: true,
    match: [/^[a-zA-Z0-9-]+$/, "Serial number should contain only letters, numbers, and hyphens"],
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, "Added by (user ID) is required"]
  }
}, { timestamps: true });

export default mongoose.model('device', deviceSchema);
