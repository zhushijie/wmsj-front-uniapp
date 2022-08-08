<template>
	<view class="newsList skeleton">
		<view class='list' v-if="articleList">
			<block  v-for="(item,index) in articleList" :key="index"> 
			<view></view>
				<!--没有图片的文章-->
				<view v-if="item.imageInputs.length===0 && (item.videoPath ==null || item.videoPath =='')" @tap="gopage(item)" hover-class='none' class='item0 acea-row row-between-wrapper'>
					<view class='text acea-row row-column-between'>
						<view class='name line2 skeleton-rect'>
							<view class="shipinicon iconfont icon-zhibo" v-if="item.videoPath !=null && item.videoPath !=''">视频</view>
							<view class="zhuantiicon iconfont icon-cuxiaoguanli" v-if="item.zhuantiid !='0'">专题</view>
							<view class="huatiicon iconfont icon-kefujiedai" v-if="item.huatiid !='0'">话题</view>
							{{item.title}}
						</view>
						<view class="time skeleton-rect">{{item.createTime}}</view>
					</view>
				</view>
				 
				<!--一张图片的文章-->
				<view v-if="(item.imageInputs.length===1||item.imageInputs.length===2) && (item.videoPath ==null || item.videoPath =='')"  @tap="gopage(item)" hover-class='none' class='item acea-row row-between-wrapper'>
					<view class='text acea-row row-column-between'>
						<view class='name line2 skeleton-rect'>
							<view class="shipinicon iconfont icon-zhibo" v-if="item.videoPath !=null && item.videoPath !=''">视频</view>
							<view class="zhuantiicon iconfont icon-cuxiaoguanli" v-if="item.zhuantiid !='0'">专题</view>
							<view class="huatiicon iconfont icon-kefujiedai" v-if="item.huatiid !='0'">话题</view>
							{{item.title}}
						</view>
						<view class="skeleton-rect">{{item.createTime}}</view>
					</view>
					<view class='pictrue skeleton-rect'>
						<image :src='item.imageInputs[0]'></image>
					</view>
				</view>
				<!--三张图片的文章-->
				<view v-if="item.imageInputs.length===3 && (item.videoPath ==null || item.videoPath =='')"  @tap="gopage(item)"
					hover-class='none' class='item3 acea-row row-between-wrapper'>
					<view class='text acea-row row-column-between'>
						<view class='name line2 skeleton-rect'>
							<view class="shipinicon iconfont icon-zhibo" v-if="item.videoPath !=null && item.videoPath !=''">视频</view>
							<view class="zhuantiicon iconfont icon-cuxiaoguanli" v-if="item.zhuantiid !='0'">专题</view>
							<view class="huatiicon iconfont icon-kefujiedai" v-if="item.huatiid !='0'">话题</view>
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
			
			
				<!--视频类-->
				<view v-if="(item.videoPath !=null && item.videoPath !='')" @tap="gopage(item)" hover-class='none' class='vedioItem acea-row row-between-wrapper'>
					<view class='videopic skeleton-rect'>
						<view class="shipinicon iconfont" v-if="item.videoPath !=null && item.videoPath !=''">视频点播</view>
							<view class="iconfont icon-zhibo" v-if="item.videoPushUrl !=null && item.videoPushUrl !=''">直播</view>
						<view class="videoCoverSecond" >{{formatTime(item.videoSeconds)}}</view>
						<!--<image class="videoCoverpic" src='../../static/images/play.png'></image>-->
						<image class="videoIcon" src='../../static/tabBar/play.png'></image>
						<image :src='item.imageInputs[0]'></image>
					</view>
					
					
					<view class='text acea-row row-column-between'>
						
						<view class='name line2 skeleton-rect'>
							<view class="zhuantiicon iconfont icon-cuxiaoguanli" v-if="item.zhuantiid !='0'">专题</view>
							<view class="huatiicon iconfont icon-kefujiedai" v-if="item.huatiid !='0'">话题</view>
							{{item.title}}
						</view>
						<!--<view class="time skeleton-rect">{{item.createTime}}</view>-->
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
				if(item.huatiid!="0"){
					uni.navigateTo({
					 	url:"/pages/news_details/huati?id="+item.huatiid+"&aid="+item.id
					})
					
				}else if(item.zhuantiid!="0"){
					uni.navigateTo({
					 	url:"/pages/news_details/zhuanti?id="+item.zhuantiid+"&aid="+item.id
					})
				}else if(item.videoPath !=null && item.videoPath !=''){
					//url="/pages/news_details/zhuanti?id="+item.id
					url="/pages/news_details/vedio?id="+item.id
					uni.navigateTo({
					 	url:"/pages/news_details/vedio?id="+item.id
					})
				}
				else{
					url="/pages/news_details/index?id="+item.id
					uni.navigateTo({
					 	url:"/pages/news_details/index?id="+item.id
					})
					
				}
				// uni.navigateTo({
				// 	url:"/pages/news_details/index?id="+item.id
				// })
		
			},
			formatTime(second) {
			    return this.padStart(second/60/60)+':'+this.padStart(second/60%60)+':'+this.padStart(second%60)
			},
			padStart(num) {
			    return (num|0).toString().padStart(2,'0')
			},
		}
	}
</script>

<style>



	.newsList .list .vedioItem {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
		
	}
	.newsList .list .vedioItem .text {
		width: 700rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #999;
	}
	
	.newsList .list .vedioItem .videopic {
		width: 700rpx;
		border-radius: 20rpx;
	}
	.newsList .list .vedioItem .videopic image {
		width: 700rpx;
		height: 350rpx;
		border-radius: 14rpx;
	}
	.newsList .list .vedioItem .videopic .videoCoverpic {
		position: absolute;
		width: 700rpx;
		height: 350rpx;
		border-radius: 14rpx;
		z-index: 6666;
	}
	.newsList .list .vedioItem .videopic .videoIcon {
		position: absolute;
		width: 150rpx;
		height: 150rpx;
		z-index: 6666;
		margin-top: 85rpx;
		margin-left: 275rpx
	}
	.newsList .list .vedioItem .videopic .videoCoverSecond {
	
		position: absolute;
		z-index: 6666;
		margin-top: 285rpx;
		right: 50rpx;
		color: #e8e8e8;
		font-size: 24rpx;
		background-color: rgb(16 16 16 / 41%);
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
	}
	
	
	.newsList .list .vedioItem .text .name {
		font-size: 32rpx;
		color: #7d7d7d;
		display: inline;
		line-height: 40rpx;
		padding: 20rpx 20rpx
	}

	.newsList .list .vedioItem .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
	
	 
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
	.newsList .list .item0 .veidoCoverpic {
		width: 700rpx;
		height: 180rpx;
	}

	.newsList .list .item0 .text .name {
		font-size: 30rpx;
		color: #282828;
		display: inline;
		max-width: 100%;
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
		height: 170rpx;
	}

	.newsList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}

	.newsList .list .item .text {
		width: 450rpx;
		height: 170rpx;
		font-size: 24rpx;
		color: #999;
	}

	.newsList .list .item .text .name {
		font-size: 30rpx;
		color: #282828;
		display: inline;
		max-width: 100%;
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
		max-width: 100%;
	}
	.newsList .list .item3 .picList {
		width: 700rpx;
		height: 180rpx;
	}
	.newsList .list .item3 .picList .pictrue1 {
		width: 227rpx;
		height: 170rpx;
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
		height: 170rpx;
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
		height: 170rpx;
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
		width: 100rpx;
		line-height: 40rpx;
		display: inline;
		float: left;
		background-color:  #e93323;
		color: #fff;
		font-size: 25rpx;
		border-radius: 20rpx;
		text-align: center;
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
	.shipinicon{
		
		position: absolute;
		z-index: 9999;
		width: 150rpx;
		line-height: 50rpx;
		display: inline;
		float: left;
		background-color: #e93323;
		color: #fff;
		font-size: 25rpx;
		border-radius: 20rpx;
		text-align: center;
	}
</style>
