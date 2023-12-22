const express = require("express")
const UserModel = require("../modals/userModal");
// const userAuth = require("../middleware/userAuth");
const InventoryModal = require("../modals/inventoryModal")
const RequestModal = require("../modals/requestModal")
const router = new express.Router()
const passport =require("passport");
const Inventory = require("../modals/inventoryModal");


router.post("/register", async (req,res)=>{
    try{
        const newuser = new UserModel(req.body)
        await newuser.save()
        // const token = await newuser.generateAuthToken()
        res.status(201).send(newuser)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post("/login",passport.authenticate("local"), async (req,res)=>{
    res.status(200).send(req.user)
})

router.get("/myProfile",async (req,res)=>{
    if(!req.user) return res.status(400).send("you are not authorised")
    res.send(req.user);
})

router.post("/addItem", async (req,res)=>{
    try {
        if(!req.user){
            return res.status(400).send({message:"please authenticate"})
        }
        if(req.user.role === "admin"){
            return res.status(400).send({message:"admin cannot add items"})
        }
        const updatedBody = {...req.body,restaurant:req.user.id}
        const newItem = await InventoryModal.create(updatedBody);
        await newItem.save();
        
        res.status(201).send(newItem)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.get("/allItems", async (req,res)=>{
    console.log("here"+req.user);
    try {
        if(!req.user){
            return res.status(400).send({message:"please authenticate"})
        }
        if(req.user.role === "restaurantOwner"){
            console.log("here2"+req.user.id);
            const allItems = await InventoryModal.find({restaurant:req.user.id})
            console.log("here3 "+ allItems);
            return res.status(200).send(allItems)
        }
        if(req.user.role === "admin"){
            console.log();
            const allItems = await InventoryModal.find()

            return res.status(200).send(allItems)
        }
        
        
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.post('/requestItem',async (req,res)=>{
    try {
        if(!req.user){
            return res.status(400).send({message:"please authenticate"})
        }
        if(req.user.role === "admin"){
            return res.status(400).send({message:"admin cannot make request"})
        }
        const existingItem = await InventoryModal.find({itemName:req.body.itemName});
        console.log(existingItem);
        if(!existingItem){
            return res.status(400).send({message:"item not available"})
        }
        const updatedBody = req.body
        updatedBody.status="pending"
        updatedBody.restaurant = req.user.id
        const newRequest = await RequestModal.create(updatedBody)
        await newRequest.save()
        res.status(201).send(newRequest)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get("/allRequests",async (req,res)=>{
    try {
        if(!req.user){
            return res.status(400).send({message:"please authenticate"})
        }
        if(req.user.role === "restaurantOwner"){
            return res.status(400).send({message:"restaurant Owner do not have access to all requests"})
        }  
        const allRequests = await RequestModal.find({})
        res.send(allRequests)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post("/tranferItem", async (req,res)=>{
    try {
        if(!req.user){
            return res.status(400).send({message:"please authenticate"})
        }
        if(req.user.role === "restaurantOwner"){
            return res.status(400).send({message:"restaurant Owner cannot tranfer item"})
        }
        const from = await InventoryModal.findById(req.body.from)
        if(from.quantity < req.body.quantity) return res.status(400).send({message:"asked quantity is not available"})
        const to = await InventoryModal.findById(req.body.to)
        if(from.itemName != to.itemName) return res.status(400).send({message:"Items should be same"})
        from.quantity = from.quantity - req.body.quantity
        to.quantity = to.quantity + req.body.quantity
        const newFrom = await Inventory.findByIdAndUpdate(req.body.from,from,{ new: true })
        const newto = await Inventory.findByIdAndUpdate(req.body.to,to,{ new: true })
        await newFrom.save()
        await newto.save()
        const requestUpdate = await RequestModal.findByIdAndUpdate(req.body.reqId,{status:"fulfilled"},{new:true})
        await requestUpdate.save()
        res.status(200).send("Transfer Successfull")
        
    } catch (error) {
        res.status(400).send(error)
    }
})



module.exports = router