<template>
	<view class="newsList skeleton">
		<view class='list' v-if="articleList">
			<block  v-for="(item,index) in articleList" :key="index"> 
				<!--没有图片的文章-->
				<view v-if="item.imageInputs.length===0" @tap="gopage(item)" hover-class='none' class='item0 acea-row row-between-wrapper'>
					<view class='text acea-row row-column-between'>
						<view class='name line2 skeleton-rect'>
							{{item.title}}
						</view>
						<view class="time skeleton-rect">{{item.createTime}}</view>
					</view>
				</view>
				 
				<!--一张图片的文章-->
				<view v-if="item.imageInputs.length===1||item.imageInputs.length===2"  @tap="gopage(item)" hover-class='none' class='item acea-row row-between-wrapper'>
					<view class='text acea-row row-column-between'>
						<view class='name line2 skeleton-rect'>
							{{item.title}}
						</view>
						<view class="skeleton-rect">{{item.createTime}}</view>
					</view>
					<view class='pictrue skeleton-rect'>
						<image :src='item.imageInputs[0]'></image>
					</view>
				</view>
				<!--三张图片的文章-->
				<view v-if="item.imageInputs.length===3"  @tap="gopage(item)"
					hover-class='none' class='item3 acea-row row-between-wrapper'>
					<view class='text acea-row row-column-between'>
						<view class='name line2 skeleton-rect'>
							{{item.title}}
						</view>
					</view>
					
					<view class='picList'>
						<view class='pictrue1 skeleton-rect'>
							<image :src='item.imageInputs[0]'></image>
						</view>
						<view class='pictrue2 skeleton-rect'>
							<image :src='item.imageInputs[1]'></image>
						</view>
						<view class='pictrue3 skeleton-rect'>
							<image :src='item.imageInputs[2]'></image>
						</view>
						
					</view>
				</view>
			
			</block>
		</view> 
	</view>

</template>

<script>
	
	
	export default {
		props: {
			articleList: {
				type: Array,
				default: function() {
					return []
				},
			}
		},	
		watch: {
			articleList: {
				handler: function(newVal, oldVal) {
					console.log(newVal)
					if (newVal) {
						this.$set(this, 'articleList', newVal);
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				
			};
		},
		onLoad(){
			
		},
		methods: {
			gopage(item){
				console.log(item);
				let url="";
				url="/pages/news_details/index?id="+item.id
				uni.navigateTo({
					url:"/pages/news_details/index?id="+item.id
				})
			}
		}
	}
</script>

<style>


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
