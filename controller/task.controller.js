const Task = require("../model/Task");
const taskController = {};


taskController.createTask = async (req, res) =>{
    try{
        const {task, isComplete} = req.body;
        const newTask = new Task({task, isComplete});
        await newTask.save();
        res.status(200).json({status:'ok', data:newTask});
    }catch(err){
        console.log(err);
        res.status(400).json({status:'fail', error: err});
    }
    
}

taskController.getTask = async (req, res) =>{
    try{
        const taskList = await Task.find({}).select("-__v");
        res.status(200).json({status:"ok", data: taskList});
    }catch(err){
        res.status(400).json({status:"get fail", error: err});
    }
}

taskController.updateTask = async (req, res) =>{
    try{
        const id = req.params.id;
        const task = await Task.findOne({"_id":id});
        if(!task){
            throw new Error("not find task");
        }
        const isComplete = task.isComplete;
        const updateTask = await Task.updateOne(
            {"_id":id},
            {$set:{isComplete:!isComplete}}
        );
        res.status(200).json({status:"ok", data: updateTask});
    }catch(err){
        res.status(400).json({status:"fail", error: err});
    }
}

taskController.deleteTask = async (req, res) =>{
    try{
        const task = await Task.deleteOne({_id:req.params.id});
        res.status(200).json({status:"ok", data:task});
    }catch(err){
        res.status(400).json({status:"fail", error: err});
    }
}

module.exports = taskController;