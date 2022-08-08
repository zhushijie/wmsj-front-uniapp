<template>
	<view  class="page-index">

		<view class="tuanduiList skeleton">
			<view class='list' v-if="tuanduiInfo">
			
				<!--一张图片的文章-->
				<view hover-class='none' class='item acea-row row-between-wrapper'>
					<view class='pictrue skeleton-rect'>
						<image :src='tuanduiInfo.logo'></image>
					</view>
					<view class='text acea-row row-column-between'>
						<view class='name line2 skeleton-rect'>
							{{tuanduiInfo.groupName}}
						</view>

						<view class="skeleton-rect">
						 服务时长：{{tuanduiInfo.serviceNum}}&nbsp; &nbsp;所在地区：{{tuanduiInfo.orgName}}</view>
					</view>
					<view v-if="tuanduiInfo.leaderUserId!=uid" class='shenqing' @click="shenqing(tuanduiInfo)" >申请加入</view>
				</view>
		
			</view>
		</view>
		
		<view class="tuanduiDetail skeleton">
			<view class='detail' v-if="tuanduiInfo">
				<view class='item'>团队类型：{{tuanduiInfo.groupType}}</view>
				<view class='item'>服务领域：{{tuanduiInfo.groupLingyu}}</view>
				<view class='item'>成立时间：{{tuanduiInfo.createTime==null?'':tuanduiInfo.createTime.substring(0,10)}}</view>
				<view class='item'>成员数量：{{tuanduiInfo.users[0].conut}}</view>
				<view class='item'>活动数量：{{tuanduiInfo.groupLingyu}}</view>
				<view class='item'>联&nbsp;&nbsp;系&nbsp;&nbsp;人：{{tuanduiInfo.leaderUserName}}</view>
				<view class='item'>联系电话：{{tuanduiInfo.phone}}</view>
			</view>
		</view>
		<view class="tuanduiJianjie skeleton" v-if="tuanduiInfo">
			<view class='detail' >
				<view class='item'>团队简介：</view>
				<view class='item' style="text-indent: 2em;line-height: 50rpx;font-size: 30rpx;margin-top: 10rpx;">{{tuanduiInfo.remark}}</view>
			</view>
		</view>
		<u-cell-group class="tuanduiJihua"  v-if="tuanduiInfo" style="display: none;">
			<u-cell icon="star-fill" title="团队活动" :isLink="true" arrow-direction="right"></u-cell>
			<view class='list'>
				<block  v-for="(item,index) in tuanduiInfo.users" :key="index"> 
					<view class='item'>团队活动:</view>
				</block>
			</view>
		</u-cell-group>
		
		<u-cell-group class="tuanduiChengyuan"  v-if="tuanduiInfo">
			<u-cell icon="account-fill" title="团队成员" :isLink="true" arrow-direction="right" @click="goUsers(tuanduiInfo.groupId)"></u-cell>
			<view class="tuanduiChengyuan skeleton">
				<view class='list'>
					<block  v-for="(item,index) in tuanduiInfo.users" :key="index">
						<view hover-class='none' class='item acea-row row-between-wrapper'>
							<view class='pictrue skeleton-rect'>
								<image :src='item.avatar'></image>
							</view>
							<view class='text acea-row row-column-between'>
								<view class='skeleton-rect'>
									成员姓名：{{item.realName}}
								</view>
								<view class="skeleton-rect">
								 服务时长：{{item.serviceNum}}
								 </view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</u-cell-group>
	</view>
</template>

<script>
	import {getTuanduiInfo,tuanduiAddUser} from '@/api/wmsj.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	 
	export default {
		computed: mapGetters(['isLogin','isWmsj', 'uid', 'userInfo']),
		components: {
			'uni-load-more':loadMore
		 },
		 
		data() {
			return {
				groupId:0,
				tuanduiInfo: {},
			}
		},
		onLoad: function (options){
			if (options.hasOwnProperty('groupId')){
				this.groupId = options.groupId;
			}
			this.getTuanduis(this.groupId)
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
			getTuanduis:function(groupId){
				getTuanduiInfo(groupId).then(res => {
					this.tuanduiInfo=res.data
				});
			},
			goUsers(id){
				uni.navigateTo({
					url: "/pages/usersWmsj/tuanduiList/detailUsers?groupId="+id
				})
			},
			shenqing:function(item){
				let groupId=this.tuanduiInfo.groupId
				uni.showModal({
					content:'您确认申请加入【'+item.groupName+'】吗？',
					cancelColor: '#000000',
					confirmColor: '#526BB1',
					success: function (res) {
						if (res.confirm) {
							//点击确认的操作
							tuanduiAddUser(groupId).then(res => {
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
			
			
		}
	}
</script>

<style scoped lang="scss">
	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}

			
	.tuanduiList{
		background-color: white;
	}
	
	.tuanduiList .list .item {
		margin: 0 24rpx;
		padding: 35rpx 0;
	}
	
	.tuanduiList .list .item .pictrue {
		width: 140rpx;
		height: 140rpx;
	}
	.tuanduiList .list .item .shenqing {
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
	
	.tuanduiList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}
	
	.tuanduiList .list .item .text {
		width: 530rpx;
		height: 140rpx;
		font-size: 30rpx;
		color: #999;
	}
	
	.tuanduiList .list .item .text .name {
		font-size: 40rpx;
		color: #282828;
		display: inline;
	}
	
	
	.tuanduiList .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
	.tuanduiDetail{
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx 40rpx ;
	}
	.tuanduiDetail .detail{
	}
	.tuanduiDetail .detail .item{
		height: 40rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
		background-color: white;
	}
	
	.tuanduiJianjie{
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx 40rpx ;
	}
	.tuanduiJianjie .detail{
		
	}
	
	
	.tuanduiJihua{
		margin-top: 20rpx;
		background-color: white;
		//padding: 20rpx 40rpx ;
	}
	.tuanduiJihua .list{
		padding: 20rpx 40rpx ;
	}
	
	.tuanduiJihua .list .item{
		height: 40rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
		background-color: white;
	}
	

	
	.tuanduiChengyuan{
		background-color: white;
	}
	
	.tuanduiChengyuan .list .item {
		margin: 0 24rpx;
		padding: 35rpx 0;
	}
	
	.tuanduiChengyuan .list .item .pictrue {
		width: 100rpx;
		height: 100rpx;
		margin-left: 40rpx;
	}

	
	.tuanduiChengyuan .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50rpx;
	}
	
	.tuanduiChengyuan .list .item .text {
		width: 530rpx;
		height: 80rpx;
		font-size: 24rpx;
		color: #999;
	}
	
	.tuanduiChengyuan .list .item .text .name {
		font-size: 40rpx;
		color: #282828;
		display: inline;
	}
	
	
	.tuanduiChengyuan .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
</style>
