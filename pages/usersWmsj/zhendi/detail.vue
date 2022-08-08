<template>
	<view  class="page-index">

		<view class="zhendiList skeleton">
			<view class='list' v-if="zhendiInfo">
			
				<!--一张图片的文章-->
				<view hover-class='none' class='item acea-row row-between-wrapper'>
					<view class='pictrue skeleton-rect'>
						<image v-if="zhendiInfo.imgs" :src='zhendiInfo.imgs' ></image>
						<image v-else :src='defaultImg' ></image>
					</view>
				</view>
		
			</view>
		</view>
		
		<view class="zhendiDetail skeleton">
			<view class='detail' v-if="zhendiInfo">
				<view class='item'>阵地名称：{{zhendiInfo.orgName}}</view>
				<!--<view class='item'>阵地类型：{{zhendiInfo.orgLevel}}</view>-->
				<view class='item'>联 系 人 ：{{zhendiInfo.leader}}</view>
				<view class='item'>联系电话：{{zhendiInfo.phone}}</view>
				<view class='item'>详细地址：{{zhendiInfo.adress}}</view>
			</view>
		</view>
		<view class="tuanduiJianjie skeleton" v-if="zhendiInfo">
			<u-cell icon="map-fill" title="阵地介绍"></u-cell>
			<view class='detail' >
				<view class='item' style="text-indent: 2em;line-height: 50rpx;font-size: 30rpx;margin-top: 10rpx;">{{zhendiInfo.remark}}</view>
			</view>
		</view>
		
		<u-cell-group class="zhendiMap"  v-if="zhendiInfo">
			<u-cell icon="map-fill" title="地址位置"></u-cell>
			<view class='list'>
				<map style="width: 100%; height: 400rpx;" :enable-zoom="true" :latitude="zhendiInfo.latitude" :longitude="zhendiInfo.longitude" 
				:markers="covers"
				> </map>
			</view>
		</u-cell-group>

	</view>
</template>

<script>
	import {getZhendiInfo} from '@/api/wmsj.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	 
	export default {
		computed: mapGetters(['isLogin', 'uid', 'userInfo']),
		components: {
			'uni-load-more':loadMore
		 },
		data() {
			return {
				orgId:0,
				zhendiInfo: {},
				map:Object,
				covers: [
					
				],
				defaultImg: require("@/static/img/wmsj/default.jpg"),
			}
		},
		onLoad: function (options){
			if (options.hasOwnProperty('orgId')){
				this.orgId = options.orgId;
			}
			this.getZhendi(this.orgId)
		    this.map = uni.createMapContext('map2', this)
			
		},
		
		methods: {
			getZhendi:function(groupId){
				getZhendiInfo(groupId).then(res => {
					this.zhendiInfo=res.data
					let cover= {
						latitude: res.data.latitude,
						longitude: res.data.longitude,
						title:res.data.orgName,
						iconPath: require("@/static/img/marker.png")
						
					}
					this.covers.push(cover)	
				});
			},
			showMaoLocation(e) {
				let self = this;
				// #ifdef H5
				if (self.$wechat.isWeixin()) {
					self.$wechat.seeLocation({
						latitude: Number(e.latitude),
						longitude: Number(e.longitude)
					}).then(res => {
						console.log('success');
					})
				} else {
					// #endif	
					uni.openLocation({
						latitude: Number(e.latitude),
						longitude: Number(e.longitude),
						name: e.name,
						address: `${e.address}-${e.detailedAddress}`,
						success: function() {
							console.log('success');
						}
					});
					// #ifdef H5	
				}
				// #endif
			},
		}
	}
</script>

<style scoped lang="scss">
	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}

			
	.zhendiList{
		background-color: white;
	}
	
	.zhendiList .list .item {
		margin: 0 24rpx;
		padding: 35rpx 0;
	}
	
	.zhendiList .list .item .pictrue {
		width: 750rpx;
		height: 420rpx;
	}
	
	
	.zhendiList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}
	
	.zhendiList .list .item .text {
		width: 750rpx;
		height: 60rpx;
		font-size: 30rpx;
		color: #999;
	}
	
	.zhendiList .list .item .text .name {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 40rpx;
		color: #282828;
		display: inline;
	}
	
	
	.zhendiList .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
	.zhendiDetail{
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx 40rpx ;
	}
	.zhendiDetail .detail{
	}
	.zhendiDetail .detail .item{
		height: 40rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
		background-color: white;
	}
	
	.tuanduiJianjie{
		margin-top: 20rpx;
		background-color: white;
		
	}
	.tuanduiJianjie .detail{
		padding: 20rpx 40rpx ;
	}
	
	
	.zhendiMap{
		margin-top: 20rpx;
		background-color: white;
		//padding: 20rpx 40rpx ;
	}
	.zhendiMap .list{
		padding: 20rpx 40rpx ;
	}

</style>
