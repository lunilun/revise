const express = require('express');
const pg = require('../DB/pg.js');
const router = express.Router();

router.post("/save",(req,res)=>{
    pg.Save(req).then((data)=>{
        return res.json(data)
    });
});
router.get("/load",(req,res)=>{
    pg.Load().then((data) => {
        return res.json(data)
    });
});

router.get("/uload",(req,res)=>{
    pg.uLoad().then((data) => {
        return res.json(data)
    });
});
module.exports=router;