const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const mongoose = require ("mongoose");

const router = express.Router();

router.get("/balance/:userId",authMiddleware,async(req,res)=>{

    const account = await Account.findOne({
            userId:req.params.userId
        })
        res.status(200).json({
            balance:account.balance
        })
})

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();

    session.startTransaction()

    const {amount ,to} = req.body

    //fetch account within transaction

    const account = await Account.findOne({userId:req.body.userId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(400).json({
            message:"You have Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({userId:to}).session(session)
    
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account"
        })
    }

    //perform transaction
    await Account.updateOne({userId:req.body.userId},{$inc:{ balance : -amount } }).session(session)
    await Account.updateOne({userId:to},{$inc:{ balance : amount }}).session(session)

    //commit transaction
    await session.commitTransaction()

    res.json({
        message:"Transaction Completed"
    })
})

module.exports = router