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
						双桥融媒
					</view>
					<navigator url="/pages/news_search/index" class="input" hover-class="none"><text
							class="iconfont icon-xiazai5"></text>
						大家都在搜</navigator>
				</view>
			</view>
			<!--横向滑动菜单-->
			<vgt-tab :list="navList"  v-if="navList.length > 0"  @onValueChange="tabSelect" @onListShow="swichTab" :huatiList="huatiList" :zhuantiList="zhuantiList"></vgt-tab>
			
			<!--幻灯片-->
			<view class='swiper' v-if="imgUrls.length > 0 && !showTabList && active===0">
				<swiper indicator-dots="true" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration"
				 indicator-color="rgba(102,102,102,0.3)" indicator-active-color="#666">
					<block v-for="(item,index) in imgUrls" :key="index">
						<swiper-item>
							<navigator :url="'/pages/news_details/index?id='+item.id">
								<image :src="item.imageInputs[0]" class="slide-image" />
							</navigator>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<view class="service " v-if="active==0">
				<view class="service_title ">
					<view class="left_con skeleton-rect">
						<image src="../../static/tabBar/service.png" style="" lazy-load></image>
						<view class="title">服务</view>
					</view>
					
					<navigator style="display: none;" class='item skeleton-rect' url='/pages/fuwu/index' hover-class='none'>
						<text class="right_con">查看更多</text>
						<text class="iconfont icon-gengduo3 right_con"></text>
					</navigator>
				</view>
				
				<!-- 服务menu -->
				<view class='nav acea-row' @click.native="bindEdit('indexMenu')">
					<block v-for="(item,index) in serviceMenu" :key="index">
						<view class='item' @click="menusTap(item.url,item.name)">
							<view class='pictrue skeleton-radius'>
								<image :src='item.pic'></image>
							</view>
							<view class="menu-txt skeleton-rect">{{item.name}}</view>
						</view>
					</block>
				</view>
			</view>
			
			
			
			<block v-for="(zhaunti,index) in zhuantis" :key="index">
				<view class="yiqing" v-if="active==0" >
					<navigator class='item skeleton-rect' :url="zhaunti.link" hover-class='none'>
						<view class="yiqing_title ">
							<view class="left_con skeleton-rect">
								<image :src="zhaunti.icon" style="" lazy-load></image>
								<view class="title">{{zhaunti.title}}</view>
							</view>
							<view class='item skeleton-rect' >
								<text class="right_con">进入专题</text>
								<text class="iconfont icon-gengduo3 right_con"></text>
							</view>
						</view>
					</navigator>
					<!--疫情专题-->
					<view class='nav acea-row'>
						<image :src="zhaunti.image"  style="width: 700rpx; height:466rpx;"></image>
					</view>
				</view>
			</block>
			
			<view class='list' v-if="!showTabList">
				<articleFullList :articleList="articleList"></articleFullList>
				<uni-load-more :status="more" @clickLoadMore="getCidArticle" ></uni-load-more>
			</view>
		</view>
		<view class='noCommodity' v-if="articleList.length == 0 && (page != 1 || active== 0) && !showTabList">
			<view class='pictrue'>
				<image src='../../static/images/noNews.png'></image>
			</view>
		</view>
	</view> 
</template>

<script>

	const app = getApp({allowDefault: true})
	console.log(app.globalData) 
	import vgtTab from './components/vgt-tab/vgt-tab.vue'
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	 
	import {
		getArticleCategoryList,
		getArticleCategoryTopList,
		getArticleCategoryListByPid,
		getZhuantiCategoryList,
		getHuatiCategoryList,
		getArticleList,
		getArticleHotList,
		getArticleBannerList,
		getMenusData,
		getAppVersion,
	} from '@/api/api.js';
	import home from '@/components/home';
	import {goPage} from '@/libs/iframe.js'
	import articleFullList from '@/components/articleFullList';
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	
	export default {
		components: {
		    'vgt-tab': vgtTab,
			'home':	home,
			'articleFullList':articleFullList,
			'uni-load-more':loadMore
		 },
		data() {
			return {
				appUpdate: {},
				showTabList:false,
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
				active: 0, //是否显示新闻
				page: 1,
				hotpage:1, //热点新闻当前页
				limit: 8, //热点新闻刷新
				more:"more",
				scrollLeft: 0,
				isShow: false,
				theme:'theme1',
				serviceMenu: [{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''},{url:'',pic:'',id: '',name:''}],
				zhuantis:[]
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
			this.getMenus();
			this.getArticleHot();
			this.getArticleBanner();
			this.getArticleCate();
			this.getZhuantiCategory()
			this.getHuatiCategory()
			this.more="more"
			this.page = 1;
			this.articleList = [];
			this.getCidArticle();
			this.appVersionConfig(); //APP版本检测
		},
		/**
		 * 生命周期函数--监听页面显示 
		 */
		onShow: function() {
			// #ifdef MP || APP-PLUS
			setTimeout(() => {
				if (this.appUpdate.openUpgrade == 'true') {
					this.appVersionConfig();
				}
			}, 1000)
			// #endif
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(() => {
				//this.couponsList =  [{name:''}]
				this.isNodes++;
			}, 500);
			this.getMenus();
			this.getArticleHot();
			this.getArticleBanner();
			this.getArticleCate();
			this.getZhuantiCategory()
			this.getHuatiCategory()
			this.more="noMore"
			this.page = 1;
			this.articleList = [];
			this.hotpage=1
			this.getCidArticle();
			
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		/**
		   * 页面上拉触底事件的处理函数
		*/
		onReachBottom: function () {
			this.getCidArticle();
		},
		methods: {
			getMenus(){
				let that=this
				getMenusData().then(res => {
					that.$set(that, "serviceMenu", res.data.serviceMenus);
					that.$set(that, "zhuantis", res.data.zhuanti);

				});
			},
			
			tabSelect(data) {
				//console.log(data)
				this.active = data.id;
				if (this.active == 0){
					this.getArticleHot();
				} 
				else {
					this.$set(this, 'articleList', []);
					this.page = 1;
					this.more="noMore";
					this.getCidArticle();
				}
			},
			swichTab(showTabList){
				console.log(!showTabList)
				this.showTabList=!showTabList;
			},
			getArticleHot: function() {
				let that = this;
				getArticleHotList().then(res => {
					that.$set(that, 'articleList', res.data.list);
				});
			},
			getArticleBanner: function() {
				let that = this;
				getArticleBannerList().then(res => {
					that.imgUrls = res.data.list;
					setTimeout(() => {
						this.showSkeleton = false
					}, 1000)
				});
			},
			getCidArticle: function() {
				let that = this;
				this.more="loading"
		
				if (that.active == 0) 
				{
					let limit = that.limit;
					let hotpage = that.hotpage;
					let articleList = that.articleList;
					getArticleHotList({
						page: hotpage,
						limit: limit
					}).then(res => {
						let articleListNew = [];
						let len = res.data.list.length;
						articleListNew = articleList.concat(res.data.list);
						that.hotpage++;
						that.$set(that, 'articleList', articleListNew);
						that.isShow = true;
						if(limit > len){
							that.more="noMore"
						}else{
							that.more="more"
						}
					});
				}else{
					let limit = that.limit;
					let page = that.page;
					let articleList = that.articleList;
					getArticleList(that.active, {
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
				}
				
				
			},
			getArticleCate: function() {
				let that = this;
				getArticleCategoryList().then(res => {
					let list = res.data.list;
					list.unshift({id:0,name:'首页'});
					that.$set(that, 'navList', list);
					setTimeout(() => {
						this.showSkeleton = false
					}, 1000)
				});
			},
			getZhuantiCategory: function() {
				let that = this;
				getZhuantiCategoryList().then(res => {
					that.$set(that, 'zhuantiList', res.data.list);
				});
			},
			getHuatiCategory: function() {
				let that = this;
				getHuatiCategoryList().then(res => {
					that.$set(that, 'huatiList', res.data.list);
				});
			},
			menusTap(url,title) { 
				if(url.indexOf("http")!=-1){
					console.log("三方页面")
					uni.navigateTo({
						url: "/pages/third_page/third_page?path="+url+"&title="+title
					})
					
				}else{
					goPage().then(res => {
			
						uni.navigateTo({
							url: url
						})
					})
				}
				
			},
			bindEdit(name) {
				if (app.globalData.isIframe) {
					window.parent.postMessage(
						{
							name: name
						},
						'*'
					);
					return;
				}
			},
			
			appVersionConfig() {
				var that = this;
				// #ifdef MP || APP-PLUS
				//app升级
				// 获取本地应用资源版本号  
				getAppVersion().then(res => {
					that.$set(that.appUpdate, 'androidAddress', res.data.androidAddress);
					that.$set(that.appUpdate, 'appVersion', res.data.appVersion);
					that.$set(that.appUpdate, 'iosAddress', res.data.iosAddress);
					that.$set(that.appUpdate, 'openUpgrade', res.data.openUpgrade);
					plus.runtime.getProperty(plus.runtime.appid, function(inf) {
						let nowVersion = (inf.version).split('.').join('');
						let appVersion = (res.data.appVersion).split('.').join('');
						uni.getSystemInfo({
							success: (res) => {
								if (appVersion > nowVersion) {
									uni.showModal({
										title: '更新提示',
										content: '发现新版本，是否前去下载?',
										showCancel: that.appUpdate.openUpgrade ==
											'false' ? true : false,
										cancelColor: '#eeeeee',
										confirmColor: '#FF0000',
										success(response) {
											if (response.confirm) {
												switch (res.platform) {
													case "android":
														plus.runtime.openURL(that
															.appUpdate
															.androidAddress);
														break;
													case "ios":
														plus.runtime.openURL(encodeURI(
															that.appUpdate
															.iosAddress));
														break;
												}

											}
										}
									});
								}
							}
						})
					});
				})
				// #endif
			},
		}
	}
</script>
 
<style lang="scss">
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


	.newsList .service {
		
	}
	.newsList .service .service_title{
		display: flex;
		justify-content: space-between;
		padding: 24rpx 0rpx;
		margin: 0rpx 24rpx;
	}
	.newsList .service .service_title .left_con{
	
	}
	
	.newsList .service .service_title .left_con .title{
		line-height: 60rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		float: left;
		margin-left: 20rpx;
		    
	}
	
	.newsList .service .service_title .left_con image{
		width: 60rpx;
		height: 60rpx;
		float: left;
		margin-left: 10rpx;
	}
	
	.newsList .service .service_title .right_con{
		font-size: 24rpx;
		font-weight: 400;
		line-height: 45rpx;
		color: #999999;
	}
	.newsList .service .nav {
		padding-bottom: 26rpx;
		background: #fff;
		opacity: 1;
		border-radius: 14rpx;
		width: 100%;
		margin-bottom: 30rpx;
	}
	.newsList .service .nav .item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 20%;
		margin-top: 5rpx;
		
	}
	.newsList .service .nav .item .menu-txt {
		font-size: 24rpx;
		color: #000000;
	}
	.newsList .service .nav .item image {
		width: 82rpx;
		height: 82rpx;
		border-radius: 40rpx;
	}
	
	
	
	.newsList .yiqing {
		
	}
	.newsList .yiqing .yiqing_title{
		display: flex;
		justify-content: space-between;
		padding: 24rpx 0rpx;
		margin: 0rpx 24rpx;
	}
	.newsList .yiqing .yiqing_title .left_con{
	
	}
	
	.newsList .yiqing .yiqing_title .left_con .title{
		line-height: 60rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		float: left;
		margin-left: 20rpx;
		    
	}
	
	.newsList .yiqing .yiqing_title .left_con image{
		width: 60rpx;
		height: 60rpx;
		float: left;
		margin-left: 10rpx;
	}
	
	.newsList .yiqing .yiqing_title .right_con{
		font-size: 24rpx;
		font-weight: 400;
		line-height: 45rpx;
		color: #999999;
	}
	.newsList .yiqing .nav {
		padding-bottom: 26rpx;
		background: #fff;
		opacity: 1;
		border-radius: 14rpx;
		width: 100%;
		margin-bottom: 30rpx;
	}
	.newsList .yiqing .nav .item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 20%;
		margin-top: 5rpx;
		
	}
	.newsList .yiqing .nav .item .menu-txt {
		font-size: 24rpx;
		color: #000000;
	}
	.newsList .yiqing .nav .item image {
		width: 82rpx;
		height: 82rpx;
		border-radius: 40rpx;
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
		height: 375rpx;
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
		margin-top: 10rpx;
	}

	.newsList .nav .item {
		display: inline-block;
		font-size: 32rpx;
		color: #999;
	}

	.newsList .nav .item.on {
		color: #282828;
	}

	.newsList .nav .item {
		margin-left: 46rpx;
	}
	.newsList .nav .item:nth-child(4n+1) {
		margin-left: 0rpx;
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
