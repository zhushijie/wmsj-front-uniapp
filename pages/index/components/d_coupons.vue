<template>
	<view class="coupons" v-if="couponList.length && couponList.length>= 3">
		<view class="">
			<view class="coupont_title">
				<text class="left_con skeleton-rect">领取优惠券</text>
				<view class='item skeleton-rect' @click="toCouponList()">
					<text class="right_con">查看更多</text>
					<text class="iconfont icon-gengduo3 right_con"></text>
				</view>
			</view>
			<view class="conter">
				<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;">
					<view class="itemCon" v-for="(item, index) in couponList" :key="index" 
					:class='item.isUse ? "listHui" : "listActive" ' @click="getCoupon(item.id,index)">
						<view class="itemCon_left">
							<view class="quan_text">
								<view class="flex-center">
									<text class="sm_txt">￥</text>
									<text class="price_num">{{item.money?Number(item.money):''}}</text>
								</view>
								<text class="man">满{{item.minPrice?Number(item.minPrice):''}}可用</text>
							</view>
						</view>
						<view class="itemCon_right">
							<view class="column" v-if="!item.isUse">
								<text>领</text>
								<text>取</text>
							</view>
							<view class="column_dis" v-else>
								<text>已</text>
								<text>领</text>
								<text>取</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import {
		getIndexData,
		getCoupons,
		setCouponReceive
	} from '@/api/api.js';
	import animationType from '@/utils/animationType.js'
	export default{
		data() {
			return {
				couponList: [],
			}
		},
		created() {
			this.getcouponList()
		},
		methods: {
			getcouponList() {
				let that = this;
				getCoupons({
					page: 1,
					limit: 6
				}).then(res => {
					that.$set(that, "couponList", res.data);
					// 小程序判断用户是否授权；
					// #ifdef MP
					uni.getSetting({
						success(res) {
							if (!res.authSetting['scope.userInfo']) {
								that.window = that.couponList.length ? true : false;
							} else {
								that.window = false;
								that.iShidden = true;
							}
						}
					});
					// #endif
					// #ifndef MP
					if (that.isLogin) {
						that.window = false;
					} else {
						that.window = res.data.length ? true : false;
					}
					// #endif
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				});
			},
			getCoupon: function(id, index) {
				let that = this;
				//领取优惠券
				setCouponReceive(id).then(function(res) {
					that.$set(that.couponList[index], 'isUse', true);
					that.$util.Tips({
						title: '领取成功'
					});
				}, function(res) {
					return that.$util.Tips({
						title: res
					});
				})
			},
			toCouponList(){
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url:'/pages/users/user_get_coupon/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupons{
		background-color: #fff;
		margin: 30rpx auto 30rpx;
		padding-bottom: 32rpx;
		border-radius: 14rpx;
		box-sizing: border-box;
	}
	.coupont_title{
		display: flex;
		justify-content: space-between;
		padding: 24rpx 20rpx;
		.left_con{
			font-size: 32rpx;
			font-weight: 600;
			line-height: 45rpx;
			color: #333333;
		}
		.right_con{
			font-size: 24rpx;
			font-weight: 400;
			line-height: 45rpx;
			color: #999999;
		}
	}
	.conter {
		width: 666rpx;
		border-radius: 12px;
		padding-left: 20rpx;
		.itemCon {
			display: inline-block;
			width: 228rpx;
			height: 108rpx;
			margin-right: 20rpx;
			border-radius: 14rpx;
			background-repeat: no-repeat;
			background-position: right;
			position: relative;
			::before{
				content:'';
				position:absolute;
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background-color: #fff;
				left: -10rpx;
				top: 44rpx;
			}
		}
		.itemCon_left{
			width: 172rpx;
			height: 108rpx;
			border-radius: 14rpx;
			float: left;
			display: flex;
			justify-content: center;
			align-items: center;
			
			.quan_text{
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
				.sm_txt{
					display: inline-block;
					width: 24rpx;
					height: 24rpx;
					border-radius: 50%;
					text-align: center;
					font-size: 20rpx;
					margin-top: 10rpx;
					color: #fff;
				}
				.price_num{
					font-size: 44rpx;
					line-height: 44rpx;
					font-weight: 600;
				}
				.man{
					color: #999;
					font-size: 24rpx;
				}
			}
		}
		.itemCon_right{
			width: 56rpx;
			height: 108rpx;
			float: left;
			background: transparent;
			.column{
				height: 108rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #fff;
				font-size: 24rpx;
				border-radius: 0 14rpx 14rpx 0;
				
			}
			.column_dis{
				height: 108rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				color: #fff;
				border-radius: 0 14rpx 14rpx 0;
				background-color: #CCCCCC;
			}
		}
	}
	.flex-center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.listActive {
		@include linear-gradient(theme);
		.itemCon_left{
			@include coupons_light_color(theme);
			.quan_text{
				@include main_color(theme);
				.sm_txt{
					@include main_bg_color(theme);
				}
				.man{
					@include main_color(theme);
					opacity: .7;
				}
			}
		}
	}
	
	.listHui {
		background-color: #ccc !important;
		.itemCon_left{
			background-color: #F6F6F6;
			color: #ccc;
			.quan_text{
				color: #ccc;
				.sm_txt{
					background-color: #ccc;
				}
				.man{
					color: #ccc;
				}
			}
		}
		
	}
</style>
