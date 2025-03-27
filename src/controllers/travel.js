import Hotel from "../model/KhachSan"

export const getTravel=(req, res)=>{
    console.log("Travel router");
}

export const getTravelById=(req, res)=>{
    console.log("getTravelById");
}

export const addTravel= async (req, res)=>{
    try {
        const data=await Hotel(req.body).save();
        res.status(201).json(data);
    } catch (error) {
        
    }
}

export const deleteTravel=(req, res)=>{
    console.log(" deleteTravel");
}

export const updateTravel=(req, res)=>{
    console.log("updateTravel");
}