<template>
	<view :data-theme="theme">
		<view class='personal-data pad30' v-show="!orgselect">
			<view class='list borRadius14'>
				<u--form :rules="rules" :model="editActivityInfo" ref="form1" labelPosition="left">

					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="联系人" prop="faqirenName" labelWidth="220rpx" labelPosition="left"
							ref="editActivityInfo">
							<u--input inputAlign="right" v-model="editActivityInfo.faqirenName" border="none" maxlength=20
								placeholder="请输入联系人姓名"></u--input>
						</u-form-item>
					</view>

					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="联系电话" prop="faqirenPhone" labelWidth="220rpx" labelPosition="left"
							ref="editActivityInfo">
							<u--input inputAlign="right" v-model="editActivityInfo.faqirenPhone" border="none"
								maxlength=11 placeholder="请输入"></u--input>
						</u-form-item>
					</view>


					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="orgselect = !orgselect" label="选择阵地" prop="orgName" labelWidth="220rpx"
							labelPosition="left" ref="editActivityInfo">
							<u--input readonly inputAlign="right" v-model="editActivityInfo.orgName"
								placeholder="请选择阵地" />
							<u--input style="display: none;" inputAlign="right" v-model="editActivityInfo.orgId" />
						</u-form-item>
					</view>



					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="详细地址" prop="activityAddress" labelWidth="220rpx" labelPosition="left"
							ref="editActivityInfo">
							<u--input inputAlign="right" v-model="editActivityInfo.activityAddress"
								placeholder="请输入详细地址" />
						</u-form-item>
					</view>


					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showLingyu = !showLingyu" label="需要服务类型" prop="serviceType" labelWidth="220rpx"
							labelPosition="left" ref="editActivityInfo">
							<u--input readonly inputAlign="right" v-model="editActivityInfo.serviceType"
								placeholder="请选择服务分类" />
						</u-form-item>
						<u-picker @confirm="selectLingyu" @close="showLingyu=false" @cancel="showLingyu=false"
							:show="showLingyu" :columns="[dict.type.wmsj_lingyu]" keyName="label"
							:closeOnClickOverlay="true" />
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item @tap="showPicker = true" label="期望服务时间" prop="startTime" labelWidth="220rpx"
							labelPosition="left" ref="editActivityInfo">
							<u--input readonly inputAlign="right" v-model="editActivityInfo.startTime"
								placeholder="请选择期望服务时间" />
						</u-form-item>
					</view>
					
					<view class='item acea-row row-between-wrapper'>
						<u-form-item   label="预计服务时长" prop="serveHours" labelWidth="220rpx"
							labelPosition="left" ref="editActivityInfo">
							<u-number-box v-model="editActivityInfo.serveHours" ></u-number-box>
						</u-form-item>
					</view>
					
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="点单描述" prop="activityDetail" labelWidth="180rpx" labelPosition="left" ref="editActivityInfo">
							<u--textarea  v-model='editActivityInfo.activityDetail' placeholder="请输入内容"  confirmType="done" maxlength="200" 
								style="border: 2px #eeeeee solid;width: 460rpx;height: 180rpx;margin-left: 20rpx;"/>
						</u-form-item>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<u-form-item label="服务注意事项" prop="attention" labelWidth="180rpx" labelPosition="left" ref="editActivityInfo">
							<u--textarea  v-model='editActivityInfo.attention' placeholder="请输入服务注意事项"  confirmType="done" maxlength="200" 
								style="border: 2px #eeeeee solid;width: 460rpx;height: 180rpx;margin-left: 20rpx;"/>
						</u-form-item>
					</view>
					
					<p style="padding: 20rpx 20rpx;width: 710rpx; line-height: 40rpx;color: red;">
						完整的填写信息提交点单后，实践站管理员会收到您的点单信息，待实践站确认以后，分派相应的志愿团队进行志愿服务，
						请在个人中心【我的点单】中查看点单进度和反馈。
						
					</p>		
						
				</u--form>
			</view>

			<button class='modifyBnt bg_color' @click="formSubmit">提交点单</button>
		</view>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->

		<!-- 基础用法 -->
		<view style="margin-top: 0;" v-show="orgselect">
			<luyj-tree v-slot:default="{item}" @sendValue="seletOrg" @cancle="orgselect=false" :trees="orgTrees"
				:isCheck="true">
				<!-- 内容插槽 -->
				<view>
					<view class="content-item">
						<view class="word">{{item.name}}</view>
					</view>
				</view>
			</luyj-tree>
		</view>
		<u-datetime-picker closeOnClickOverlay :show="showPicker" v-model="nowTime" mode="date" @cancel="closePicker"
			@confirm="selectPicker"></u-datetime-picker>
	</view>
</template>

<script>
	import {
		addDiandan
	} from '@/api/wmsj.js';
	import {
		switchH5Login,
		getOrgTree
	} from '@/api/api.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js'
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	let app = getApp();
	export default {
		dicts: ['sys_normal_disable', 'wmsj_lingyu'],
		components: {
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				showPicker: false,
				nowTime: Number(new Date()),
				orgTrees: [],
				orgselect: false,
				showLingyu: false,
				loginType: 'h5', //app.globalData.loginType
				userIndex: 0,
				newAvatar: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				wechat: false,
				theme: app.globalData.theme,
				editPng: '../../../static/images/alert1.png',
				editActivityInfo: {
					faqirenName: '',
					faqirenPhone: '',
					orgName:'',
					activityAddress:'',
					serviceType:'',
					startTime:'',
					serveHours:0
				},
				rules: {
					'faqirenName': {
						type: 'string',
						required: true,
						message: '请输入点单人姓名',
					},
					'faqirenPhone': {
						type: 'string',
						required: true,
						message: '请输入点单人联系电话',
					},
					'orgName': {
						type: 'string',
						required: true,
						message: '请选择文明实践阵地',
					},
					'activityAddress': {
						type: 'string',
						required: true,
						message: '请输入服务详细地址',
					},
					'serviceType': {
						type: 'string',
						required: true,
						message: '请选择服务类型',
					},
					'startTime': {
						type: 'string',
						required: true,
						message: '请选择期望服务实践',
					},
					'serveHours': {
						type: 'number',
						required: true,
						message: '请选择期望服务时长',
					},
					
				},
			};
		},
		computed: mapGetters(['isLogin', 'uid', 'userInfo']),

		mounted() {

		},
		onShow() {
			if(this.userInfo.groupId!=2){
				uni.showModal({
					title:"加入文明实践系统",
					content:"您还未加入文明实践系统，请完善信息。",
					showCancel:false,
					complete:function(){
						uni.navigateTo({
							url: '/pages/usersWmsj/addzyz/index'
						})
					}
				})
			}
		},
		onLoad() {
			if (!this.isLogin) {
				toLogin();
			}
			this.orgTree()
		},
		methods: {
			closePicker() {
				this.showPicker = false
				console.log(this.showPicker)
			},
			selectPicker(e) {
				this.showPicker = false
				this.editActivityInfo.startTime = this.timestampToTime("YYYY-mm-dd",new Date(parseInt(e.value)))
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			seletOrg: function(e) {
				this.orgselect = false;
				this.editActivityInfo.orgName = e[0].name;
				this.editActivityInfo.orgId = e[0].id;
			},
			selectLingyu: function(e) {
				this.showLingyu = false;
				this.editActivityInfo.serviceType = e.value[0].value;
			},


			orgTree: function() {
				let that = this;
				let orgtree = [];
				getOrgTree().then(res => {
					orgtree = that.$util.handleTree(res.data, "id");
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
					model: "user",
					pid: 7
				}, function(res) {
					that.newAvatar = res.data.url;
				});
			},
			timestampToTime(fmt, date) {
				let ret;
				const opt = {
					"Y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"H+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"S+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				return fmt;
			},
			/**
			 * 提交修改
			 */
			formSubmit: Debounce(function(e) {
				let that = this
				that.$refs.form1.validate().then(res => {
					addDiandan(that.editActivityInfo).then(res => {
						return that.$util.Tips({
							title: '点单已提交，可在个人中心查看进度。',
						}, {
							tab: 3,
							url: 1
						});
					}).catch(msg => {
						uni.showToast({
							title: msg || '保存失败，没有修改',
							duration: 4000,
							icon: 'none'
						})
					});
				}).catch(errors => {

				})


			})
		}
	}
</script>

<style scoped lang="scss">
	.disabled {
		background-color: #eeeeee;
	}

	.personal-data .list {
		margin-top: 30rpx;
		background-color: #fff;
	}

	.personal-data .list .item {
		border-bottom: 1rpx solid #f2f2f2;
		padding: 0rpx 24rpx;
		font-size: 32rpx;
		color: #282828;
		width: 690rpx;
	}

	.u-form-item {
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

	.bg_color {
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
