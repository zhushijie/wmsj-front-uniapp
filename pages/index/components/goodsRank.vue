<template>
	<view :data-theme="theme">
		<view class='hotList' v-if="productList.length > 2">
			<view class='title acea-row row-between-wrapper'>
				<view class='text line1'>
					<text class="iconfont icon-jingpintuijian1"></text> 
					<text class='label'>商品排行榜</text>
				</view>
				<view class='more' hover-class="none" @click="more()">更多
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view>
			<view class='list'>
				<block>
					<view class="item acea-row row-middle" :class="{'lei' : index < 2}" v-for="(item,index) in productList.slice(0,3)" :key="index" @click="toDetail(item.id)">
						<view class="img_box">
							<image class="pictrue" :src="item.image"></image>
							<view  class="rank_bdg top_1" v-if="index == 0">热榜TOP1</view>
							<view  class="rank_bdg top_2" v-else-if="index == 1">热榜TOP2</view>
							<view  class="rank_bdg top_3" v-else-if="index == 2">热榜TOP3</view>
						</view>
						<view class="ml_11 flex-column justify-between flex-1">
							<view class="goods_name">{{item.storeName}}</view>
							<view class="price flex justify-between">
								<view>
									<text class="price_bdg">￥</text>{{item.price}}
									<text class="sales">销量 {{item.sales}}件</text>
								</view>
								<view class="cart_icon">
									<text class="iconfont icon-gouwuche7"></text>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	import {mapState} from 'vuex';
	import animationType from '@/utils/animationType.js'
	import {productRank} from '@/api/api.js'
	export default {
		name: 'goodList',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				theme:app.globalData.theme,
				productList: [],
			}
		},
		created() {
			this.getProductRank();
		},
		methods:{
			toDetail(id){
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url:'/pages/goods_details/index?id=' + id
				})
			},
			getProductRank(){
				productRank().then(res=>{
					this.productList = res.data;
				})
			},
			more(){
				let typeInfo = {
					type:'rank',
					name:'商品排行'
				}
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url:'/pages/activity/promotionList/index?type=' + JSON.stringify(typeInfo)
				})
			}
		}
	}
</script>

<style lang="scss">
	.hotList {
		background-color: #fff;
		margin: 30rpx 0 0;
		border-radius: 12rpx;
	}

	.hotList .hot-bg {
		width: 100%;
		height: 120rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #282828;
		margin-top: 15rpx;

	}

	.hotList .title {
		padding: 24rpx 20rpx 0 20rpx;
	}

	.hotList .title .text {
		width: 500rpx;
		color: #999999;
		font-size: 12px;
		display: flex;
		align-items: flex-end;
	}
	
	.icon-jingpintuijian1{
		@include main_color(theme);
		font-size: 42rpx;
	}
	.hotList .title .text .label {
		font-size: 36rpx;
		font-weight: bold;
		color: #282828;
		margin-right: 12rpx;
		margin-left:12rpx;
	}

	.hotList .title .more {
		font-size: 26rpx;
		color: #999999;
		;
	}

	.hotList .title .more .iconfont {
		font-size: 25rpx;
		margin-left: 10rpx;
	}

	.hotList .list {
		width: 690rpx;
		border-radius: 20rpx;
		background-color: #fff;
		margin: 0rpx auto 0 auto;
		padding: 0 20rpx 30rpx;
		box-sizing: border-box;
	}
	.hotList .list .item {
		background: #fff;
		margin-top: 26rpx;
	}
	.lei{
		padding-bottom: 26rpx;
		position: relative;
		&::after{
			content: '';
			position: absolute;
			bottom: 0;
			right: 0;
			width: 460rpx;
			height: 2rpx;
			background-color: #eee;
		}
	}
	.img_box{
		width: 180rpx;
		height: 180rpx;
		background: #F3F3F3;
		position: relative;
		.pictrue{
			width:100%;
			height:100%;
			border-radius: 10rpx;
		}
		.rank_bdg{
			width: 100%;
			height: 46rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			text-align: center;
			color: #fff;
			font-size: 24rpx;
			line-height: 46rpx;
			background-size: 100%;
			background-repeat: no-repeat;
		}
	}
	.ml_11{
		margin-left: 22rpx;
	}
	.flex-1{
		flex: 1;
	}
	.goods_name{
		width: 420rpx;
		height: 80rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		line-height: 40rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: wrap;
	}
	.price{
		margin-top: 60rpx;
		font-size: 34rpx;
		font-weight: 600;
		@include price_color(theme);
		.price_bdg{
			font-size: 26rpx;
		}
		.sales{
			font-size: 24rpx;
			color: #999999;
			font-weight: 400;
			padding-left: 12rpx;
		}
		.cart_icon{
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			@include main_bg_color(theme);
			// text-align: center;
			// line-height: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.iconfont{
				font-size: 28rpx;
				font-weight: 400;
				color: #fff;
			}
		}
	}
	.top_1{
		background-image: url('data:image/png;base64,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');
	}
	.top_2{
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAXCAYAAACLbliwAAAAAXNSR0IArs4c6QAABMRJREFUaEPtWUtvG1UU/s487NghTWrHeSqp1RKVhyohla5YILECqeJXsEZlidhk0aZLJFjSX9EAO9giwaaiqoJaSEnTJM2jll+J45m59yDPe8bj6bhSJdo4sjR2ZN+59zvf+c4531Bj/eYeCPdI0gNJ+EtlemSY3X9K92mXVlclRn+ZEVhdhfJp6YuFHOiSFLQCku8w8D5L/oAa67e4txKzffGvYBggfgLGNhN2wLzDEvuS8IyAAyHkoUK5w/rOs9rKl993M+/mNfziz999lq/ml0odoVZIygoIM4qkOTDNMstFEBYZtMRSLDMoBzAcUN13DAwE2kXfAd+JQO/lfbLf95YjEEuWJwTUmFEHuM5AA5JbAJoMagF8DMZx7ypBHUB2AOqQ4FOhyC4xdQWzoZBiqpZlClJMwZYQrIocDGFJTXBeZ2kZPG7p3AZAmklK1yTScmQolqpBqKYhVY10VTLrGliX0HRWRM6SyIM5T8RjklFQJApSoQJYjjNovHcF0QQkTzBwDsCklDxFin0tE6HIksmhYgBgHA8bEfdLNtTpQDsrRYB2AU5cJBY5PyjBjoJAefvszx7vjn4wUw/h/d49TCQjPVIEDAnWTNprDBA3r33AbIKF14xkf5R4AdABo73/JTA6Beism/c25x/CzYgY0P4hEjafhS1JkhcBxSNIDPyAbT7yTqCdl0M0j76ZgfakN4xfsNZgjXYPH6hFLLJpLA+lT9qGA7b4ORTIk3tor3ZE0tJftL+2JMmbJ5gR3XxBJvrZm3IvXxocHoUC9Ao02qVAiBHRyPos8ZkRRDwAMQxYbMMhYQzO7DDOY+Fg6XAPPEBOPPaGtTQgcrw5CK/l3DtL1nl7TJUObfoiWBiwnm9H0iki9CONRnG2ClJ1tHce9tWDTBqtlZagnl/E6aPfQgUyPUWGKYZvikZPX/kYx/tbONl/PAzQTsqolYsQrSPo85fR3fzdae8GVvQgjSPp/IKi8mZoNFB+7yM0/r2P/NQMWk8fRkiZIh0O0NrcZShvlWHubkAc1wb20SONZuQmyjhXvYLT+gGaWw+8viVbHw1SoM2uAPoYjK17I432W9b+wj218iGE0UHryQakEIkyO7AY6tWrgGVCtI9g1XZGGp0CdKGyjNxkBYqq4/lGcj0b2EdTcQr6/LsgVYNV24Z5sDnS6ISJtrjwNoozF8DCRH3zTxit2nAabSs1aVCn5qCOl2DV92A19vu8jrOs0fnz8xgrL8BoHOHk6KkN9kt5HUphEmp5GZAS8rRlA81Gp2846Wv4M47g/sDiDR8JE5bb6ERrxP/A61DzRfSA1ooTICK09x7DbNeGae9Cs7qiQpuuQhkvgbRcj+L28GIebqYbNRmBfl376OL8JRQqF+zgS6OLbvMI7d2/Q4zOZCr5M6/tTY+8jige4XF/WK+jCWAibvxHbFJvUEnwo8+yRg/hdbSoub72C4M/CYBOsUmTTO2R1+EMKAPcO3dm/pWaP61dB+OulJIiPwg+DBT4pEc2Z9HriPriUT+aiJlAn9vgNu/evMVEXzMzxa3LkUa/vEaTY1zcvnbjzjc20A7Ya9cl5FfMuAbYz868fEh9ZjjS6NiTlV6rytwiwh8EfHv1xg8/9qD8D1XwwuIISKhxAAAAAElFTkSuQmCC');
	}
	.top_3{
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAXCAYAAACLbliwAAAAAXNSR0IArs4c6QAABH9JREFUaEPtWU1vG1UUPfdNHDuxJ+M4SaNCoQpFIIRY8gPCGrFBSLCFX8ASsUYs+QndZ4nYQje0GxqpEQvEogiVtomxseuP8Uc871404/n0zDhuVBY0M7L1LM/M851zzz3v+jw6uX/3jEV+JeA3UfI7azw0BH9YI+fRweHhBMWxMgJ3bt+udDfU61D8BjTfEsHbArwjwHv04P5dAcSbTLxB/NH70BKSxxB6KsynIGkKoSmMFkTaYqBNZHSqNnffPTwcrhzR/+jCo6OjmrWut8/ZaUDTrha9S0rtsZZ9UrIvgusQeQXADYHsQUDi4um9AmgFPtAuyC7KWYAH32WP4YTADIIeID0h9KB5CEUDYR4KKZuEbRYaATIGywREYxGeEjB1hM/XYEy11o4YamYwzzSRJnI0UUkza5bgYPYCIaVIOw65o1JKycwxZoBhGDCYucQsJQO0psFlBWN9PlJZtN4QQkUEGwTZFJEqiKrCUgPEJKGaQCzvzbAAKflPHhIxDqIHZoykqXPz0wHQ/uVzSi8wO5Yd75x/Z5Cx2HfRuWi+IMgouXnngt8JAwgZEWdGWHVRoKl454WZQ4yMeMO4w2oOq9qbZxHoIIbwmWL3ZSXBnWOB0XHpCH7sAkavBPT8wQMAEkAslFkyMekS9NXNT8IlKjAr3gyAU6TJBTOJWTbQMUZnMTmZuSTg0YRBxuNsT7MgxegUwIugRhqXz+ikDmazfTEZfkU+L+AXsjYd73+l0ZGsBA8Rll2S0fOkRsnIY0EmwKFyuYkJqmSBVUvkISRPXAbDz5FkrM7oF6DR5lYdWmvYg/68VAuNjnVl0ZpS397xVuF26yzRbYS1fpFGV2tbqNZMNE8fh2wNMh0tIJFk5C+GL7dGH9x6C93OP+h2WjlAL9Fol82TsQ1rexet5pMU0IVGR4y+efCmR0aXmO2/zzK7pdw+2qo3UK5s4Fmnhel0ks/ojDYvlJgrotGbmzXsX78Be9hH8/RJBtBL+mgiYMtqQBkGOq1modGpFjBi9Kuv3YQzO0fz7BTCnATab+dy++idvX0wMybjEUb2oNDoJX20Vd9GtWp6C+KjPx9mAL1Eo9fXy6g3dqGUwnDQQ7/Xze46YvJwcUsUWxRfkj66sXsNbtfBWuP06V8Yj+zn02h3+SRS2NisoVKpwLYH80kW/trGvI4r10ebpgXT2oY9HKD/rAPNOt11rOJ1uKyumpYH4Ox8ipE9hOPM5i7JFfc6SqUSzC0L5XIFIEKn3cJ4bF+uj3YZXTMtlCsVKLXmoeuurK6MXOU+urFzDW5X5h4u8Wx76DUMmYz2SbnEj46ZSlktXOi3Fl5HosJjPvSi19EHYL4AP/rKaXRSPkM9TS+GggGdHN/7UYQ/SHq4OdZf4XVkeh3RrlTSgQxqnQQ/0YPjex8S8D0zU7DKJbe0Cj96+Q7Lcj+aiISBjzxwT45//gagr5iF4tkp/OiYx34JPxrk3fTtx5998bXPYsBlNkS+FOH3RWAmymHZ9k/hdWTtGQ5I8IsmfPfJp5//4F7wL0+zShOpHg5WAAAAAElFTkSuQmCC');
	}
</style>