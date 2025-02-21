import ADDRESS from "../model/ADDRESS.js";

//For create address
export const createAddress = async (req, res, next)=>{
    try{
        const {mongoid , userType} = req
        if(!mongoid && !userType){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const {name, address_type, pincode, house_no, nearby_landmark} = req.body
        if(!name || !address_type || !pincode || !house_no){
            return res.status(400).json({message:"Please provide all required fields.",status:400})
        }

        const newAddress = new ADDRESS({
            name,
            address_type,
            pincode,
            house_no,
            nearby_landmark,
            added_by:mongoid,
            added_by_model:userType
        })

        await newAddress.save()

        return res.status(200).json({message:"New Address created successfully",data:newAddress,status:200})

    }catch(err){
        next(err)
    }
}

//For get all address of User or Employee
export const getAllAddress = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        if(!mongoid || !userType){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user type", status: 400 });
        }

        const address = await ADDRESS.find({added_by:req.mongoid,added_by_model:userType})

        return res.status(200).json({message:"All address rerived",status:200,data:address || []})
    }catch(err){
        next(err)
    }
}

//For update address 
export const updateAddress = async (req, res, next) =>{
    try{
       
       const { addressId }  = req.params 

       if(!addressId) return res.status(400).json({message:"Please provide address id.",status:400})
        
      if(!req.mongoid){
         return res.status(400).json({ message: "Unauthorized request: Missing user ID", status: 400 });
      }

      const updatedAddress =  await ADDRESS.findOneAndUpdate({_id:addressId,added_by:req.mongoid},{$set:{...req.body}},{new:true,runValidators:true})

      if(!updatedAddress) return res.status(404).json({message:"Address not found!",status:404})

      return res.status(200).json({message:"Address updated successfully",data:updatedAddress,status:200})
      
    }catch(err){
        next(err)
    }
}

//For delete address
export const deleteAddress = async (req, res, next) =>{
    try{
        const { addressId } = req.params
        
        if(!addressId) return res.status(400).json({message:"Please provide address id.",status:400})

        if(!req.mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID", status: 400 });
        }

        const deletedAddress = await ADDRESS.findOneAndDelete({_id:addressId,added_by:req.mongoid})

        if(!deletedAddress) return res.status(404).json({message:"Address not found",status:404})

        return res.status(200).json({message:"Address deleted successfully",status:200})
        
    }catch(err){
        next(err)
    }
}