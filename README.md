# 移动端 文件列表
~~~
.
├── App.vue                文件主入口
├── api                    后台api调用地址
│   ├── dict               字典接口api
│   ├── activity.js        营销活动api
│   ├── api.js             公共接口api
│   ├── order.js           订单数据api
│   ├── public.js          公共接口api
│   ├── store.js           商品数据api
│   ├── wmsj.js            文明实践志愿者服务api
│   └── user.js            用户信息api
├── components             组件
│   ├── Loading            加载中
│   ├── addressWindow      地址选择
│   ├── articleFullList    信息发布综合组件，单图，多图，话题专题等标签
│   ├── cartList           购物车弹框
│   ├── countDown          倒计时
│   ├── couponListWindow   优惠券列表弹框
│   ├── comment-eg         文章、专题、话题的评论面板
│   ├── d_goodList         分类页模板3商品列表
│   ├── easy-upload        上传图片    
│   ├── f_goodList         分类页模板4商品列表
│   ├── goodList           主页和商品搜索页商品列表
│   ├── home               跳转tabBar的浮窗
│   ├── jyf-parser         商品详情富文本解析器  
│   ├── login_mobile       登录
│   ├── mpvue-calendar     日历
│   ├── orderGoods         订单商品
│   ├── payment            支付弹出层
│   ├── productConSwiper   商品详情banner
│   ├── productWindow      商品详情sku弹出层 
│   ├── promotionGood      首页宫格商品推荐列表
│   ├── recommend          热门推荐商品
│   ├── shareInfo          资讯详情分享
│   ├── shareRedPackets    商品详情分销气泡
│   ├── skeleton           骨架屏
│   ├── swipers            轮播图
│   ├── userEvaluation     商品评价
│   ├── vconsole.min.js    调试打印工具 
│   └── wPicker            选择器
├── config                 配置
│   ├── app.js             请求地址和请求头配置
│   ├── cache.js           缓存信息
│   └── socket.js          套接字
├── js_sdk                 JS-SDK
│   └── Sansnn-uQRCode     二维码生成
├── libs                   执行子文件     
│   ├── apps.js            授权登录获取token
│   ├── chat.js            聊天通信配置
│   ├── iframe.js          判断是否是isIframe页面
│   ├── login.js           登录
│   ├── order.js           活动商品跳转和预下单
│   ├── routine.js         微信小程序获取信息
│   └── wechat.js          微信公众号获取信息
├── main.js                项目入口文件
├── manifest.json          应用配置文件
├── mixins                 混入
│   └── SendVerifyCode.js  验证码
├── package-lock.json      描述模块的版本信息，模块来源及依赖
├── pages                  页面目录
│   ├── activity           营销活动
│   ├── auth               作者
│   ├── goods_cate         商品分类页
│   ├── goods_details      商品详情页
│   ├── goods_list         商品列表页
│   ├── goods_search       商品搜索页
│   ├── index              首页
│   ├── news_details       资讯详情
│   ├── news_list          资讯列表
│   ├── order_addcart      购物车
│   ├── order_details      订单详情
│   ├── order_pay_status   支付状态页
│   ├── usersWmsj          文明实践用户个人中心
│   ├── wenmingshijian     文明实践首页
│   ├── user               个人中心
│   └── users              用户目录
├── pages.json             页面文件的路径、窗口表现配置文件
├── plugin                 插件
│   ├── animate            动画库
│   ├── chat               聊天插件
│   ├── clipboard          复制插件
│   ├── dayjs              处理时间和日期的库
│   ├── image-tools        图像转换工具
│   └── jweixin-module     公众号H5的JS-SDK
├── static                 静态文件
│   ├── css                css样式目录
│   ├── html               PC端打开时的html文件
│   ├── iconfont           iconfont
│   ├── images             图片资源
│   ├── img                图片资源
│   └── tabBar             底部导航图片
├── store                  vuex
│   ├── getters.js         store的计算属性
│   ├── index.js           store入口文件
│   └── modules            store的模块
├── uni.scss                 uniapp自带的的scss文件
├── unpackage                打包后的目录
├── utils                    公共的js模块
│   ├── SubscribeMessage.js  消息通知
│   ├── base64src.js         base64
│   ├── cache.js             设置，读取，检测缓存
│   ├── index.js             公共配置文件
│   ├── permission.js        权限
│   ├── request.js           api请求方法
│   ├── util.js              工具函数
│   └── validate.js          输入验证，函数防抖
└── vue.config.js            主配置

