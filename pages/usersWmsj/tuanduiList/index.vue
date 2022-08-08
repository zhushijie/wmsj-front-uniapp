<template>
	<view  class="page-index">
		<view class="header">
			<!-- #ifdef  APP-PLUS -->
			<view class="sys-head" :style="{ height: statusBarHeight }"></view>
			<!-- #endif -->
			<view class="serch-wrapper flex">	
				<u-search  placeholder="搜索志愿者团队" :actionStyle="actionStyle" v-model="keyword" @custom="search" @search="search"></u-search>
			</view>
		</view>
		<view class="tuanduiList skeleton">
			<view class='list' v-if="tuanduiList">
				<block  v-for="(item,index) in tuanduiList" :key="index"> 
					<!--一张图片的文章-->
					<view @click="goTuandui(item.groupId)" hover-class='none' class='item acea-row row-between-wrapper'>
						<view class='pictrue skeleton-rect'>
							<image :src='item.logo'></image>
						</view>
						<view class='text acea-row row-column-between'>
							<view class='name line2 skeleton-rect'>
								{{item.groupName}}
							</view>
							<view class="skeleton-rect">团队类型：{{item.groupType}}
							 &nbsp; &nbsp;服务领域：{{item.groupLingyu}}</view>
							 
							<view class="skeleton-rect">
							 服务时长：{{item.serviceNum}}&nbsp; &nbsp;所在地区：{{item.orgName}}</view>
						</view>
						
					</view>
				</block>
			</view>
		</view>
		<uni-load-more :status="more" @clickLoadMore="getTuanduis" ></uni-load-more>
	</view>
</template>

<script>
	import {getTuanduiList} from '@/api/wmsj.js';
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
		 
		data() {
			return { 
				tuanduiList: [],
				page: 1,
				limit: 8, 
				more :"noMore",
				keyword: '',
				actionStyle: {'color':'#fff','font-size':'35rpx'}
			}
		},
		onLoad(){
			this.getTuanduis()
		},
		onReachBottom: function () {
			this.getTuanduis();
		},
		methods: {
			getTuanduis(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let tuanduiList = that.tuanduiList;
				
				getTuanduiList({
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
			search:function(groupId){
				let that=this
				that.limit=8;
				that.page=1;
				that.tuanduiList=[];
				this.getTuanduis()
			},
			goTuandui:function(groupId){
				uni.navigateTo({
					url: "/pages/usersWmsj/tuanduiList/detail?groupId="+groupId
				})
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
	
	
	.tuanduiList .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
</style>
