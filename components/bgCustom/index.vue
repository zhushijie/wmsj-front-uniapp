<template>
	<view style="touch-action: none;">
		<view class="home" style="position:fixed;" :style="{ top: top + 'px'}" id="right-nav" @touchmove.stop.prevent="setTouchMove">
			<view class="homeCon" :class="homeActive === true ? 'on' : ''" v-if="homeActive">
				<view class="bg_item1" @click="bgTheme('#D8EFD2')"></view>
				<view class="bg_item2" @click="bgTheme('#F9F2E2')"></view>
				<view class="bg_item3" @click="bgTheme('#D9EBED')"></view>
			</view>
			<view @click="open" class="pictrueBox">
				<view class="pictrue">
					<text class="iconfont icon-ziyuan-xianxing"></text>
					<!-- <image :src="
              homeActive === true
                ? '/static/images/close.gif'
                : '/static/images/open.gif'
            "
					 class="image" /> -->
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapGetters
	} from "vuex";
	export default {
		name: "Home",
		props: {},
		data: function() {
			return {
				top: "500"
			};
		},
		computed: mapGetters(["homeActive"]),
		methods: {
			setTouchMove(e) {
				var that = this;
				if (e.touches[0].clientY < 545 && e.touches[0].clientY > 66) {
					that.top = e.touches[0].clientY
					// that.setData({
					// 	top: e.touches[0].clientY
					// })
				}
			},
			open: function() {
				this.homeActive ?
					this.$store.commit("CLOSE_HOME") :
					this.$store.commit("OPEN_HOME");
			},
			bgTheme(value){
				this.$emit('getTheme',value)
			}
		},
		created() {
		}
	};
</script>

<style scoped lang="scss">
	.pictrueBox {
		width: 130rpx;
		height: 120rpx;
	}

	/*返回主页按钮*/
	.home {
		position: fixed;
		color: white;
		text-align: center;
		z-index: 9999;
		right: 15rpx;
		display: flex;
	}

	.home .homeCon {
		border-radius: 50rpx;
		opacity: 0;
		height: 0;
		color: blue;
		width: 0;
	}

	.home .homeCon.on {
		opacity: 1;
		animation: bounceInRight 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
		width: 300rpx;
		height: 80rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border: 2rpx solid #666;
		view{
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
		}
		.bg_item1{
			background-color: #D8EFD2;
		}
		.bg_item2{
			background-color: #F9F2E2;
		}
		.bg_item3{
			background-color: #D9EBED;
		}
	}

	.home .homeCon .iconfont {
		font-size: 40rpx;
		color: #fff;
		display: inline-block;
		margin: 0 auto;
	}

	.home .pictrue {
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		// border: 2rpx solid #fff;
		@include main_bg_color(theme)
		color:#fff;
		border-radius: 50%;
		margin: 0 auto;
		.icon-ziyuan-xianxing{
			font-size: 40rpx;
		}
	}

	.home .pictrue .image {
		// @include main_bg_color(theme);
		width: 100%;
		height: 100%;
		border-radius: 50%;
		transform: rotate(90deg);
		ms-transform: rotate(90deg);
		moz-transform: rotate(90deg);
		webkit-transform: rotate(90deg);
		o-transform: rotate(90deg);
	}
</style>
