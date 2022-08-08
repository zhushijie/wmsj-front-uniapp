
//h5使用代理模式
let H5domain = '/dev-api'       //'http://xfsq2.front.blockylink.com'
// #ifdef MP || APP-PLUS
let Appdomain = 'http://xfsq2.front.blockylink.com'  // http://192.168.0.109:8081'
// #endif
//let ipdomain = 'http://192.168.0.109:8080'
//let domain = 'http://47.93.219.189:8888'
let ipdomain = 'http://47.93.219.189:8888'
module.exports = {
	// 请求域名 格式： https://您的域名 
	// #ifdef MP || APP-PLUS
		// HTTP_REQUEST_URL:'',
		HTTP_REQUEST_URL: Appdomain,
		// 线上访问ip地址
		HTTP_IP_URL: ipdomain,
	// #endif 
	
	// #ifdef H5
		//H5接口是浏览器地址
		// HTTP_REQUEST_URL: window.location.protocol+"//"+window.location.host,
		HTTP_REQUEST_URL:H5domain,
	// #endif
	
	HEADER:{
		'content-type': 'application/json'
	},
	HEADERPARAMS:{
		'content-type': 'application/x-www-form-urlencoded'
	},
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'Authori-zation',
	// 缓存时间 0 永久
	EXPIRE:0,
	//分页最多显示条数
	LIMIT: 10
};
