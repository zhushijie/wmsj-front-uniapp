<template>
	<view :data-theme="theme" class="upda_pasd">
		<view class="ChangePassword">
			<form @submit="editPwd" report-submit='true'>
				<view class="phone">当前手机号：{{phone}}</view>
				<view class="list">
					<view class="item">
						<input type='password' placeholder='6-8位字母加数字' placeholder-class='placeholder' name="password" :value="password" maxlength="18" @blur="checkPasd"></input>
					</view>
					<view class="item">
						<input type='password' placeholder='确认新密码' placeholder-class='placeholder' name="qr_password" :value="qr_password" maxlength="18" @blur="checkPassword"></input>
					</view>
					<view class="item acea-row row-between-wrapper">
						<input type='number' placeholder='填写验证码' placeholder-class='placeholder' class="codeIput" name="captcha" :value="captcha" maxlength="6"></input>
						<button class="code" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="code">
							{{ text }}
						</button>
					</view>
				</view>
				<button form-type="submit" class="confirmBnt">确认修改</button>
			</form>
		</view>
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		phoneRegisterReset,
		registerVerify
	} from '@/api/api.js';
	import {
		getUserInfo
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	import {setThemeColor} from '@/utils/setTheme.js'
	const app = getApp();
	export default {
		mixins: [sendVerifyCode],
		data() {
			return {
				userInfo: {},
				phone: '',
				password: '',
				captcha: '',
				qr_password: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				theme:app.globalData.theme,
				bgColor:''
			};
		},
		computed: mapGetters(['isLogin']),
		watch:{
			isLogin:{
				handler:function(newV,oldV){
					if(newV){
						this.getUserInfo();
					}
				},
				deep:true
			}
		},
		onLoad() {
			if (this.isLogin) {
				this.getUserInfo();
			} else {
				toLogin();
			}
			let that = this;
			that.bgColor = setThemeColor();
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor:that.bgColor,
			});
		},
		methods: {
			/**
			 * 授权回调
			 */
			onLoadFun: function(e) {
				this.getUserInfo();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					let tel = res.data.phone;
					let phone = tel.substr(0, 3) + "****" + tel.substr(7);
					that.$set(that, 'userInfo', res.data);
					that.phone = phone;
				});
			},
			/**
			 * 发送验证码
			 * 
			 */
			async code() {
				let that = this;
				if (!that.userInfo.phone) return that.$util.Tips({
					title: '手机号码不存在,无法发送验证码！'
				});
				await registerVerify(that.userInfo.phone).then(res => {
					that.$util.Tips({
						title: res.message
					});
					that.sendCode();
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			},

			/**
			 * H5登录 修改密码
			 * 
			 */
			checkPasd(e){
				let that = this,password = e.detail.value;
				that.password = password;
				// if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,8}$/i.test(password)) return that.$util.Tips({
				if (!/^[a-zA-Z]\w{5,17}$/i.test(password)) return that.$util.Tips({
					title: '密码规则为6-18位字母加数字'
				});
			},
			checkPassword(e){
				let that = this,qr_password = e.detail.value;
				if (qr_password != that.password) return that.$util.Tips({
					title: '两次输入的密码不一致！'
				});
			},
			editPwd: function(e) {
				let that = this,
					password = e.detail.value.password,
					qr_password = e.detail.value.qr_password,
					captcha = e.detail.value.captcha;
				if (!password) return that.$util.Tips({
					title: '请输入新密码'
				});
				if (!qr_password) return that.$util.Tips({
					title: '请确认新密码'
				});
				if (!captcha) return that.$util.Tips({
					title: '请输入验证码'
				});
				phoneRegisterReset({
					account: that.userInfo.phone,
					captcha: captcha,
					password: password
				}).then(res => {
					return that.$util.Tips({
						title: res.message
					}, {
						tab: 3,
						url: 1
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}
	.upda_pasd{
		background: #FFFFFF;
		height: 100vh;
	}
	.ChangePassword .phone {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		padding-top: 100rpx;
	}

	.ChangePassword .list {
		width: 580rpx;
		margin: 53rpx auto 0 auto;
	}

	.ChangePassword .list .item {
		width: 100%;
		height: 110rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.ChangePassword .list .item input {
		width: 100%;
		height: 100%;
		font-size: 32rpx;
	}

	.ChangePassword .list .item .placeholder {
		color: #b9b9bc;
	}

	.ChangePassword .list .item input.codeIput {
		width: 340rpx;
	}

	.ChangePassword .list .item .code {
		font-size: 32rpx;
		// background-color: #fff;
		@include main_color(theme);
	}

	.ChangePassword .list .item .code.on {
		color: #b9b9bc !important;
	}

	.ChangePassword .confirmBnt {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		margin: 92rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
		@include main_bg_color(theme);
	}
</style>
