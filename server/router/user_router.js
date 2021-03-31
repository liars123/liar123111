const express = require('express');
const router = express.Router();
const conn = require('../util/sql.js')
const jwt =require('jsonwebtoken')
router.use(express.urlencoded())

router.post('/api/reguser',(req,res) => {
    console.log(111,req.body);
    const { username , password } = req.body;
    const sqlStrSelect = `select name from user where name="${username}"`;
    conn.query(sqlStrSelect,(err,result) => {
        if(err){
            res.json({status:1,message:'服务器错误'})
            return
        }
        if(result.length > 0){
            res.json({status:1,message:'注册失败，名字占用了'})
            return
        }
        const sqlStr = `insert into user (name, password) values ("${username}", "${password }")`
        conn.query(sqlStr,(err,result) => {
            console.log(err);
            console.log(result);
            if(err){
                res.json({status:1,message:'服务器错误'})
                return
            }
            res.json({ status: 0, message: "注册成功！"})

        })
    })
})

router.post('/api/login',(req,res) => {
    const { username , password } = req.body;
    const sqlStr = `select * from user where name="${username}" and password="${password}"`
    conn.query(sqlStr,(err,result) => {
        if(err){
            res.json({ status: 1, message: "服务器错误"})
            return
        }
        if(result.length > 0){
            const token = 'Bearer ' + jwt.sign(
                {name:username},
                'gz61',
                {expiresIn:2*60*60}
            )
            res.json({status: 0, message: "登录成功！",token})
        }else{
            res.json({status: 1, message: "用户名密码错误"})
        }
    })
})



module.exports = router;