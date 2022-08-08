<template>
	<view>
		<skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton"
				bgcolor="#FFF"></skeleton>
		<view class='newsList skeleton page-index' :style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
			<view class="header">
				<!-- #ifdef  APP-PLUS -->
				<view class="sys-head" :style="{ height: statusBarHeight }"></view>
				<!-- #endif -->
				<view class="serch-wrapper flex">	
					<view class="logo">
						双桥融媒-直播点播
					</view>
				</view>
			</view>
			
			<view class='list' v-if="showVideos"> 
				<block  v-for="(item,index) in articleList" :key="index"> 
					<!--没有图片的文章-->
					<view v-if="(item.videoPath !=null && item.videoPath !='')" hover-class='none' class='vedioItem acea-row row-between-wrapper'>
						
						<view class='text acea-row row-column-between'>
							<view class='name line2 skeleton-rect'>
								{{item.title}}
							</view>
						</view>
						
						<view class='skeleton-rect'>
							<video :data-id="`video_${item.id}`" :id="`video_${item.id}`" ref="`video_${item.id}`" @play="playing" 
							class='videopic' style="width: 700rpx;" :poster="item.imageInputs[0]" :src="item.videoPath"
							 object-fit="fill" show-loading="true" show-center-play-btn="true" autoplay="false" controls="true"
							 auto-pause-if-navigate=true codec="hardware" http-cache="true"
							 :style="{width: '700rpx',height: (item.videoHeight/item.videoWidth)*700 + 'rpx'}"
							 ></video>
						</view>
						
						
						<view class='text acea-row row-column-between'>
							<view class="time skeleton-rect" style="display: flex;">
								<view style="width: 50%;height: 40rpx;text-align: left;padding-left: 30rpx;">{{item.author}}&nbsp;&nbsp;{{item.visit}}播放</view>
								<view style="width: 40%;height: 40rpx;">{{item.createTime}}</view>
							</view>
						</view>
					</view>	
				</block>
			</view>
			<uni-load-more :status="more" @clickLoadMore="getArticleVedio" ></uni-load-more>
		</view> 
		<view class='noCommodity' v-if="articleList.length == 0 && (page != 1 || active== 0) ">
			<view class='pictrue'>
				<image src='../../../static/images/noNews.png'></image>
			</view>
		</view>
		<home></home>
	</view>
</template>

<script>
	import {
		getArticleVedioList
	} from '@/api/api.js';
	import home from '@/components/home';
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	export default {
		components: {
			'home':	home
		 },
		data() {
			return {
				statusBarHeight: statusBarHeight,
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				imgUrls: [{imageInputs:[]}],
				articleList: [{imageInput:'',imageInputs:[],title: '占位占位',createTime:'占位'}],
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				navList: [],
				huatiList: [],
				zhuantiList: [],
				active: 0,
				page: 1,
				limit: 8,
				more:"more",
				scrollLeft: 0,
				isShow: false,
				theme:'theme1',
				currentId:'',
				showVideos:false
			}
		},
		onLoad(){
			let that = this;
			uni.getStorage({
			    key: 'theme',
			    success: function (res) {
			        that.theme = res.data;
			    }
			});
			setTimeout(() => {
				//this.couponsList =  [{name:''}]
				this.isNodes++;
			}, 500);

			this.more="more",
			this.page = 1;
			this.articleList = [];
			this.getArticleVedio();
			setTimeout(() => {
				this.showSkeleton = false
			}, 1000)
			
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			//console.log(this.currentId)
			this.showVideos=true
			setTimeout(() => {
				uni.createVideoContext(this.currentId).play()
			}, 1000)
			
			
		},
		onHide:function() {
			this.showVideos=false
		},
		onTabItemTap:function() {
			
		},
		/**
		   * 页面上拉触底事件的处理函数
		*/
		onReachBottom: function () {
			this.getArticleVedio();
		},
		methods: {
			gopage(item){
				//console.log(item);
				//url="/pages/news_details/zhuanti?id="+item.id
				url="/pages/news_details/vedio?id="+item.id
				uni.navigateTo({
					url:"/pages/news_details/vedio?id="+item.id
				})	
			},
			getArticleVedio: function() {
				let that = this;
				let limit = that.limit;
				let page = that.page;
				let articleList = that.articleList;
				
				getArticleVedioList( {
					page: page,
					limit: limit
				}).then(res => {
					let articleListNew = [];
					let len = res.data.list.length;
					articleListNew = articleList.concat(res.data.list);
					that.page++;
					that.$set(that, 'articleList', articleListNew);
					that.page = that.page;
					that.isShow = true;
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
					
				});
			},
			playing(e) {
				// 获取当前视频id
				let currentId = e.currentTarget.dataset.id
				this.currentId=currentId
				console.log(this.currentId)
	
				// 获取json对象并遍历, 停止非当前视频
				let trailer = this.articleList
				for (let i = 0; i < trailer.length; i++) {
					let temp = "video_"+trailer[i].id
					  if (temp !== currentId) {
						uni.createVideoContext(temp).pause()
					}
				}
			},
			
			trigerPlay(e) {
				// 获取当前视频id
				let currentId = e.currentTarget.dataset.id
				this.currentId=currentId
				console.log(this.currentId)
				// uni.createVideoContext获取视频上下文对象
				this.videoContent = uni.createVideoContext(currentId)
				// 获取json对象并遍历, 停止非当前视频
				let trailer = this.articleList
				for (let i = 0; i < trailer.length; i++) {
					let temp = "video_"+trailer[i].id
					console.log(temp)
					  if (temp !== currentId) {
						uni.createVideoContext(temp).pause()
					}
				}
			}
		
		}
	}
</script>
 
<style lang="scss">
	
	
	.newsList .list .vedioItem {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		/*padding: 15rpx 0;*/
		
	}


	.newsList .list .vedioItem .videopic {
		border-radius: 20rpx;
	}

	.newsList .list .vedioItem .text {
		width: 700rpx;
		padding: 20rpx 20rpx
	}
	
	.newsList .list .vedioItem .text .name {
		line-height: 50rpx;
		font-size: 32rpx;
		color: #7d7d7d;
	}
	
	.newsList .list .vedioItem .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 5rpx;
	}
	
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
		width: 750rpx;
		height: 42rpx;
		margin-right: 24rpx;
		color: white;
		font-size: 40rpx;
		line-height: 40rpx;
		text-align: center;
	}

	.page-index	.header	.serch-wrapper image {
		width: 200rpx;
		height: 42rpx;
	}

	.page-index	.header	.serch-wrapper .input {
		display: flex;
		align-items: center;
		width: 450rpx;
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
			
	
	page {
		background-color: #fff !important;
	}

	.newsList .swiper {
		width: 100%;
		position: relative;
		box-sizing: border-box;
		padding: 10rpx 30rpx;
		
	}

	.newsList .swiper swiper {
		width: 100%;
		height: 365rpx;
		position: relative;
	}

	.newsList .swiper .slide-image {
		width: 100%;
		height: 335rpx;
		border-radius: 14rpx;
	}
	// #ifdef MP-WEIXIN
	.newsList .swiper .wx-swiper-dot {
		width: 12rpx !important;
		height: 12rpx !important;
		border-radius: 0;
		transform: rotate(-45deg);
		transform-origin: 0 100%;
	}
	
	.newsList .swiper .wx-swiper-dot~.wx-swiper-dot {
		margin-left: 5rpx;
	}

	.newsList .swiper .wx-swiper-dots.wx-swiper-dots-horizontal {
		margin-bottom: -15rpx;
	}
	// #endif
	// #ifdef APP-PLUS || H5
	.newsList .swiper .uni-swiper-dot {
			width: 12rpx !important;
			height: 12rpx !important;
			border-radius: 0;
			transform: rotate(-45deg);
			transform-origin: 0 100%;
	}
	
	.newsList .swiper .uni-swiper-dot~.uni-swiper-dot {
		margin-left: 5rpx;
	}
	
	.newsList .swiper .uni-swiper-dots.uni-swiper-dots-horizontal {
		margin-bottom: -15rpx;
	}
	// #endif
	.newsList .nav {
		padding: 0 24rpx;
		width: 100%;
		white-space: nowrap;
		box-sizing: border-box;
		margin-top: 43rpx;
	}

	.newsList .nav .item {
		display: inline-block;
		font-size: 32rpx;
		color: #999;
	}

	.newsList .nav .item.on {
		color: #282828;
	}

	.newsList .nav .item~.item {
		margin-left: 46rpx;
	}

	.newsList .nav .item .line {
		width: 24rpx;
		height: 4rpx;
		border-radius: 2rpx;
		margin: 10rpx auto 0 auto;
		@include main_bg_color(theme);
	}




	.newsList .list .item0 {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
	}
	.newsList .list .item0 .text {
		width: 700rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}

	.newsList .list .item0 .text .name {
		font-size: 30rpx;
		color: #282828;
		display: inline;
	}

	.newsList .list .item0 .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
	
	
	
	.newsList .list .item {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
	}

	.newsList .list .item .pictrue {
		width: 250rpx;
		height: 160rpx;
	}

	.newsList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}

	.newsList .list .item .text {
		width: 450rpx;
		height: 160rpx;
		font-size: 24rpx;
		color: #999;
	}

	.newsList .list .item .text .name {
		font-size: 30rpx;
		color: #282828;
		display: inline;
	}


	.newsList .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
	.newsList .list .item3 {
		margin: 0 25rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
	}
	
	
	.newsList .list .item3 .text {
		width: 700rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	
	.newsList .list .item3 .text .name {
		font-size: 30rpx;
		color: #282828;
		display: inline;
	}
	.newsList .list .item3 .picList {
		width: 700rpx;
		height: 180rpx;
	}
	.newsList .list .item3 .picList .pictrue1 {
		width: 227rpx;
		height: 160rpx;
		margin-top: 30rpx;
		float: left
	}
	
	.newsList .list .item3 .picList .pictrue1 image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
		border-bottom-left-radius: 10rpx;
		border-top-left-radius: 10rpx;
		
	}
	
	.newsList .list .item3 .picList .pictrue2 {
		width: 227rpx;
		height: 160rpx;
		margin-top: 30rpx;
		float: left;
		margin-left: 10rpx;
	}
	.newsList .list .item3 .picList .pictrue2 image {
		width: 100%;
		height: 100%;
	}
	.newsList .list .item3 .picList .pictrue3 {
		width: 227rpx;
		height: 160rpx;
		margin-top: 30rpx;
		float: left;
		margin-left: 10rpx;
	}
	.newsList .list .item3 .picList .pictrue3 image {
		width: 100%;
		height: 100%;
		border-bottom-right-radius: 10rpx;
		border-top-right-radius: 10rpx;
	}
	
	.newsList .list .item3 .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
	
	.zhuantiicon{
		width: 60rpx;
		line-height: 40rpx;
		display: inline;
		float: left;
		background-color:  #e93323;
		color: #fff;
		font-size: 25rpx;
		border-radius: 20rpx;
		
	}
	.huatiicon{
		width: 100rpx;
		line-height: 40rpx;
		display: inline;
		float: left;
		background-color: #e93323;
		color: #fff;
		font-size: 25rpx;
		border-radius: 20rpx;
		text-align: center;
		
	}
</style>
