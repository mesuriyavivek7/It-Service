import NOTIFY from "../model/NOTIFY.js";
import mongoose from "mongoose";


export const getNotification = async (req, res, next) =>{
    try{
        const {mongoid} = req

        if(!mongoid) return res.status(400).json({message:"Unauthorized request: Missing user ID.",status:400})

        const notifications = await NOTIFY.find({to:mongoid,isRead:false}).sort({createdAt: -1})

        return res.status(200).json({message:"Notification retrived successfully.",status:200,data:notifications})
    }catch(err){
        next(err)
    }
}

export const markAsRead = async (req, res, next) => {
    try {
        const { mongoid } = req;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Please provide notification id." });
        }

        const notification = await NOTIFY.findById(id);

        if (!notification) {
            return res.status(404).json({ status: 404, message: "Notification not found." });
        }

        if (!notification.to.equals(mongoid)) {
            return res.status(400).json({ message: "This notification is not for you, so you can't mark it as read." });
        }

        if (notification.isRead) {
            return res.status(200).json({ message: "Notification is already marked as read.", status: 200, data: notification });
        }

        const updatedNotify = await NOTIFY.findByIdAndUpdate(
            id,
            { $set: { isRead: true } },
            { new: true }
        );

        return res.status(200).json({ message: "Notification updated successfully.", status: 200, data: updatedNotify });
    } catch (err) {
        next(err);
    }
};