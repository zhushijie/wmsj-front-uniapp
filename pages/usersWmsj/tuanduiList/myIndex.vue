<template>
	<view  class="page-index">
		<view class="header">
			<!-- #ifdef  APP-PLUS -->
			<view class="sys-head" :style="{ height: statusBarHeight }"></view>
			<!-- #endif -->
			<view class="serch-wrapper flex">	
				<u-search  placeholder="搜索我的志愿者团队" :actionStyle="actionStyle" v-model="keyword" @custom="search" @search="search"></u-search>
			</view>
		</view>
		<u-subsection class="tabBar"  style=" height: 80rpx;border-bottom: 1px solid #e5e5e5;" :list="navList"
			 @change="sectionChange" mode="button" bgColor="#fff" activeColor="#E93323" :current="current" fontSize="15" :bold="false"></u-subsection>
		 
		<view class="tuanduiList skeleton">
			<view class='list' v-if="tuanduiList">
				<block  v-for="(item,index) in tuanduiList" :key="index"> 
					<!--一张图片的文章-->
					<view  hover-class='none' class='item acea-row row-between-wrapper'>
						<view @click="goTuandui(item)" class='pictrue skeleton-rect'>
							<image :src='item.logo'></image>
						</view>
						<view @click="goTuandui(item)" class='text acea-row row-column-between'>
							<view class='name line2 skeleton-rect'>
								{{item.groupName}}
							</view>
							<view class='status skeleton-rect' v-if="item.status==1">
								成立团队审核中
							</view>
							<view class="skeleton-rect">团队类型：{{item.groupType}}
							 &nbsp; &nbsp;服务领域：{{item.groupLingyu}}</view>
							 
							<view class="skeleton-rect">
							 服务时长：{{item.serviceNum}}&nbsp; &nbsp;
							 所在地区：{{item.orgName}}</view>
						</view>
						<view class='tuichu' v-if="item.leaderUserId!=uid&&item.flag==1" @click="tuichu(item)" >退出团队</view>
						<view class='tuichu' v-if="item.leaderUserId!=uid&&item.flag==0">申请加入中</view>
						<view class='tuichu' v-if="item.leaderUserId!=uid&&item.flag==2">已决绝申请</view>
						<view class='tuichu' v-if="item.leaderUserId==uid" @click="manager(item)" >团队管理</view>
					</view>
				</block>
			</view>
		</view>
		<uni-load-more :status="more" @clickLoadMore="getmore" ></uni-load-more>
		
	</view>
</template>

<script>
	import {getMyTuanduiList,getMyAddTuanduiList,tuanduiTuiChuUser} from '@/api/wmsj.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif 
	
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	 
	export default {
		components: {
			'uni-load-more':loadMore
		 },
		computed: mapGetters(['isLogin','isWmsj', 'uid', 'userInfo']),
		data() {
			return { 
				current:0,
				navList:['我加入的', '我成立的'],
				tuanduiList: [],
				page: 1,
				limit: 8, 
				more :"noMore",
				keyword: '',
				actionStyle: {'color':'#fff','font-size':'35rpx'}
			}
		},
		onLoad(){
			this.search()
		},
		onReachBottom: function () {
			this.getmore()();
		},
		onPullDownRefresh () {
			this.search()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		
		methods: {
			getMyTuanduis(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let tuanduiList = that.tuanduiList;
				
				getMyTuanduiList({
					page: page, 
					limit: limit,
					groupName: that.keyword
				}).then(res => {
					let tuanduiListNew = [];
					let len = res.data.list.length;
					tuanduiListNew = tuanduiList.concat(res.data.list);
					that.page++;
					that.$set(that, 'tuanduiList', tuanduiListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
			
				});
			},
			getMyAddTuanduis(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let tuanduiList = that.tuanduiList;
				
				getMyAddTuanduiList({
					page: page, 
					limit: limit,
					groupName: that.keyword
				}).then(res => {
					let tuanduiListNew = [];
					let len = res.data.list.length;
					tuanduiListNew = tuanduiList.concat(res.data.list);
					that.page++;
					that.$set(that, 'tuanduiList', tuanduiListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
			
				});
			},
			sectionChange(index) {
				this.current = index;
				this.search()
			},
			search(){
				let that=this
				that.limit=8;
				that.page=1;
				that.tuanduiList=[];
				if(this.current==0){
					this.getMyTuanduis()
				}else if(this.current==1){
					this.getMyAddTuanduis()
				}
			},
			getmore(){
				if(this.current==0){
					this.getMyTuanduis()
				}else if(this.current==1){
					this.getMyAddTuanduis()
				}
			},
			manager:function(item){
				if(item.status==0){
					uni.navigateTo({
						url: "/pages/usersWmsj/tuanduiList/manager?groupId="+item.groupId
					})
				}else{
					uni.showToast({
						title:"审核中"
					})
				}
			},
			goTuandui:function(item){
				if(item.status==0){
					uni.navigateTo({
						url: "/pages/usersWmsj/tuanduiList/detail?groupId="+item.groupId
					})
				}else{
					uni.showToast({
						title:"审核中"
					})
				}
			},
			
			tuichu:function(item){
				let groupId=item.groupId
				uni.showModal({
					content:'您确认退出【'+item.groupName+'】吗？',
					cancelColor: '#000000',
					confirmColor: '#526BB1',
					success: function (res) {
						if (res.confirm) {
							//点击确认的操作
							tuanduiTuiChuUser(groupId).then(res => {
								uni.showToast({
									title: res.message,
									duration: 4000,
									icon:'none'
								})
								this.search(groupId)
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
	.page-index	.header {
		width: 100%;
		background-color: $theme-color;
		padding: 28rpx 30rpx;
	}
	.page-index	.header	.serch-wrapper {
		align-items: center;
	}
	.page-index	.header	.serch-wrapper .logo {
		width: 200rpx;
		height: 42rpx;
		margin-right: 24rpx;
		color: white;
		font-size: 40rpx;
		line-height: 40rpx;
	}

	.page-index	.header	.serch-wrapper image {
		width: 200rpx;
		height: 42rpx;
	}

	.page-index	.header	.serch-wrapper .input {
		display: flex;
		align-items: center;
		width: 700rpx;
		height: 58rpx;
		padding: 0 0 0 30rpx;
		background: rgba(247, 247, 247, 1);
		border: 1px solid rgba(241, 241, 241, 1);
		border-radius: 29rpx;
		color: #BBBBBB;
		font-size: 26rpx;
	}

	.page-index	.header	.serch-wrapper .input .iconfont {
		margin-right: 20rpx;
		font-size: 26rpx;
		color: #666666;
	}
			
	.tuanduiList{
		background-color: white;
	}
	
	.tuanduiList .list .item {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
		
	}
	
	.tuanduiList .list .item .pictrue {
		width: 140rpx;
		height: 140rpx;
	}
	
	.tuanduiList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}
	
	.tuanduiList .list .item .text {
		width: 530rpx;
		height: 140rpx;
		font-size: 24rpx;
		color: #999;
	}
	
	
	.tuanduiList .list .item .text .name {
		font-size: 30rpx;
		color: #282828;
		display: inline;
	}
	.tuanduiList .list .item .text .status {
		
		font-size: 24rpx;
		color: #ff0000;
		display: inline;
	}
	.tuanduiList .list .item .tuichu {
		width: 140rpx;
		height: 40rpx;
		line-height: 40rpx;
		color: white;
		background: #f08807;
		text-align: center;
		border-radius: 20rpx;

	}
	.tuanduiList .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
</style>
