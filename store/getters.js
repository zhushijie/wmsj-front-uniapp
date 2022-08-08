
export default {
	token: state => state.app.token,
	isLogin: state => !!state.app.token,
	isWmsj: state => state.app.userInfo.groupId==2?true:false,
	backgroundColor: state => state.app.backgroundColor,
	userInfo: state => state.app.userInfo || {},
	uid: state => state.app.uid,
	homeActive: state => state.app.homeActive,
	home: state => state.app.home,
	chatUrl: state => state.app.chatUrl,
	systemPlatform: state => state.app.systemPlatform,
	productType: state => state.app.productType
};
