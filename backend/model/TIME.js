import mongoose from "mongoose";

const timeSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^(0[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/.test(value);
            },
            message: props => `${props.value} is not a valid time format! Use HH:MMAM or HH:MMPM (e.g., 08:00AM, 10:00AM, 04:00PM).`
        }
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    }
});

export default mongoose.model('time', timeSchema);
