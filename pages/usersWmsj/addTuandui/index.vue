<template>
	<view :data-theme="theme">
		<view class='personal-data pad30'  v-show="!orgselect">
			<view class='list borRadius14'>		
				<u--form  :rules="rules" :model="tuanduiInfo" ref="form1"  labelPosition="left" >
				
					<view class="item acea-row row-between-wrapper" style="padding: 20rpx 20rpx;">
						<view>团队logo</view>
						<view class="pictrue" @click.stop='uploadpic'>
							<image :src='newLogo ? newLogo : tuanduiInfo.logo'></image>
							<image :src='editPng' class="alter"></image>
							
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="团队名称" prop="realName" labelWidth="180rpx" labelPosition="left" ref="tuanduiInfo">
							<u--input inputAlign="right" v-model="tuanduiInfo.groupName" border="none" maxlength=20 placeholder="请填写团队名称" ></u--input>
						</u-form-item>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="orgselect = !orgselect" label="所属阵地" prop="orgName" labelWidth="180rpx" labelPosition="left" ref="tuanduiInfo">
							<u--input readonly inputAlign="right" v-model="tuanduiInfo.orgName"  placeholder="请选择阵地" />
							<u--input style="display: none;" inputAlign="right" v-model="tuanduiInfo.orgId" />
						</u-form-item>
					</view>
					
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="联系人" prop="realName" labelWidth="180rpx" labelPosition="left" ref="tuanduiInfo">
							<u--input disabled inputAlign="right" v-model="userInfo.realName" border="none" maxlength=18 ></u--input>
						</u-form-item>
					</view>
					
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="手机号码" prop="phone" labelWidth="180rpx" labelPosition="left" ref="tuanduiInfo">
							<u--input disabled inputAlign="right" v-model="userInfo.phone" border="none" maxlength=11 ></u--input>
						</u-form-item>
					</view>
					
				
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="团队地址" prop="addres" labelWidth="180rpx" labelPosition="left" ref="tuanduiInfo">
							<u--input inputAlign="right" v-model="tuanduiInfo.addres"  placeholder="请输入详细地址" />
						</u-form-item>
					</view>
					
					<view class='item acea-row row-between-wrapper'>
						<u-form-item  @tap="showTuanduiType = !showTuanduiType" label="团队类型" prop="grjn" labelWidth="180rpx" labelPosition="left" ref="tuanduiInfo">
							<u--input readonly  inputAlign="right" v-model="tuanduiInfo.groupType"  placeholder="请选择团队类型" />
						</u-form-item>
						<u-picker @confirm="selectTuanduiType" @close="showTuanduiType=false" @cancel="showTuanduiType=false" :show="showTuanduiType"
						:columns="[dict.type.wmsj_groupType]" keyName="label"  :closeOnClickOverlay = "true"/>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showLingyu = !showLingyu" label="服务领域" prop="wmsjType" labelWidth="180rpx" labelPosition="left" ref="tuanduiInfo">
							<u--input readonly inputAlign="right" v-model="tuanduiInfo.groupLingyu" 
							 placeholder="请选择实践分类" />
						</u-form-item>
						<u-picker @confirm="selectLingyu" @close="showLingyu=false" @cancel="showLingyu=false" :show="showLingyu"
						:columns="[dict.type.wmsj_lingyu]" keyName="label" :closeOnClickOverlay = "true"/>
						
					</view>
				
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="团队简介" prop="remark" labelWidth="180rpx" labelPosition="left" ref="tuanduiInfo">
							<u--textarea  v-model='tuanduiInfo.remark' placeholder="请输入内容"  confirmType="done" maxlength="200" 
								style="border: 2px #eeeeee solid;width: 460rpx;height: 180rpx;margin-left: 20rpx;"/>
						</u-form-item>
					</view>
				</u--form>
				
				<span style="padding: 20rpx;height: 120rpx;width: 750rpx; line-height: 40rpx;color: red;">填写完整信息后，点击提交，由新时代文明中心实践站管理员进行审核，审核通过后可在我的团队中查看。</span>
			
			</view>
		
			<button class='modifyBnt bg_color' @click="formSubmit">提交申请</button>
		</view>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		
		<!-- 基础用法 -->
		<view style="margin-top: 0;" v-show="orgselect">
			<luyj-tree v-slot:default="{item}" @sendValue="seletOrg" @cancle="orgselect=false" :trees="orgTrees" :isCheck="true">
				<!-- 内容插槽 -->
				<view>
					<view class="content-item">
						<view class="word">{{item.name}}</view>
					</view>
				</view>
			</luyj-tree>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
	
</template>

<script>
	import {getLogout} from '@/api/user.js';
	import {addTuandui} from '@/api/wmsj.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	import {Debounce} from '@/utils/validate.js'
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	let app = getApp();
	export default {
		dicts: ['sys_normal_disable','wmsj_lingyu','wmsj_groupType'],
		components: {
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				max:3,
				orgTrees:[],
				orgselect:false,
				showLingyu:false,
				showTuanduiType:false,
				loginType: 'h5', //app.globalData.loginType
				userIndex: 0,
				newLogo: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				wechat:false,
				theme:app.globalData.theme,
				editPng:'../../../static/images/alert1.png',
				tuanduiInfo:{
					logo:'',
					realName:'',
					cardId:'',
					orgName:'',
					orgId:'',
				},
				rules:{
					
					'logo': {
						type: 'string',
						required: true,
						message: '请选择团队logo',
					},
					
					'groupName': {
						type: 'string',
						required: true,
						message: '请输入团队名称',
					},
					'orgName': {
						type: 'string',
						required: true,
						message: '请选择文明实践阵地',
					},
					'addres': {
						type: 'string',
						required: true,
						message: '请输入志愿者团队所在地址',
					},
					'groupLingyu': {
						type: 'string',
						required: true,
						message: '请选择服务领域',
					},
					'groupType': {
						type: 'string',
						required: true,
						message: '请选择志愿者服务团队类型',
					},
					'remark': {
						type: 'string',
						required: true,
						message: '请输入志愿者团队简介',
					},
				},
			};
		},
		computed: mapGetters(['isLogin', 'uid', 'userInfo']),
		onLoad() {
			if (!this.isLogin) {
				toLogin();
			}
			this.orgTree()
			this.$store.dispatch('USERINFO');
		
			// #ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				this.$set(this,'wechat',false);
			}else{
				this.$set(this,'wechat',true);
			}
			// #endif
		},
		methods: {
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			seletOrg: function(e){
				this.$set(this,'orgselect',false);
				this.$set(this.tuanduiInfo,'orgName',e[0].name);
				this.$set(this.tuanduiInfo,'orgId',e[0].id);
			},
			selectLingyu: function(e){
				this.$set(this,'showLingyu',false);
				this.$set(this.tuanduiInfo,'groupLingyu',e.value[0].value);
			},
			selectTuanduiType: function(e){
				this.$set(this,'showTuanduiType',false);
				this.$set(this.tuanduiInfo,'groupType',e.value[0].value);
			},
			
			
			/**
			 * 小程序设置
			 */
			Setting: function() {
				uni.openSetting({
					success: function(res) {
						console.log(res.authSetting)
					}
				});
			},
			orgTree: function() {
				let that = this;
				let orgtree=[];
				getOrgTree().then(res => {
					orgtree=that.$util.handleTree(res.data, "id");
					that.$set(that, 'orgTrees', orgtree);
				});
			},
			/**
			 * 上传文件
			 * 
			 */
			uploadpic: function() {
				let that = this;
				that.$util.uploadImageOne({
					url: 'user/upload/image',
					name: 'multipart',
					model: "wmsj",
					pid: 7
				}, function(res) {
					that.newLogo = res.data.url;
				});
			},

			/**
			 * 提交修改
			 */
			formSubmit: Debounce(function(e) {
				let that = this
				that.tuanduiInfo.logo = that.newLogo?that.newLogo:that.tuanduiInfo.logo;
				console.log(that.tuanduiInfo.logo)
				if(that.tuanduiInfo.logo=='') {
					that.$refs.uToast.show({
						type: 'error',
						title: '提示',
						message: "请为团队选择一个logo",
					})
					return
				}
				that.$refs.form1.validate().then(res => {
					addTuandui(that.tuanduiInfo).then(res1 => {
						if(res1.code==200){
							return that.$util.Tips({
								title: '已向实践阵地提交申请，等待开通。',
								icon: 'success'
							}, {
								tab: 3,
								url: 1
							});
						}
					
					}).catch(msg => {
						
						that.$refs.uToast.show({
							type: 'error',
							title: '提示',
							message:  msg || '申请失败',
						})
						return 
					
					});
				}).catch(errors => {
					
				})
							
				
			})
		}
	}
</script>

<style scoped lang="scss">
	.disabled{
		background-color: #eeeeee;
	}

	.personal-data .list {
		margin-top: 30rpx;
		background-color: #fff;
	}

	.personal-data .list .item {
		border-bottom: 1rpx solid #f2f2f2;
		padding:  0rpx 24rpx;
		font-size: 32rpx;
		color: #282828;
		width: 690rpx;
	}
	.u-form-item{
		width: 640rpx;
	}

	.personal-data .list .item .phone {
		width: 160rpx;
		height: 56rpx;
		font-size: 24rpx;
		color: #fff;
		line-height: 56rpx;
		border-radius: 32rpx
	}

	.personal-data .list .item .pictrue {
		width: 88rpx;
		height: 88rpx;
		position: relative;
	}

	.personal-data .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.personal-data .list .item .pictrue .alter {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		position: absolute;
		bottom: 0;
		right: 0;
	}


	.personal-data .list .item .input .id {
		width: 365rpx;
	}

	.personal-data .list .item .input .iconfont {
		font-size: 35rpx;
	}

	.personal-data .modifyBnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 76rpx auto 0 auto;
	}
	.bg_color{
		@include main_bg_color(theme);
	}
	.personal-data .logOut {
		font-size: 32rpx;
		text-align: center;
		width: 690rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin: 30rpx auto 0 auto;
	}
</style>
