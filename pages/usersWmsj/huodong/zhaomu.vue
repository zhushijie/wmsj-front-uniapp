<template>
	<view  class="page-index">
	
		<view class="searchBar">
			<zero-filter-bar  ref="zeroFilterBar" :dataList="filterList" :autoJustify="true" @filter='handleFilterItem' @extraClick='showDrawer()'></zero-filter-bar>
			<!-- 右侧按钮可结合uni-drawer抽屉使用 -->
			<uni-drawer ref="showRight" mode="right" :width="320">
				<scroll-view style="height: 100%;padding: 20rpx;" scroll-y="true">
					<view class="footer zero-flex" style="font-size: 30rpx;line-height: 60rpx;">选择筛选条件</view>
			
					<u-search shape="round" placeholder="请输入活动关键字" v-model="keyword" :show-action="false"></u-search>
					<view class="footer zero-flex" style="margin-top: 20rpx;" >
						<u-button style="width: 150rpx;float: right;margin-right: 20rpx;" icon="checkmark" type="success"   text="确定"  @click="handleFilterExtra()"></u-button>
						<u-button style="width: 150rpx;float: right;margin-right: 20rpx;"  class="btn_reset" icon="trash" type="primary"   text="重置"></u-button>							
					</view>
				</scroll-view>
			</uni-drawer>
		</view>
		
		<view class="huodongList skeleton">
			<view class='list' v-if="huodongList">
				<block  v-for="(item,index) in huodongList" :key="index"> 
					<!--一张图片的文章-->
					<view hover-class='none' class='item acea-row row-between-wrapper'>
						<view @click="goActivity(item)" class='pictrue skeleton-rect'>
							<view class='time'>
								{{item.startTime.substring(0,16)}}至{{item.endTime.substring(0,16)}}
							</view>
							<image :src='item.activityImages'></image>
							
						</view>
						<view @click="goActivity(item)">
							<view class='name line2 skeleton-rect'>
								{{item.activityName}}
							</view> 
							<view class='prop line2 skeleton-rect'>
								<view class="weizhi skeleton-rect">
									<text class='iconfont icon-weizhi'></text>{{item.activityAddress}} 
									
								</view>
								<view class="renshu skeleton-rect">
									<text class='iconfont icon-tuandui'> </text>招募 {{item.maxNumber}}人
								</view>
								<view class="leixing skeleton-rect">
									<text class='iconfont icon-dijiachangxuan'></text>{{item.serviceType}}
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<uni-load-more :status="more" @clickLoadMore="getPaidans" ></uni-load-more>
		</view>
		
		
		
	</view>
</template>

<script>
	import {getZhaomuList} from '@/api/wmsj.js';
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
				huodongList: [],
				page: 1,
				limit: 8, 
				more :"noMore",
				keyword: '',
				actionStyle: {'color':'#fff','font-size':'35rpx'},
				filterList: [
					{
						id: 0,
						name: '发布时间',
						sort: true
					},
					{
						id: 1,
						name: '报名人数',
						sort: true
					},
					{
						id: 3,
						name: '奖励积分',
						sort: true
					} 
				],
				// 如果顶部还有内容，且需要吸顶效果，可以传入needSticky
				needSticky:false
			}
		},
		onLoad(){
			this.getZhaomus()
		},

		// 页面上拉触底事件的处理函数
		onReachBottom: function () {
			this.getZhaomus()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.search()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			
			getZhaomus(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let huodongList = that.huodongList;
				
				getZhaomuList({
					page: page, 
					limit: limit,
					groupName: that.keyword
				}).then(res => {
					let huodongListNew = [];
					let len = res.data.list.length;
					huodongListNew = huodongList.concat(res.data.list);
					that.page++;
					that.$set(that, 'huodongList', huodongListNew);
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
				that.huodongList=[];
				this.getZhaomus()
			},
			manager:function(item){
				if(item.status==0){
					uni.navigateTo({
						url: "/pages/usersWmsj/huodongList/manager?groupId="+item.groupId
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
						url: "/pages/usersWmsj/huodongList/detail?groupId="+item.groupId
					})
				}else{
					uni.showToast({
						title:"审核中"
					})
				}
				
			},
			goActivity(item){
				uni.navigateTo({
					url: "/pages/usersWmsj/huodong/detail?activityId="+item.activityId
				})		
			},
			 handleFilterItem(index,desc,item){
				console.log(index,desc,item)
			},

			handleFilterExtra() {
				// 确认自定义筛选事件后，高亮右侧按钮
				this.$refs.zeroFilterBar.setCurrentExtraOn()
				this.closeDrawer();
			},
			showDrawer() {
				this.$refs.showRight.open();
			},
			closeDrawer() {
				this.$refs.showRight.close();
			},
			Scroll(e) {
				let top =this.$refs.zeroFilterBar.scrollTop
				this.needSticky= e.scrollTop > top
			},
			
		}
	}
</script>

<style>
	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		background-color: #ffffff;
	}
	.page-index	.searchBar {
		
	
		//height: 100rpx;
	}
	
			
	.huodongList{
		width: 750rpx;
		background-color: white;
		margin-top:80rpx;
		border-top: 1px solid #e5e5e5;
	}
	
	.huodongList .list .item {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
		
	}
	
	.huodongList .list .item .pictrue {
		width: 750rpx;
		height: 420rpx;
		
	}
	.huodongList .list .item .pictrue .time {
		position: absolute;
		z-index: 6666;
		right: 30rpx;
		color: #e8e8e8;
		font-size: 24rpx; 
		background-color: rgb(16 16 16 / 41%);
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		width: auto;
		height: 50rpx;
		text-align: right;
	}
	.huodongList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 2rpx;
	}
	

	 
	.huodongList .list .item .name {
		width: 750rpx; 
		font-size: 30rpx;
		font-weight:700;
		line-height: 60rpx;
		padding: 10rpx;
	}
	.huodongList .list .item .prop {
		
	}
	
	.huodongList .list .item .prop .weizhi{
		width: 350rpx;
		font-size: 24rpx;
		color: #969696;
		float: left;
	}
	.huodongList .list .item .prop .renshu{
		width: 200rpx;
		font-size: 24rpx;
		color: #969696;
		float: left;
		text-align: center;
	}
	.huodongList .list .item .prop .leixing{
		width: 200rpx;
		font-size: 24rpx;
		color: #969696;
		float: left;
	}
	
</style>
