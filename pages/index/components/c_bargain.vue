<template>
	<view :class="{borderShow:isBorader}" v-if="bargList.length">
		<view class="combination">
			<view class="title acea-row row-between">
				<view class="acea-row row-column">
					<!-- <image src="../../../static/images/kanjia.png" class="pic"></image> -->
				</view>
				<view class="more acea-row row-center-wrapper" @click="toBragainList()">
					GO<text class="iconfont icon-xiangyou"></text>
				</view>
			</view>
			<view class="conter acea-row">
				<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;" show-scrollbar="false">
					<view class="itemCon" v-for="(item, index) in bargList" :key="index" @click="bargDetail(item)">
						<view class="item">
							<view class="pictrue">
								<image :src="item.image"></image>
							</view>
							<view class="text lines1">
								<view class="name line1">{{item.title}}</view>
								<view class="x-money">¥<text class="num">{{item.minPrice}}</text></view>
								<view class="btn">参与砍价</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		getBargainIndexApi
	} from '@/api/activity.js';
	import { mapGetters } from 'vuex';
	import animationType from '@/utils/animationType.js'
	export default {
		name: 'c_bargain',
		computed: mapGetters({
			'userData': 'userInfo',
			'uid': 'uid'
		}),
		data() {
			return {
				bargList: [{image: '', title: '', price:'',otPrice: ''},{image: '', title: '', price:'',otPrice: ''},{image: '', title: '', price:'',otPrice: ''}],
				isBorader:false
			};
		},
		created() {
			this.getBargainList();
		},
		mounted() {
		},
		methods: {
			// 砍价列表
			getBargainList() {
				getBargainIndexApi().then(res => {
					this.bargList = res.data ? res.data.productList : [];
				})
			},
			bargDetail(item){
			   uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/activity/goods_bargain_details/index?id=${item.id}&startBargainUid=${this.uid}`
			   });
			},
			toBragainList(){
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/activity/goods_bargain/index`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pic{
		width: 130rpx;
		height: 30rpx;
	}
	.default{
		width: 690rpx;
		height: 300rpx;
		border-radius: 14rpx;
		margin: 26rpx auto 0 auto;
		background-color: #ccc;
		text-align: center;
		line-height: 300rpx;
		.iconfont{
			font-size: 80rpx;
		}
	}
	.combination{
		width: auto;
		background-image: url('data:image/png;base64,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');
		background-repeat: no-repeat;
		background-size: 100%;
		background-color: #fff;
		border-radius: 14rpx;
		margin: 30rpx auto 0 auto;
		padding: 25rpx 20rpx 25rpx 20rpx;
		
		.title {
			.sign {
				font-size: 32rpx;
				color: $theme-color;
				margin-bottom: 2rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
		
			.name {
				
				text {
					color: #333333;
					font-size: 26rpx;
					font-weight: 400;
				}
			}
		
			.more {
				width: 86rpx;
				height: 40rpx;
				background: linear-gradient(142deg, #FFE9CE 0%, #FFD6A7 100%);
				opacity: 1;
				border-radius: 18px;
				font-size: 22rpx;
				color: #FE960F;
				padding-left: 8rpx;
				font-weight: 800;
				.iconfont {
					font-size: 21rpx;
				}
			}
		}
		.conter{
			margin-top: 28rpx;
			.itemCon {
				display: inline-block;
				width: 220rpx;
				margin-right: 24rpx;
			}
			.item{
				width:100%;
				.pictrue{
					width: 100%;
					height: 220rpx;
					border-radius: 6rpx;
					image{
						width: 100%;
						height: 100%;
						border-radius: 6rpx;
					}
				}
				.text{
					margin-top: 4rpx;
					.y_money {
						font-size: 24rpx;
						color: #999999;
						text-decoration: line-through;
					}
					.name {
						font-size: 24rpx;
						color: #000;
						margin-top: 14rpx;
					}
					.money {
						color: #FD502F;
						font-size: 28rpx;
						height: 100%;
						font-weight: bold;
					    margin: 10rpx 0;
						.num {
							font-size: 28rpx;
						}
					}
					.btn{
						width: 220rpx;
						height: 48rpx;
						line-height: 48rpx;
						text-align: center;
						@include linear-gradient(theme);
						opacity: 1;
						border-radius: 0px 0px 14rpx 14rpx;
						color: #FFFFFF;
						font-size: 26rpx;
						margin-top: 6rpx;
					}
				}
			}
		}
		.x-money{
			@include price-color(theme);
			font-size: 28rpx;
			height: 100%;
			font-weight: bold;
			margin: 5rpx 0 0;
		}
	}
</style>
