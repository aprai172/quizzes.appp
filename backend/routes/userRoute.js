const express = require('express');
const userController = require("../controllers/userController")

const router = express.Router()

router.post("/signup", userController.Signup)
router.post("/login", userController.Login)
router.get("/get",(req,res)=>{
    res.json({"name":"ndskjns"})
})


module.exports = router;