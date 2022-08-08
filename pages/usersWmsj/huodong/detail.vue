<template>
	<view  class="page-index">

		<view class="huodongDetail skeleton">
			
			<!--一张图片的文章-->
			<view hover-class='none' class='detail acea-row row-between-wrapper'>
				<view class='pictrue skeleton-rect'>
					<image :src='activityInfo.activityImages'></image>
				</view>
				
				<view class='prop acea-row row-column-between'>
					<view class='name line2 skeleton-rect'>
						{{activityInfo.activityName}}
					</view>
				</view>
			</view>

		</view>
		

		<view class="activityJianjie skeleton" v-if="activityInfo">
			<view class='detail' >
				<view class='item'>活动介绍：</view>
				<view class='item' style="text-indent: 2em;line-height: 50rpx;font-size: 30rpx;margin-top: 10rpx;">{{activityInfo.activityDetail}}</view>
			</view>
		</view>
		
		<view class="activityJianjie skeleton" v-if="activityInfo">
			<view class='detail' >
				<view class='item'>注意事项：</view>
				<view class='item' style="text-indent: 2em;line-height: 50rpx;font-size: 30rpx;margin-top: 10rpx;">{{activityInfo.attention}}</view>
			</view>
		</view>
		
		<view class="propDetail skeleton">
			<view class='detail' v-if="activityInfo">
				<view class='item'>服务类型：{{activityInfo.serviceType}}</view>
				<view class='item'>人数上限：{{activityInfo.maxNumber}}</view>
				<view class='item'>活动时长：{{activityInfo.serveHours==null?'0':activityInfo.serveHours}}</view>
				<view class='item'>奖励积分：{{activityInfo.serveJifen==null?'0':activityInfo.serveJifen}}</view>
				<view class='item'>活动地点：{{activityInfo.activityAddress}} 
					<view style="float: right;">
						<u-button icon="map" type="primary" size="mini" shape="circle" :plain="true" text="导航" @click="showMaoLocation(activityInfo)"></u-button>
					</view>
				</view>
				<view class='item'>活动时间：{{activityInfo.startTime==null?'':activityInfo.startTime.substring(0,16)}}
				至{{activityInfo.endTime==null?'':activityInfo.endTime.substring(0,16)}}</view>
				<view class='item'>联&nbsp;&nbsp;系&nbsp;&nbsp;人：{{activityInfo.leaderUserName}}</view>
				<view class='item'>联系电话：{{activityInfo.phone}}
					<view style="float: right;">
						<u-button icon="phone" type="primary" size="mini" shape="circle" :plain="true" text="电话" @click="call(activityInfo.phone)"></u-button>
					</view>
				</view> 
			</view>
		</view>
		
		<u-cell-group class="baomingChenyuan"  v-if="activityInfo">
			<u-cell icon="account-fill" :title="'已报名人员 '+ activityInfo.nowNumber+'/'+activityInfo.maxNumber" :isLink="true" arrow-direction="right" 
			@click="goUsers(activityInfo.acitivityId)"></u-cell> 
			<view class="baomingChenyuan skeleton">
				<view class='list'>
					<block  v-for="(item,index) in activityInfo.baomingUserList" :key="item.avatar">
						<view hover-class='none' class='item acea-row'>
							<view class='pictrue skeleton-rect'> 
								<image :src='item.avatar'></image>
							</view>
							<view @click="goActivity(item)"> 
								<view class='name line2 skeleton-rect'>
									{{item.realName}}
								</view> 
							</view>
							<view class='time skeleton-rect'>
								{{item.createTime}}
							</view>
						</view>
					</block>
				</view>
			</view>
		</u-cell-group>
		
		<view class='footer acea-row row-between-wrapper' v-if="isPaidanLeader"  >
			<view class="bnt bntVideo acea-row skeleton-rect">
				<u-button icon="kefu-ermai" type="primary" :plain="true" @click="call(activityInfo.faqirenPhone)" text="联系派单员"></u-button>
			</view>
			<view class="bnt bntVideo acea-row skeleton-rect">
				<u-button icon="info-circle" type="warning" :plain="true" @click="juejueHandle(activityInfo)" text="不方便接单"></u-button>
			</view>
			<view class="bnt bntVideo acea-row skeleton-rect">
				<u-button icon="checkmark" type="success" :plain="true" @click="jiedanHandle(activityInfo)" text="同意接单"></u-button>
			</view>
		</view>
		
		<view class='footer acea-row row-between-wrapper' style="text-align: right;" v-if="isZhaomu">
			<view  style="margin-left: 450rpx; width: 200rpx;">
				<u-button icon="checkmark" type="success" :plain="true" @click="baomingHandle(activityInfo)" text="报名"></u-button>
			</view>
		</view>
		
		<view class='footer acea-row row-between-wrapper' v-if="isJieshu">
			<view style="margin-left: 500rpx; width: 200rpx;border: 1px #6b6b6b solid;">
				<u-button icon="" type="default"  disabled :plain="true" text="活动已结束"></u-button>
			</view>
		</view> 
	</view>
</template> 

<script>
	import {getActivityInfo,jiedan,jujue,baoming} from '@/api/wmsj.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	 
	export default {
		computed: mapGetters(['isLogin','isWmsj', 'uid', 'userInfo']),
		
		data() {
			return {
				activityId:0,
				activityInfo: {},
				isPaidanLeader:false,
				isZhaomu:false,
				isJieshu:false,
				user_latitude: 0,
				user_longitude: 0
			}
		},
		
		mounted() {
			if (this.user_latitude && this.user_longitude) {
			} else {
				this.selfLocation();
			}
		},
		
		onLoad(options){
			if (options.hasOwnProperty('activityId')){
				this.activityId = options.activityId;
			}
			try {
				this.user_latitude = uni.getStorageSync('user_latitude');
				this.user_longitude = uni.getStorageSync('user_longitude');
			} catch (e) {
				// error
			}
			this.getActivity(this.activityId)
			if(!this.isWmsj){
				uni.showModal({
					title:"成为志愿者",
					content:"您还不是志愿者，请完善信息后成为志愿者。",
					showCancel:false,
					complete:function(){
						uni.navigateTo({
							url: '/pages/usersWmsj/addzyz/index'
						})				
					}
				})
			}
		},
		
		methods: {
			getActivity(activtyId){
				getActivityInfo(activtyId).then(res => {
					this.activityInfo=res.data
					if(this.activityInfo.leaderUserId==this.uid&&this.activityInfo.activityState=='22'){
						this.isPaidanLeader=true
					}
					if(this.activityInfo.activityState=='30'){
						this.isZhaomu=true
					}
					if(this.activityInfo.activityState=='60'){
						this.isJieshu=true
					}
				});
			},
			baomingHandle(item){
				let activityId=this.activityInfo.activityId
				uni.showModal({
					content:'您确认报名【'+item.activityName+'】活动吗？',
					cancelColor: '#000000',
					confirmColor: '#526BB1',
					success: function (res) {
						if (res.confirm) {
							//点击确认的操作 
							baoming(activityId).then(res => {
								uni.showToast({
									title: res.message,
									duration: 4000,
									icon:'none'
								})
							});
						} else if (res.cancel) {
							
						}
					}
				})
			},
			juejueHandle(item){
				let activityId=this.activityInfo.activityId
				uni.showModal({
					content:'您确认决绝接单【'+item.activityName+'】吗？',
					cancelColor: '#000000',
					confirmColor: '#526BB1',
					success: function (res) {
						if (res.confirm) {
							//点击确认的操作
							jujue(activityId).then(res => {
								uni.showToast({
									title: res.message,
									duration: 4000,
									icon:'none'
								})
							});
						} else if (res.cancel) {
							
						}
					}
				})
			},
			jiedanHandle(item){
				let activityId=this.activityInfo.activityId
				uni.showModal({
					content:'您确认接单【'+item.activityName+'】吗？接单后将开始招募志愿者。',
					cancelColor: '#000000',
					confirmColor: '#526BB1',
					success: function (res) {
						if (res.confirm) {
							//点击确认的操作
							jiedan(activityId).then(res => {
								uni.showToast({
									title: res.message,
									duration: 4000,
									icon:'none'
								})
								this.getActivity(this.activityId)
							});
						} else if (res.cancel) {
							
						}
					}
				})
			},
			
			selfLocation() {
				let self = this
				// #ifdef H5
				if (self.$wechat.isWeixin()) {
					self.$wechat.location().then(res => {
						this.user_latitude = res.latitude;
						this.user_longitude = res.longitude;
						uni.setStorageSync('user_latitude', res.latitude);
						uni.setStorageSync('user_longitude', res.longitude);
					})
				} else {
				// #endif	
					uni.getLocation({
						type: 'wgs84',
						success: (res) => {
							try {
								this.user_latitude = res.latitude;
								this.user_longitude = res.longitude;
								uni.setStorageSync('user_latitude', res.latitude);
								uni.setStorageSync('user_longitude', res.longitude);
							} catch {}
						},
						complete: function() {
						}
					});
					// #ifdef H5	
				}
				// #endif
			},
			showMaoLocation(e) {
				let self = this;
				// #ifdef H5
				if (self.$wechat.isWeixin()) {
					self.$wechat.seeLocation({
						latitude: Number(e.latitude),
						longitude: Number(e.longitude)
					}).then(res => {
						console.log('success');
					})
				} else {
					// #endif	
					uni.openLocation({
						latitude: Number(e.latitude),
						longitude: Number(e.longitude),
						name: e.name,
						address: `${e.activityAddress}`,
						success: function() {
							console.log('success');
						}
					});
					// #ifdef H5	
				}
				// #endif
			},
			call(phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		overflow-x: hidden;
	}

			
	.huodongDetail{
		background-color: white;
	}
	
	.huodongDetail .detail {
		
	}
	
	.huodongDetail .detail .pictrue {
		width: 750rpx;
		height: 420rpx;
	}
	.huodongDetail .detail .shenqing {
		position: absolute;
		width: 140rpx;
		height: 40rpx;
		line-height: 40rpx;
		color: white;
		background: $theme-color;
		text-align: center;
		border-radius: 20rpx;
		right: 40rpx;
		top: 35rpx;
	}
	
	.huodongDetail .detail .pictrue image {
		width: 100%;
		height: 100%;
	}
	
	.huodongDetail .detail .prop {
		margin: 0 24rpx;
		padding: 10rpx 0;
		width: 750rpx;
		font-size: 30rpx;
		color: #000000;
	}
	
	.huodongDetail .detail .prop .name {
		width: 750rpx;
		font-size: 30rpx;
		font-weight:700;
		line-height: 60rpx;
		padding: 10rpx;
	}
	
	
	.huodongDetail .detail .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
	
	

	.activityJianjie{
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx 40rpx ;
	}
	.activityJianjie .detail{
		color: #585858;
	}
	
	.propDetail{
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx 40rpx ;
	}
	.propDetail .detail{
	}
	.propDetail .detail .item{
		color: #585858;
		line-height: 40rpx;
		margin-top: 20rpx;
		background-color: white;
	}
	

	
	.baomingChenyuan{
		background-color: white;
		margin-bottom: 100rpx;
	}
	
	.baomingChenyuan .list .item {
		margin: 0 24rpx;
		padding: 10rpx 0;
	}
	
	.baomingChenyuan .list .item .pictrue {
		width: 80rpx;
		height: 80rpx;
		margin-left: 40rpx;
	}

	
	.baomingChenyuan .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50rpx;
	}
	

	.baomingChenyuan .list .item .name {
		font-size: 30rpx;
		color: #585858;
		margin-left: 40rpx;
		line-height: 80rpx;		
	}
	
	
	.baomingChenyuan .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 5rpx;
		line-height: 80rpx;	
		margin-left: 40rpx;
	}
	
	.footer {
		padding: 0 20rpx 0 30rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		z-index: 277;
		border-top: 1rpx solid #f0f0f0;
		height: 100rpx;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
</style>
