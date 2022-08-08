<template>
	<view class="">
		<view class="index-wrapper" v-show="showType == 2">
			<view class='wrapper' v-for="(item,index) in tabData" :key="index" index>
				<view class='title1 acea-row row-between-wrapper'>
					<view class='text'>
						<view class='name line1'>{{item.name}}</view>
						<view class='line1 txt-btn'>{{item.info}}</view>
					</view>
					<view class='more' @click="gopage(item)">更多
						<text class='iconfont icon-jiantou'></text>
					</view>
				</view>
				<view class='newProducts'>
					<scroll-view class="scroll-view_x" scroll-x style="width:auto;overflow:hidden;">
						<block v-for="(item1,index1) in tempArr[index]" :key='index1'>
							<view class='item' @click="goDetail(item1.id)">
								<view class='img-box'>
									<image :src='item1.image'></image>
								</view>
								<view class='pro-info line1'>{{item1.storeName}}</view>
								<view class='money font-color'>￥{{item1.price}}</view>
							</view>
						</block>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="index-wrapper" v-show="showType == 3">
			<view class='wrapper' v-for="(item,index) in tabData" :key="index" index>
				<view class='title1 acea-row row-between-wrapper'>
					<view class='text'>
						<view class='name line1'>{{item.name}}</view>
						<view class='line1 txt-btn'>{{item.info}}</view>
					</view>
					<view class='more' @click="gopage(item)">更多
						<text class='iconfont icon-jiantou'></text>
					</view>
				</view>
				<promotionGood :benefit="tempArr[index]"></promotionGood>
			</view>
		</view>
	</view>
</template>

<script>
	import {getGroomList} from '@/api/store.js';
	import promotionGood from '@/components/promotionGood/index.vue';
	import animationType from '@/utils/animationType.js'
	let app = getApp()
	export default {
		name: 'promotion',
		props: {
			tabData: {
				type: Array,
				default: []
			},
			showType:{
				type:Number,
				default:1
			},
		},
		components: {
			promotionGood
		},
		created() {
			setTimeout(()=>{
				this.reloadData();
			},1000)
		},
		data() {
			return {
				tempArr: [],
				params: {
					page: 1,
					limit: 6,
				},
			}
		},
		methods: {
			// 产品列表
			productslist: function(item) {
				let that = this;
				return new Promise((resolve, reject) => {
					getGroomList(item.type,this.params).then(({data}) => {
						resolve(data.list);
					})
				})
			},
			async reloadData(){
				for (let i = 0; i < this.tabData.length; i++) {
					let goodsInfo = await this.productslist(this.tabData[i]);
					this.tempArr.push(goodsInfo);
				}
			},
			gopage(type) {
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: '/pages/activity/promotionList/index?type=' + JSON.stringify(type)
				})
			},
			goDetail(id) {
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/goods_details/index?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.index-wrapper {
		border-radius: 14rpx;
		margin: 30rpx auto 110rpx;
	}

	.wrapper {
		margin: 30rpx auto 0;
		border-radius: 14rpx;
		background-color: #fff;
	}

	.title1 {
		padding-top: 20rpx;
		margin: 0 20rpx;

		.text {
			display: flex;

			.name {
				font-size: 34rpx;
				font-weight: bold;
			}

			.txt-btn {
				display: flex;
				align-items: flex-end;
				margin-bottom: 4rpx;
				margin-left: 12rpx;
				font-size: 24rpx;
				color: #999;
			}
		}

		.more {
			font-size: 12px;
			color: #999;

			.icon-jiantou {
				margin-left: 10rpx;
				font-size: 26rpx;
			}
		}
	}


	.wrapper .newProducts {
		white-space: nowrap;
		padding: 0rpx 20rpx 0rpx 20rpx;
		margin: 20rpx 0;
	}

	.wrapper .newProducts .item {
		display: inline-block;
		width: 240rpx;
		margin-right: 20rpx;
		border-radius: 20rpx;
	}

	.wrapper .newProducts .item:nth-last-child(1) {
		margin-right: 0;
	}

	.wrapper .newProducts .item .img-box {
		width: 100%;
		height: 240rpx;
		position: relative;
	}

	.wrapper .newProducts .item .img-box image {
		width: 100%;
		height: 100%;
		border-radius: 12rpx 12rpx 0 0;
	}

	.wrapper .newProducts .item .pro-info {
		font-size: 28rpx;
		color: #333;
		text-align: center;
		padding: 19rpx 10rpx 0 10rpx;
	}

	.wrapper .newProducts .item .money {
		padding: 0 10rpx 18rpx 10rpx;
		text-align: center;
		font-size: 26rpx;
		font-weight: bold;
	}

	.empty-img {
		width: 640rpx;
		height: 300rpx;
		border-radius: 14rpx;
		margin: 26rpx auto 0 auto;
		background-color: #ccc;
		text-align: center;
		line-height: 300rpx;

		.iconfont {
			font-size: 50rpx;
		}
	}

	.font-color {
		@include main_color(theme);
	}
</style>
