const express = require('express');
const router = express.Router();
const conn = require('../util/sql.js')

const multer = require('multer')
//精细化去设置，如何去保存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
  filename: function (req, file, cb) {
    // console.log('file', file)
    // 目标： 新名字是时间戳+后缀名
    const filenameArr = file.originalname.split('.');
    // filenameArr.length-1是找到最后一个元素的下标
    const fileName = Date.now() + "." + filenameArr[filenameArr.length-1]
    cb(null, fileName) //
  }
})

const upload = multer({storage })
// 写接口
router.use(express.urlencoded())

//获取用户的基本信息
router.get('/my/userinfo',(req,res) => {
    const {username} = req.body;
    let sqlStr = 'select id, name, password, user_pic,nickname,email from user where isdelete=0';
    if (username) {
        sqlStr += ' ' + `and name="${username}"`
    }
    conn.query(sqlStr,(err,data) => {
        if(err){
            console.log(err);
            res.json({ status: 1, msg: '查询出错' })
            return
        }
        res.json({status: 0, msg: '获取用户基本信息成功！',data})
    })
})
//上传图片接受
router.post('my/uploadPic/', upload.single('file_data'), (req, res) => {
    //如果文件上传成功
    //   console.log('本次上传的文件是', req.file);
    //   console.log(req.id);
      //后面再做：错误处理
      res.json({
          "status": 0,
          "message": "http://127.0.0.1:3000/my/uploads/" + req.file.filename
      })
      // let sql = `update heros set img= 'http://127.0.0.1:3000/uploads/${req.file.filename}'  where `
  })
  

router.post('/my/userinfo',(req,res) => {
    const {id,nickname,email,user_pic } = req.body;
    let sqlStr = `update user set nickname="${nickname}",email="${email}",user_pic="${user_pic}" where id=${id}`;
    conn.query(sqlStr,(err,data) => {
        if(err){
            console.log(err);
            res.json({status: 1, message: '修改错误'})
            return
        }
        res.json({status: 0, message: '修改用户信息成功'})
    })
})

//重置密码
router.post('/my/updatepwd',(req,res) => {
    const {id,oldPwd,newPwd } = req.body;
    let sqlStr = `update user set password="${newPwd}" where id=${id} and password = ${oldPwd}`;
    conn.query(sqlStr,(err,data) => {
        if(err){
            // console.log(err);
            res.json({status: 1, message: '密码错误'})
            return
        }
        res.json({status: 0, message: '更新密码成功'})
    })
})

//获取文章列表
router.get('/my/article/cates',(req,res) => {
    console.log(111);
    let sqlStr = 'select * from categ';
    conn.query(sqlStr,(err,data) => {
        if(err){
            console.log(err);
            res.json({ status: 1, message: '获取出错' })
            return
        }
        res.json({status: 0, message: '获取文章分类列表成功！',data})
    })
})

//添加文章
router.post(`/my/article/addcates`, (req, res) => {
    //1获取参数。如何获取post传递的普通键值对？
    //   console.log('接收到的参数', req.body);
      const { name, slug } = req.body;
      //拼接sql，添加到数据库表中
      const sqlStr = `insert into categ (name, slug) values("${name}", "${slug}")`
    //   console.log('sqlStr', sqlStr);
      conn.query(sqlStr, (err, result) => {
        //4 根据操作结果，做不同的响应式
          if (err) {
              console.log(err);
              res.json({ "status": 1, "message": "服务器处理失败" })
              return
          }
          res.json({ "status": 0, "message": "新增文章分类成功" });
      })
  })
  //删除
  router.get('/my/article/deletecate',(req,res) => {
    const { id } = req.query;
    const delesql = `delete from categ where id=${id}`;
    conn.query(delesql,(err,result) => {
        if(err){
            res.json({'status':1,'message':'删除失败'})
            return
        }else {
            res.json({'status':0,'message':'删除文章分类成功'})
        }
    })
})

//根据id获取文章分类数据
router.get('/my/article/getCatesById',(req,res) => {
    const { id } = req.query
    let sqlStr = `select * from categ where id=${id}`;
    conn.query(sqlStr,(err,data) => {
        if(err){
            console.log(err);
            res.json({ status: 1, message: '获取出错' })
            return
        }
        res.json({status: 0, message: '获取文章分类成功！',data})
    })
})

//更新文章
router.post('/my/article/updatecate',(req,res) => {
    const {id,name,slug } = req.body;
    let sqlStr = `update categ set name="${name}",slug="${slug}" where id=${id}`;
    conn.query(sqlStr,(err,data) => {
        if(err){
            console.log(err);
            console.log(err);
            res.json({status: 1, message: '更新错误'})
            return
        }
        res.json({status: 0, message: '更新分类信息成功'})
    })
})
module.exports = router;