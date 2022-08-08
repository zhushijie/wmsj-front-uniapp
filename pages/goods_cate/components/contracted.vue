<template>
	<view class="productSort">
		<view class='nav acea-row row-middle'>
			<scroll-view class="scroll-view_x" scroll-x scroll-with-animation :scroll-left="scrollLeft" style="width:auto;overflow:hidden;">
				<view class='item' v-for="(item,index) in navLists" :key='index' :class='active==index?"on":""' @click='tabSelect(index,item.id)'
				 :id="'id'+index">
					<view>{{item.name}}</view>
					<view class='line' v-if="active==index"></view>
				</view>
			</scroll-view>
		</view>
		<view class='list acea-row row-between-wrapper'>
			<view class='item' v-for="(item,index) in productList" :key="index" @click="godDetail(item)">
				<view class='pictrue'>
					<image :src='item.image'></image>
				</view>
				<view class='text'>
					<view class='name line1'>{{item.storeName}}</view>
					<view class='money'>￥<text class='num'>{{item.price}}</text></view>
					<view class='vip acea-row row-between-wrapper'>
						<view>已售{{item.sales + item.ficti}}件</view>
					</view>
				</view>
			</view>
			<view class='loadingicon acea-row row-center-wrapper' v-if="productList.length">
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
			</view>
		</view>
		<view class='noCommodity' v-if="productList.length== 0 && page > 1">
			<view class='pictrue'>
				<image src='../../../static/images/noShopper.png'></image>
			</view>
			<recommend :hostProduct="hostProduct"></recommend>
		</view>
	</view>
</template>

<script>
	import {
		getCategoryList,
		getProductslist,
		getProductHot
	} from '@/api/store.js';
	import {
		goShopDetail
	} from '@/libs/order.js'
	import recommend from '@/components/recommend';
	import {
		mapGetters
	} from "vuex";
	import animationType from '@/utils/animationType.js'
	export default {
		computed: mapGetters(['uid']),
		components: {
			recommend,
		},
		data() {
			return {
				navLists: [],
				productList: [],
				scrollLeft: 0,
				active: 0,
				loading: false,
				loadend: false,
				loadTitle: '加载更多',
				page: 1,
				limit: 10,
				cid: 0,
				hostProduct: []
			}
		},
		created(){
			this.getAllCategory();
			this.getProductList();
			this.get_host_product();
		},
		methods: {
			// 去详情页
			godDetail(item) {
				goShopDetail(item, this.uid).then(res => {
					uni.navigateTo({
						animationType: animationType.type,						animationDuration: animationType.duration,
						url: `/pages/goods_details/index?id=${item.id}`
					})
				})
			},
			tabSelect(index, id) {
				this.active = index;
				const query = uni.createSelectorQuery().in(this);
				query.select('#id' + index).boundingClientRect(data => {
					this.scrollLeft = (index - 1) * data.width;
				}).exec();
				this.cid = id;
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'productList', [])
				this.getProductList();
			},
			getAllCategory: function() {
				let that = this;
				getCategoryList().then(res => {
					that.navLists = res.data;
				})
			},
			getProductList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '';
				getProductslist({
					page: that.page,
					limit: that.limit,
					cid: that.cid
				}).then(res => {
					let list = res.data.list,
						loadend = list.length < that.limit;
					that.productList = that.$util.SplitArray(list, that.productList);
					that.$set(that, 'productList', that.productList);
					that.loading = false;
					that.loadend = loadend;
					that.loadTitle = loadend ? "😕人家是有底线的~~" : "加载更多";
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false,
						that.loadTitle = '加载更多'
				});
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				getProductHot(1, 20).then(res => {
					that.$set(that, 'hostProduct', res.data.list)
				});
			},
		},
		// onReachBottom() {
		// 	this.getProductList();
		// }
	}
</script>

<style scoped lang="scss">
	.productSort {
		.nav {
			padding: 0 30rpx;
			width: 100%;
			white-space: nowrap;
			box-sizing: border-box;
			height: 86rpx;
			background-color: #fff;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9;

			.item {
				display: inline-block;
				font-size: 30rpx;
				color: #282828;
				padding-right: 46rpx;

				&.on {
					color: #4B56AA;
					font-weight: bold;
				}

				.line {
					width: 40rpx;
					height: 4rpx;
					background-color: #4B56AA;
					margin: 10rpx auto 0 auto;
				}
			}
		}

		.list {
			margin-top: 86rpx;
			padding: 0 20rpx;

			.item {
				width: 345rpx;
				margin-top: 20rpx;
				background-color: #fff;
				border-radius: 20rpx;

				.pictrue {
					position: relative;
					width: 100%;
					height: 345rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 20rpx 20rpx 0 0;
					}
				}

				.text {
					padding: 20rpx 17rpx 26rpx 17rpx;
					font-size: 30rpx;
					color: #222;

					.money {
						font-size: 26rpx;
						font-weight: bold;
						margin-top: 8rpx;
						@include price_color(theme); 
						.num {
							font-size: 34rpx;
						}
					}
				}
			}
		}
	}
	.scroll-Y{
		height: 100vh;
	}
</style>