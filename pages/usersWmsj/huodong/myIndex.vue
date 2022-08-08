<template>
	<view  class="page-index">
		<view class="header">
			<view class="serch-wrapper flex">	
				<u-search  placeholder="输入关键字搜索活动" :actionStyle="actionStyle"
				 v-model="keyword" @custom="search" @search="search"></u-search>
			</view>
		</view>
	 
		<u-subsection class="tabBar"  style=" height: 80rpx;border-bottom: 1px solid #e5e5e5;" :list="navList"  
			 @change="sectionChange" mode="button" bgColor="#fff" activeColor="#E93323" :current="current" fontSize="15" :bold="false"></u-subsection>
		 

		<view class="huodongList skeleton">
			<view class='list' v-if="huodongList">
				<block  v-for="(item,index) in huodongList" :key="index"> 
					<!--一张图片的文章-->
					<view hover-class='none' class='item acea-row row-between-wrapper'>
						<view @click="goActivity(item)" class='pictrue skeleton-rect'>
							<!--显示我的活动差几天几小时-->
							<view class='time' v-if="current==0&&item.startHours>1">
								 还差{{Math.floor(item.startHours/24)}}天{{item.startHours%24}}小时开始
							</view>
							<view v-else class='time'>
								{{item.startTime.substring(0,16)}}至{{item.endTime.substring(0,16)}}
							</view>
							
							<view :class='item.activityState==50 ? "statuson":"status"' >
								<dict-tag :options="dict.type.wmsj_activity_jindu" :value="item.activityState"/>
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
						<view class='buttons line2 skeleton-rect' v-if="(current==0||current==1)&&(item.activityState==30||item.activityState==40||item.activityState==50||item.activityState==60)">
	
							<view style="float: right;width: auto;" v-if="item.startHours>1"   >
								<u--text type="warning" text="活动开始前1小时后可进行签到"></u--text>									
							</view>
							
							
							<view style="float: right;width: auto;" v-if="item.myStatus==10" >
								<u-button icon="share-square" type="primary" size="mini" shape="circle" 
								:plain="true" text="已签到可签退" @click="qiantui(item.activityId)"></u-button>
							</view>
							
							<view style="float: right;width: auto;"  v-if="item.startHours<=1&&
																			item.endHours<=-1&& 
																			item.myStatus==0&&
																			item.activityState!=60"   >
								<u-button icon="checkbox-mark" type="primary" size="mini" shape="circle"  
								:plain="true" text="签到" @click="qiandao(item.activityId)"></u-button>
							</view> 
							
							<view style="float: right;width: auto;"  v-if="item.myStatus==20"   >
								<u-button icon="checkbox-mark" type="default" :disabled="true"  shape="circle"  
									:plain="true" text="个人已完成,活动结束后发放时长和积分"></u-button>
							</view> 
						</view> 
					</view>
				</block>
			</view>
			<uni-load-more :status="more" @clickLoadMore="gengduo" ></uni-load-more>
		</view>
		
	</view>
</template>

<script>
	import {getPaidanList,getDiandanList,getMyHuodongList,getMyHuodongOverList} from '@/api/wmsj.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif 
	
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	
	export default {
		components: {
			'uni-load-more':loadMore
		 },
		computed: mapGetters(['isLogin','isWmsj', 'uid', 'userInfo']),
		dicts: ['wmsj_activity_jindu'],
		data() {
			return { 
				current:0,
				navList:['已报名', '已完成', '待接派单'],
				huodongList: [],
				page: 1,
				limit: 8, 
				more :"noMore",
				keyword: '',
				actionStyle: {'color':'#fff','font-size':'35rpx'}
			}
		},
		onShow(option){
			this.search()
		},
		
		/**
		   * 页面上拉触底事件的处理函数
		*/
		onReachBottom: function () {
			this.gengduo();
		},
		methods: {
			onPullDownRefresh() {
				this.search()
				setTimeout(function () {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			//已报名
			getMyHuodongs(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let huodongList = that.huodongList;
				getMyHuodongList({
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
			//已完成
			getMyHuodongOvers(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let huodongList = that.huodongList;
				getMyHuodongOverList({
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
		
			//待接单
			getPaidans(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let huodongList = that.huodongList;
				
				getPaidanList({
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
			sectionChange(index) {
				this.current = index;
				this.search()
			},
			search:function(){
				let that=this
				that.limit=8;
				that.page=1;
				that.huodongList=[];
				if(this.current==0){
					this.getMyHuodongs()
				}else if(this.current==1){
					this.getMyHuodongOvers()
				}else if(this.current==2){
					this.getPaidans()
				}
			},
			gengduo:function(){
				if(this.current==0){
					this.getMyHuodongs()
				}else if(this.current==1){
					this.getMyHuodongOvers()
				}else if(this.current==2){
					this.getPaidans()
				}
			},
			goActivity(item){
				uni.navigateTo({
					url: "/pages/usersWmsj/huodong/detail?activityId="+item.activityId
				})		
			},
			qiandao(activityId){
				uni.navigateTo({
					url: "/pages/usersWmsj/daka/index?activityId="+activityId+"&type=qiandao"
				})	
			},
			qiantui(activityId){
				uni.navigateTo({
					url: "/pages/usersWmsj/daka/index?activityId="+activityId+"&type=qiantui"
				})	
			}
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
	
	.page-index	.header {
		position: fixed;
		width: 100%;
		background-color: #E93323;
		padding: 28rpx 30rpx;
		z-index: 9999999999;
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
	.page-index	.tabBar {
		background: #ffffff;
		position: fixed;
		top:110rpx;
		z-index: 9999999999;
	}		
			
	.page-index	.searchBar {
		
	
		//height: 100rpx;
	}
	
			
	.huodongList{
		width: 750rpx;
		background-color: white;
		margin-top:170rpx;
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
		right: 25rpx;
		color: #e8e8e8;
		font-size: 24rpx;
		background-color: rgb(16 16 16 / 41%);
		padding: 10rpx 20rpx;
		border-radius: 0rpx;
		width: auto;
		height: 50rpx;
		text-align: right;
	}
	
	.huodongList .list .item .pictrue .status {
		position: absolute;
		z-index: 6666;
		left: 24rpx;
		color: #e8e8e8;
		font-size: 24rpx;
		background-color: rgb(16 16 16 / 41%);
		background: linear-gradient(to right , rgb(16 16 16 / 60%) ,rgb(16 16 16 / 25%));
		padding: 10rpx 20rpx;
		border-radius: 0rpx;
		width: auto;
		height: 50rpx;
		text-align: right;
	}
	.huodongList .list .item .pictrue .statuson {
		position: absolute;
		z-index: 6666;
		left: 24rpx;
		color: #e8e8e8;
		font-size: 24rpx;
		background-color: rgb(16 16 16 / 41%);
		
		background: linear-gradient(to right , rgb(251 5 5 / 60%) ,rgb(236 208 136 / 25%));
		padding: 10rpx 20rpx;
		border-radius: 0rpx;
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
	.huodongList .list .item .buttons {
		text-align: right;
		width: 700rpx;
	}
	
</style>
