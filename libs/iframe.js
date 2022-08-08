
let app = getApp();
/**
 * 点击事件，判断是否是isIframe页面
*/ 
export function goPage() {
	return new Promise(resolve => {
		if (app.globalData.isIframe == false) {
			resolve(true);
		}else{
			return false
		}
	});
}