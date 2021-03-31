const express = require('express');
const server = express();

const cors = require('cors');
server.use(cors());
server.use('/uploads',express.static('uploads'))
const jwt = require('express-jwt');
server.use(jwt({
    secret : 'gz61',
    algorithms : ['HS256']
}).unless({
path: ['/user/login', '/user/register',/^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
  }));
  const heroRouter = require('./router/hero_router.js')
  const userRouter = require('./router/user_router.js');
  server.use('/hero',heroRouter);
  server.use('/user',userRouter);

  server.use((err,req,res,next) => {
      console.log('有错误',err);
      if(err.name === 'UnauthorizedError'){
          res.status(401).send({ code:1,message:'身份认证失败！' })
      }
  })
  server.listen(3000,() => {
      console.log("您的服务器已经在3000端口就绪了");
  })