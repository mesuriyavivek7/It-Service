import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fromType: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'employee'] // adjust as per your roles
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toType: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'employee']
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      "issue_created",
      "issue_cancel",
      "assign_issue",
      "start_working_issue",
      "complete_issue",
      "create_leave",
      "approve_leave",
      "reject_leave"
    ],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

export default mongoose.model('notification', notificationSchema);
