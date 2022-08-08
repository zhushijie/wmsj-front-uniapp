<template>
	<view :data-theme="theme">
		<view class='searchGood'>
			<view class='search acea-row row-between-wrapper'>
				<view class='input acea-row row-between-wrapper'>
					<text class='iconfont icon-sousuo2'></text>
					<input type='text' :value='searchValue' :focus="focus" placeholder='点击搜索资讯' @input="setValue"
						placeholder-class='placeholder'></input>
				</view>
				<view class='bnt' @tap='searchBut'>搜索</view>
			</view>
			<view class='title'>热门话题</view>
			<view class='list acea-row'>
				<block v-for="(item,index) in huatiList" :key="index">
					<view @tap="gohuati(item.id)" class='item' v-if="item.pid==0">{{item.name}}</view>
				</block>
			</view>
			<view class='line'></view>

			<view class='title'>专题</view>
			<view class='list acea-row'>
				<block v-for="(item,index) in zhuantiList" :key="index">
					<view @tap="gozhuanti(item.id)"  class='item' v-if="item.pid!=0">{{item.name}}</view>
				</block>
			</view>
			<view class='line'></view>
		</view>

		<view class='noCommodity'>
			<view class='recommend'>
				<view class='title acea-row row-center-wrapper'>
					<text class='iconfont icon-zhuangshixian'></text>
					<text class='name'>{{searchLable}}</text>
					<text class='iconfont icon-zhuangshixian lefticon'></text>
				</view>
			</view>
		</view>
		<articleNormalList :articleList="articleList"></articleNormalList>
		<view class='loadingicon acea-row row-center-wrapper'>
			<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
		</view>

	</view>
</template>

<script>
	import {
		getArticleCategoryList,
		getZhuantiCategoryList,
		getArticleCategoryListByPid,
		getArticleRecommendList,
		getArticleList,
		getArticleHotList,
		getHuatiCategoryList,
		getHotHuatiCategoryList,
		getArticleSearchList
	} from '@/api/api.js'
	import {
		getSearchKeyword
	} from '@/api/store.js';
	import articleNormalList from '@/components/articleNormalList';
	export default {
		components: {
			articleNormalList
		},
		data() {
			return {
				articleList: [],
				huatiList: [],
				zhuantiList: [],
				searchValue: '',
				focus: true,
				first: 0,
				limit: 8,
				page: 1,
				loading: false,
				loadend: false,
				loadTitle: '',
				theme: 'theme1',
				searchLable: '热门推荐',
				begainS: false
			};
		},
		onLoad() {
			let that = this;
			uni.getStorage({
				key: 'theme',
				success: function(res) {
					that.theme = res.data;
				}
			});
			this.getArticleRecommend()
			this.getZhuantiCategory()
			this.getHotHuatiCategory()
		},
		onShow: function() {

		},
		onReachBottom: function() {
			this.getArticleSearch();
		},
		methods: {
			setValue: function(event) {
				this.$set(this, 'searchValue', event.detail.value);
			},
			searchBut() {

				console.log('searchBut')
				this.$set(this, 'articleList', []);
				this.$set(this, 'begainS', true);
				this.$set(this, 'loadend', false);
				this.$set(this, 'loading', false);
				this.$set(this, 'page', 1);
				this.$set(this, 'searchLable', '搜索结果');
				this.getArticleSearch()
			},
			gohuati(huatiid) {
				uni.navigateTo({
					url: "/pages/news_details/huati?id=" + huatiid
				})
			},
			gozhuanti(zhuanti) {
				uni.navigateTo({
					url: "/pages/news_details/zhuanti?id=" + zhuanti
				})
			},



			getArticleSearch() {
				let that = this;
				if (that.begainS) {
					if (that.loadend) return;
					if (that.loading) return;
					that.loading = true;
					that.loadTitle = '';
					getArticleSearchList({
						page: that.page,
						limit: that.limit,
						keywords: that.searchValue,
					}).then(res => {
						let list = res.data.list,
							loadend = list.length < that.limit;
						let articleList = that.$util.SplitArray(list, that.articleList);
						console.log(articleList)
						that.$set(that, 'articleList', that.articleList);
						that.loading = false;
						that.loadend = loadend;
						if (that.articleList.length) {
							that.loadTitle = loadend ? "没有更多的内容啦" : "加载更多";
						}
						that.page = that.page + 1;
					}).catch(err => {
						that.loading = false,
							that.loadTitle = '加载更多'
					});
				}

			},
			getArticleRecommend: function() {
				let that = this;
				getArticleRecommendList().then(res => {
					that.$set(that, 'articleList', res.data.list);
				});
			},
			getZhuantiCategory: function() {
				let that = this;
				getZhuantiCategoryList().then(res => {
					that.$set(that, 'zhuantiList', res.data.list);
				});
			},
			getHotHuatiCategory: function() {
				let that = this;
				getHotHuatiCategoryList().then(res => {
					that.$set(that, 'huatiList', res.data.list);
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}

	.searchGood .search {
		padding-left: 30rpx;
		background-color: #fff !important;
	}

	.searchGood .search {
		padding-top: 20rpx;
	}

	.searchGood .search .input {
		width: 598rpx;
		background-color: #f7f7f7;
		border-radius: 33rpx;
		padding: 0 35rpx;
		box-sizing: border-box;
		height: 66rpx;
	}

	.searchGood .search .input input {
		width: 472rpx;
		font-size: 26rpx;
	}

	.searchGood .search .input .placeholder {
		color: #bbb;
	}

	.searchGood .search .input .iconfont {
		color: #000;
		font-size: 35rpx;
	}

	.searchGood .search .bnt {
		width: 120rpx;
		text-align: center;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 30rpx;
		color: #282828;
	}

	.searchGood .title {
		font-size: 28rpx;
		color: #999;
		margin: 50rpx 30rpx 25rpx 30rpx;
	}

	.searchGood .list {
		padding-left: 10rpx;
		padding-right: 10rpx;
	}

	.searchGood .list .item {
		font-size: 26rpx;
		color: #454545;
		padding: 0 21rpx;
		height: 60rpx;
		border-radius: 30rpx;
		line-height: 60rpx;
		border: 1rpx solid #aaa;
		margin: 0 0 20rpx 20rpx;
	}

	.searchGood .line {
		border-bottom: 1rpx solid #eee;
		margin: 20rpx 30rpx 0 30rpx;
	}


	.recommend {
		background-color: #fff;
	}

	.recommend .title {
		height: 135rpx;
		line-height: 135rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.recommend .title .name {
		margin: 0 28rpx;
	}

	.recommend .title .iconfont {
		font-size: 170rpx;
		color: #454545;
	}

	.recommend .title .iconfont.lefticon {
		transform: rotate(180deg);
	}
</style>
