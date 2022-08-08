<template>
	<!-- 秒杀 -->
	<view v-if="spikeList.length">
			<view class="seckill">
				<view class="title acea-row row-between-wrapper">
					<view class="acea-row row-middle">
						<view class="pictrue skeleton-rect">
							<image src="/static/images/seckillTitle.png"></image>
						</view>
						<view class="lines"></view>
						<view class="point skeleton-rect">{{point}} 场</view>
						<countDown :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="' : '" :minute-text="' : '" :second-text="' '"
						 :datatime="datatime" :is-col="true" :bgColor="bgColor"></countDown>
					</view>
					<view class="more acea-row row-center-wrapper skeleton-rect" @click="toSeckillList()">
						GO<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				<view class="conter">
					<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;" show-scrollbar="false">
						<view class="itemCon" v-for="(item, index) in spikeList" :key="index" @click="goDetail(item)">
							<view class="item">
								<view class="pictrue skeleton-rect">
									<image :src="item.image"></image>
								</view>
								<view class="name line1 skeleton-rect">{{item.title}}</view>
								<view class="x_money line1 skeleton-rect">¥<text class="num">{{item.price}}</text></view>
								<view class="y_money line1">¥{{item.otPrice}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
	</view>
	
</template>

<script>
	let app = getApp();
	import countDown from "@/components/countDown";
	import {getSeckillIndexApi} from '@/api/activity.js';
	import {setThemeColor} from '@/utils/setTheme.js'
	import animationType from '@/utils/animationType.js'
	export default {
		name: 'a_seckill',
		components: {
			countDown
		},
		data() {
			return {
				bgColor: {
					'bgColor': '#fff',
					'Color': '',
					'width': '44rpx',
					'timeTxtwidth': '16rpx',
					'isDay': true
				},
				spikeList: [{image: '', title: '', price:'',otPrice: ''},{image: '', title: '', price:'',otPrice: ''},{image: '', title: '', price:'',otPrice: ''}], // 秒杀
				point: '',
				datatime: 0,
				status: 0
			}
		},
		created() {
			let that = this;
			setTimeout(()=>{
				that.bgColor.Color =  setThemeColor();
			},1000)
			this.getSeckillIndexTime();
		},
		methods: {
			getSeckillIndexTime() {
				//this.spikeList = [{title:'',image:'',price:''}];
				getSeckillIndexApi().then(({data}) => {
					this.spikeList= [];
					this.spikeList = data ? data.productList : [];
					this.point = data ? data.secKillResponse.time.split(',')[0] : '';
					this.datatime = data ? parseFloat(data.secKillResponse.timeSwap) : '';
					this.status =  data ? data.secKillResponse.status : 0;
				})
			},
			goDetail(item){
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: '/pages/activity/goods_seckill_details/index?id=' + item.id
				})
			},
			toSeckillList(){
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: '/pages/activity/goods_seckill/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	.seckill {
		width: auto;
		height: 420rpx;
		@include seckill-gradient(theme);
		background-image: url('data:image/png;base64,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');
		background-repeat: no-repeat;
		background-size: 100%;
		border-radius: 14rpx;
		margin: 0 auto 30rpx auto;
		padding: 24rpx;
        box-sizing: border-box;
		.title {
			.pictrue {
				width: 148rpx;
				height: 40rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.lines {
				width: 1rpx;
				height: 24rpx;
				background-color: #fff;
				opacity: 0.6;
				margin-left: 16rpx;
			}

			.point {
				font-size: 30rpx;
				color: #fff;
				margin-left: 21rpx;
				margin-right: 4rpx;
				font-weight: 800;
			}
				.styleAll {
					width: 35rpx;
					height: 35rpx;
					background-color: #2F2F2F;
					border-radius: 6rpx;
					color: #fff;
					text-align: center;
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

		.conter {
			width: 666rpx;
			height: 320rpx;
			border-radius: 12px;
			margin-top: 24rpx;

			.itemCon {
				display: inline-block;
				width: 186rpx;
				margin-right: 24rpx;

				.item {
					width: 100%;

					.pictrue {
						width: 100%;
						height: 186rpx;
						border-radius: 6rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 6rpx;
						}
					}

					.name {
						font-size: 24rpx;
						color: #000;
						margin-top: 14rpx;
					}
					.y_money {
						font-size: 24rpx;
						color: #999999;
						text-decoration: line-through;
					}
					
					.x_money {
						// color: #FD502F;
						@include price-color(theme);
						font-size: 28rpx;
						height: 100%;
						font-weight: bold;
					    margin: 2rpx 0;
						.num {
							font-size: 28rpx;
						}
					}

					.money {
						// background: url("data:image/png;base64,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") no-repeat;
						margin-top: 14rpx;
					}
				}
			}
		}
	}
</style>
