<template>
	<view  class="page-index">

		<u-cell-group class="tuanduiChengyuan"  v-if="userList">
			<view class="tuanduiChengyuan skeleton">
				<view class='list'>
					<block  v-for="(item,index) in userList" :key="index">
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
		
		<uni-load-more :status="more" @clickLoadMore="tuanduiUsers" ></uni-load-more>
		
	</view>
</template>

<script>
	import {getTuanduiInfo,tuanduiAddUser,getTuanduiUsers} from '@/api/wmsj.js';
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
				userList: [],
				page: 1,
				limit: 8, 
				more :"noMore",
			}
		},
		onLoad: function (options){
			if (options.hasOwnProperty('groupId')){
				this.groupId = options.groupId;
			}
			this.getTuanduis(this.groupId)
			console.log(this.isWmsj)
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
					this.tuanduiUsers()
				});
			},
			tuanduiUsers(){
				let that=this
				let groupId=this.groupId
				let limit = that.limit;
				let page = that.page;
				let userList = that.userList;
				
				getTuanduiUsers(groupId,{
					'page':this.page,
					'limit':this.limit
				}).then(res => {
					console.log(res)
					let usersListNew = [];
					let len = res.data.list.length;
					usersListNew = userList.concat(res.data.list);
					that.page++;
					that.$set(that, 'userList', usersListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
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
