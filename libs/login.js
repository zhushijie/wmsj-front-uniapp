
import store from "../store";
import Cache from '../utils/cache';
import { Debounce } from '@/utils/validate.js'
// #ifdef H5 || APP-PLUS
import { isWeixin } from "../utils";
import auth from './wechat';
// #endif

import { LOGIN_STATUS, USER_INFO, EXPIRES_TIME, STATE_R_KEY, BACK_URL} from './../config/cache';

function prePage(){
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 1];
	// #ifndef APP-PLUS
	return prePage.route;
	// #endif
	// #ifdef APP-PLUS
	return prePage.$page.fullPath;
	// #endif
}

export const toLogin = Debounce(_toLogin,800)

export function _toLogin(push, pathLogin) {
	store.commit("LOGOUT");
	let path = prePage();
	let login_back_url = Cache.get(BACK_URL);
	// #ifdef H5
	path = location.href;
	path = location.pathname + location.search;
	// #endif
	if(!pathLogin){
		pathLogin = '/page/users/login/index'
		Cache.set(BACK_URL,path);
	}
		
	// #ifdef H5
	if (isWeixin()) {
		let urlData = location.pathname + location.search
		if (urlData.indexOf('?') !== -1) {
			urlData += '&go_longin=1';
		} else {
			urlData += '?go_longin=1';
		}
		if (!Cache.has('snsapiKey')) {
			auth.oAuth('snsapi_base', urlData);
		} else {
			if (['/pages/user/index'].indexOf(login_back_url) == -1) {
				uni.navigateTo({
					url: '/pages/users/wechat_login/index'
				})
			}
		}
	} else {
		if (['/pages/user/index'].indexOf(login_back_url) == -1) {
			uni.navigateTo({
				url: '/pages/users/login/index'
			})
		}
	}
	// #endif
	
	if (['pages/user/index','/pages/user/index'].indexOf(login_back_url) == -1) {
		// #ifdef MP
		uni.showModal({
		    title: '登录提示',
		    content: '请登陆后进行操作',
			cancelColor: '#000000',
			confirmColor: '#526BB1',
		    success: function (res) {
		        if (res.confirm) {
		          uni.navigateTo({
		          	 url: '/pages/users/wechat_login/index'
		          })
		        } else if (res.cancel) {
		            uni.navigateTo({
		            	url: '/pages/users/login/index'
		            })
		        }
		    }
		});
		// #endif
		// #ifdef APP-PLUS
			uni.showModal({
			    title: '登录提示',
			    content: '请登陆后进行操作',
				cancelColor: '#000000',
				confirmColor: '#526BB1',
			    success: function (res) {
			        if (res.confirm) {
			           uni.navigateTo({
			           	url: '/pages/users/login/index'
			           })
			        } else if (res.cancel) {
			           uni.navigateTo({
			           	url: '/pages/users/login/index'
			           })
			        }
			    }
			});
		// #endif
	}
}


export function checkLogin()
{
	let token = Cache.get(LOGIN_STATUS);
	let expiresTime = Cache.get(EXPIRES_TIME);
	let newTime = Math.round(new Date() / 1000);
	if (expiresTime < newTime || !token){
		Cache.clear(LOGIN_STATUS);
		Cache.clear(EXPIRES_TIME);
		Cache.clear(USER_INFO);
		Cache.clear(STATE_R_KEY);
		return false;
	}else{
		store.commit('UPDATE_LOGIN',token);
		let userInfo = Cache.get(USER_INFO,true);
		if(userInfo){
			store.commit('UPDATE_USERINFO',userInfo);
		}
		return true;
	}

}
