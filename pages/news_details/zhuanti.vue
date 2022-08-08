<template>

	<view class='page' :data-theme="theme">
		<view style="width: 750rpx;">
			<img style="width: 750rpx;" :src="zhuantiInfo.extra"></img>
			<view class='title'>{{zhuantiInfo.name}}</view>
		</view>

		<view class='newsDetail'>
			<view :class="fold ? 'synopsis fold' : 'synopsis unfold'">{{zhuantiInfo.description}}</view>
			<view class="show" @click="btn" v-show="fold">展开 </view>
			<view class="show" @click="btn" v-show="!fold">收起 </view>

			<!-- #ifdef H5 -->
			<button class="bnt bg_color" hover-class='none' @click="listenerActionSheet"
				v-if="this.$wechat.isWeixin()">和好友一起分享</button>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<button class="bnt bg_color" open-type="share" hover-class='none'>和好友一起分享</button>
			<!-- #endif -->

		</view>

		<shareInfo @setShareInfoStatus="setShareInfoStatus" :shareInfoStatus="shareInfoStatus"></shareInfo>
		<!--分类导航-->
		<view class='catlist acea-row'>
			<block v-for="(item,index) in subhuati" :key="index">
				<view :class="subhuatiOn==item.id?'item on':'item normal'" :id="'nav_'+item.id"
					@tap="scrollPositon('tab_' + item.id,item.id)">{{item.name}}</view>
			</block>
		</view>
		<!--主分类文章-->
		<view class="subTitle">热点关注</view>
		<articleFullListGodtetail :articleList="articleList"></articleFullListGodtetail>
		<!--子分类文章-->
		<block v-for="(item,index) in subhuati" :key="index">
			<view :id="'tab_'+item.id" class="subTitle">{{item.name}}</view>
			<articleFullListGodtetail v-if="item.articles" :articleList="item.articles.list"></articleFullListGodtetail>
		</block>

		<home></home>
		<view class='line'></view>
		<view>
			<comment-eg :commentObj="{'objId':zhuantiInfo.id,'objType':'news'}" :visit="zhuantiInfo.visit"></comment-eg>
		</view>
	</view>
</template>

<script>
	import {
		getArticleDetails,
		getArticleHotList,
		getCategoryDetails,
		getPCategoryDetails,
		getArticlezhuantiList
	} from '@/api/api.js';
	import {
		getProductDetail
	} from '@/api/store.js';
	import shareInfo from '@/components/shareInfo';
	import home from '@/components/home';
	import parser from "@/components/jyf-parser/jyf-parser";
	import articleFullListGodtetail from '@/components/articleFullList/godetail';
	export default {
		components: {
			shareInfo,
			home,
			articleFullListGodtetail,
			"jyf-parser": parser
		},
		data() {
			return {
				id: 0,
				aid: 0,
				zhuantiInfo: [],
				subhuati: [],
				subhuatiOn: 0,
				store_info: {},
				articleList: [],
				content: '',
				shareInfoStatus: false,
				tagStyle: {
					img: 'width:100%;'
				},
				productId: 0,
				theme: 'theme1',
				onOff: true, //默认开启 展示
				onNO: false, //默认关闭 收起
				fold: true
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.hasOwnProperty('aid')) {
				this.aid = options.aid;

			}
			if (options.hasOwnProperty('id')) {
				this.id = options.id;
			} else {
				// #ifndef H5
				uni.navigateBack({
					delta: 1
				});
				// #endif
				// #ifdef H5
				history.back();
				// #endif
			}
			let that = this;
			uni.getStorage({
				key: 'theme',
				success: function(res) {
					that.theme = res.data;
				}
			});
			this.getArticleOne();
		},
		onShow: function() {
			
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			return {
				title: this.zhuantiInfo.name,
				imageUrl: this.zhuantiInfo.extra,
				desc: this.zhuantiInfo.description,
				path: '/pages/news_details/index?id=' + this.id
			};
		},
		// #endif
		methods: {
			getArticleOne: function() {
				let that = this;
				let curarticle = {}
				getPCategoryDetails({
					id: that.id,
					type: 9
				}).then(res => {
					console.log(res)
					uni.setNavigationBarTitle({
						title: res.data.name.substring(0, 7) + "..."
					});
					that.$set(that, 'zhuantiInfo', res.data);
					let subhuati = res.data.childs
					res.data.childs.forEach(function(row, index) {
						var articleTemp = []
						row.articles.list.forEach(function(row1, index1) {
							
							if (row1.id == that.aid) {
								curarticle = row1;
								res.data.articles.list.unshift(curarticle)
							} else {
								articleTemp.push(row1)
							}
						})
						subhuati[index].articles.list = articleTemp
						that.$set(that, 'subhuati', subhuati);
					})

					//console.log(articleList)
					that.$set(that, 'articleList', res.data.articles.list);


					// #ifdef H5
					if (this.$wechat.isWeixin()) {
						this.setShareInfo();
					}
					// #endif
					//this.getArticlezhuanti(that.id)
				});
			},
			getArticlezhuanti: function(id) {
				let that = this;
				getArticlezhuantiList(id, {
					id: that.id
				}).then(res => {
					let articleList = []
					let arr = res.data.list
					let curarticle = {}
					arr.forEach(function(row, index) {
						if (row.id != that.aid) {
							articleList.push(row)
						} else {
							curarticle = row;
						}
					})
					console.log(articleList)
					articleList.unshift(curarticle)
					that.$set(that, 'articleList', articleList);
				});
			},

			listenerActionSheet() {
				this.shareInfoStatus = true
			},
			setShareInfoStatus() {
				this.shareInfoStatus = false
			},
			setShareInfo: function() {
				let href = location.href;
				let configAppMessage = {
					desc: this.zhuantiInfo.description,
					title: this.zhuantiInfo.name,
					link: href,
					imgUrl: this.zhuantiInfo.extra
				};
				this.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"], configAppMessage);
			},
			btn: function() { // 收起 展开
				this.fold = !this.fold;
			},
			scrollPositon(domId, id) {
				let that = this;
				that.$set(that, 'subhuatiOn', id);
				uni.createSelectorQuery().select("#" + domId).boundingClientRect(function(res) {
					console.log("滚动到====>", domId + "：top" + res.top)
					uni.pageScrollTo({
						scrollTop: res.top,
						duration: 300
					});
				}).exec()
			}

		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #fff !important;
	}

	.page .catlist {
		padding-left: 10rpx;
	}

	.page .catlist .on {
		color: #E93323;
		border: 1rpx solid #fdf3f3;
		background-color: #fdf3f3;
	}

	.page .catlist .normal {
		color: #454545;
		border: 1rpx solid #ececec;
		background-color: #ececec;
	}

	.page .catlist .item {
		font-size: 26rpx;
		font-weight: bold;
		padding: 0 21rpx;
		height: 50rpx;
		border-radius: 30rpx;
		line-height: 50rpx;
		margin: 0 0 20rpx 20rpx;
	}

	.page .subTitle {
		font-size: 30rpx;
		font-weight: bold;
		padding: 20rpx 30rpx;
		height: 60rpx;
	}

	.line {
		border-bottom: 5px solid #eee;
		margin: 10px 0px 0 0px;
	}

	.show {
		text-align: right;
		margin-right: -30rpx;
		margin-top: -40rpx;
	}

	.unfold {}

	.fold {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;

	}

	.title {
		position: absolute;
		z-index: 99999;
		margin-top: -150rpx;
		padding: 0 30rpx;
		font-size: 60rpx;
		color: #ffffff;
		font-weight: bold;
		line-height: 1.5;
	}

	.coverImg {
		width: 760rpx;
		height: 70rpx;
		background-color: #FFFFFF;
		margin-top: -40rpx;
		margin-left: -5rpx;

	}

	.newsDetail {
		padding: 30rpx 30rpx;
		position: relative;
		z-index: 2;
		margin-top: -45rpx;
		background-color: #fff;
		border-top-right-radius: 40rpx;
		border-top-left-radius: 40rpx;
	}




	.newsDetail .synopsis {

		font-size: 28rpx;
		color: #6c6c6c;
		line-height: 45rpx;
		word-wrap: break-word;
		word-break: normal;

	}

	.newsDetail .list {
		margin: 28rpx 30rpx 0 30rpx;
		padding-bottom: 25rpx;
	}

	.newsDetail .list .label {
		font-size: 30rpx;
		color: #B1B2B3;
	}

	.newsDetail .list .item {
		margin-left: 27rpx;
		font-size: 30rpx;
		color: #B1B2B3;
	}

	.newsDetail .list .item .iconfont {
		font-size: 28rpx;
		margin-right: 10rpx;
	}

	.newsDetail .list .item .iconfont.icon-shenhezhong {
		font-size: 26rpx;
	}

	.newsDetail .conters {
		padding: 0 30rpx;
		font-size: 32rpx;
		color: #8A8B8C;
		line-height: 1.7;
	}

	.newsDetail .picTxt {
		width: 690rpx;
		height: 200rpx;
		border-radius: 20rpx;
		border: 1px solid #e1e1e1;
		position: relative;
		margin: 30rpx auto 0 auto;
	}

	.newsDetail .picTxt .pictrue {
		width: 200rpx;
		height: 200rpx;
	}

	.newsDetail .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx 0 0 20rpx;
		display: block;
	}

	.newsDetail .picTxt .text {
		width: 460rpx;
	}

	.newsDetail .picTxt .text .name {
		font-size: 30rpx;
		color: #282828;
	}

	.newsDetail .picTxt .text .money {
		font-size: 24rpx;
		margin-top: 40rpx;
		font-weight: bold;
	}

	.price_color {
		@include price_color(theme);
	}

	.newsDetail .picTxt .text .money .num {
		font-size: 36rpx;
	}

	.newsDetail .picTxt .text .y_money {
		font-size: 26rpx;
		color: #999;
		text-decoration: line-through;
	}

	.newsDetail .picTxt .label {
		position: absolute;
		background-color: #303131;
		width: 160rpx;
		height: 50rpx;
		right: -7rpx;
		border-radius: 25rpx 0 6rpx 25rpx;
		text-align: center;
		line-height: 50rpx;
		bottom: 24rpx;
	}

	.newsDetail .picTxt .label .span {
		background-image: linear-gradient(to right, #fff71e 0%, #f9b513 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.newsDetail .picTxt .label:after {
		content: " ";
		position: absolute;
		width: 0;
		height: 0;
		border-bottom: 8rpx solid #303131;
		border-right: 8rpx solid transparent;
		top: -7rpx;
		right: 0;
	}

	.newsDetail .bnt {
		color: #fff;
		font-size: 30rpx;
		width: 690rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin: 48rpx auto;
		text-align: center;
		line-height: 90rpx;
	}

	.bg_color {
		@include main-bg_color(theme);
	}
</style>
