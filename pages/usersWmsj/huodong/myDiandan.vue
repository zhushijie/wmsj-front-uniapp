<template>
	<view  class="page-index">
	
		<view class="header">
	
			<view class="serch-wrapper flex">	
				<u-search  placeholder="输入关键字搜索活动" :actionStyle="actionStyle"
				 v-model="keyword" @custom="search" @search="search"></u-search>
			</view>
		</view>

		<view class="diandanList skeleton">
			<view class='list' v-if="diandanList">
				<block  v-for="(item,index) in diandanList" :key="index"> 
					<!--一张图片的文章-->
					<view hover-class='none' class='item acea-row row-between-wrapper'>
						<view  class='pictrue skeleton-rect'>
							<view class='showLog'>
								 <u-button icon="eye" type="primary" size="mini" :plain="true"  style="width: 150rpx; float: left;"
								 @click="showLogHandle(item)" text="查看详情"></u-button>
								 
								 
								 <u-button v-if="item.activityState==60" icon="chat" type="primary" size="mini" :plain="true"  style="width: 100rpx;float: right;"
								 @click="pingjiaHandle(item)" text="评价"></u-button>
								 
								 
								 
							</view>
							<view class='status'>
								<dict-tag :options="dict.type.wmsj_activity_jindu" :value="item.activityState"/>
							</view>
						</view>
						<view>
							<view class='name line2 skeleton-rect'>
								{{item.activityName}}
							</view> 
							<view class='prop line2 skeleton-rect'>
								<view class="weizhi skeleton-rect">
									<text class='iconfont icon-weizhi'></text>{{item.activityAddress}} 
								</view>
							
								<view class="leixing skeleton-rect">
									<text class='iconfont icon-dijiachangxuan'></text>{{item.serviceType}}
								</view>
								<view class="renshu skeleton-rect">
									<text class='iconfont icon-shijian1'> </text>{{item.createTime.substring(0,10)}}
								</view>
							</view>
							
						</view>
					</view>
				</block>
			</view>
			<uni-load-more :status="more" @clickLoadMore="getPaidans" ></uni-load-more>
		</view>
		<u-popup :show="showLog" @close="close" @open="open">
			<view style="padding: 40rpx 40rpx;">
				<u-button v-if="curItem.activityState>=30" style="width: 260rpx;float: right;" icon="eye" type="primary" size="small"
				 :plain="true"  @click="goActivity(curItem)" text="查看活动招募信息"></u-button>
				 
				 <u-button v-if="curItem.activityState<30" style="width: 260rpx;float: right;" icon="tags-fill" type="primary" size="small"
				  :plain="true"  @click="cuidan(curItem.activityId)" text="催单"></u-button>
				  
				<u-steps style="width: 100%;" :current="logList.length" dot direction="column">
					<u-steps-item  v-for="(item,index) in logList" :key="item.log" :title="item.log" :desc="item.datetime"> </u-steps-item>
				</u-steps>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {getMyDiandanList,cuidan} from '@/api/wmsj.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif 
	
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	
	export default {
		components: {
			'uni-load-more':loadMore
		 },
		computed: mapGetters(['isLogin','isWmsj', 'uid', 'userInfo']),
		dicts: ['wmsj_activity_jindu'],
		data() {
			return { 
				diandanList: [],
				logList: [],
				page: 1,
				limit: 8, 
				more :"noMore",
				keyword: '',
				actionStyle: {'color':'#fff','font-size':'35rpx'},
				showLog:false,
				curItem:{},
			}
		},
		onLoad(option){
			this.search()
		},
		
		methods: {
			onPullDownRefresh() {
				this.search()
				setTimeout(function () {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			//我的点单
			getMyDiandans(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let diandanList = that.diandanList;
				getMyDiandanList({
					page: page, 
					limit: limit,
					groupName: that.keyword
				}).then(res => {
					let diandanListNew = [];
					let len = res.data.list.length;
					diandanListNew = diandanList.concat(res.data.list);
					that.page++;
					that.$set(that, 'diandanList', diandanListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
			
				});
			},
			pingjiaHandle(item){
				uni.navigateTo({
					url: "/pages/usersWmsj/huodong/pingjia?activityId="+item.activityId
				})	
			},
			showLogHandle(item){
				this.showLog=true
				this.logList=item.remarkList
				this.curItem=item
			},
			close(){
				 this.showLog = false
			},
			open(){
				
			},
			search:function(){
				let that=this
				that.limit=8;
				that.page=1;
				that.diandanList=[];
				this.getMyDiandans()
				
			},
			goActivity(item){
				uni.navigateTo({
					url: "/pages/usersWmsj/huodong/detail?activityId="+item.activityId
				})		
			},
			cuidan(activityId){
				cuidan(activityId).then(res => {
					this.showLog=false
					uni.showToast({
						title: res.message,
						duration: 4000,
						icon: 'none'
					})
				});
			}
		}
	}
</script>

<style>
	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		background-color: #ffffff;
	}
	
	.page-index	.header {
		position: fixed;
		width: 100%;
		background-color: #E93323;
		padding: 28rpx 30rpx;
		z-index: 9999999999;
	}
	.page-index	.header	.serch-wrapper {
		align-items: center;
	}
	.page-index	.header	.serch-wrapper .logo {
		width: 200rpx;
		height: 42rpx;
		margin-right: 24rpx;
		color: white;
		font-size: 40rpx;
		line-height: 40rpx;
	}
	
	.page-index	.header	.serch-wrapper image {
		width: 200rpx;
		height: 42rpx;
	}
	
	.page-index	.header	.serch-wrapper .input {
		display: flex;
		align-items: center;
		width: 700rpx;
		height: 58rpx;
		padding: 0 0 0 30rpx;
		background: rgba(247, 247, 247, 1);
		border: 1px solid rgba(241, 241, 241, 1);
		border-radius: 29rpx;
		color: #BBBBBB;
		font-size: 26rpx;
	}
	
	.page-index	.header	.serch-wrapper .input .iconfont {
		margin-right: 20rpx;
		font-size: 26rpx;
		color: #666666;
	}
	.page-index	.tabBar {
		background: #ffffff;
		position: fixed;
		top:110rpx;
		z-index: 9999999999;
	}		
			
	.page-index	.searchBar {
		
	
		//height: 100rpx;
	}
	
			
	.diandanList{
		width: 750rpx;
		background-color: white;
		margin-top:110rpx;
	}
	
	.diandanList .list .item {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
		
	}
	
	.diandanList .list .item .pictrue {
		width: 750rpx;
		height: 50rpx;
		
	}
	.diandanList .list .item .pictrue .showLog {
		position: absolute;
		z-index: 6666;
		right: 25rpx;
		font-size: 24rpx;
		width: 300rpx;
		text-align: right;
	}
	
	.diandanList .list .item .pictrue .status {
		position: absolute;
		z-index: 6666;
		left: 24rpx;
		color: #e8e8e8;
		font-size: 24rpx;
		background-color: rgb(16 16 16 / 41%);

		background: linear-gradient(to right , rgb(239 13 13 / 60%) ,rgb(206 121 8 / 40%));
		padding: 10rpx 20rpx;
		border-radius: 0rpx;
		width: auto;
		height: 50rpx;
		text-align: right;
	}
	
	.diandanList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 2rpx;
	}
	

	 
	.diandanList .list .item .name {
		width: 750rpx; 
		font-size: 30rpx;
		font-weight:700;
		line-height: 60rpx;
		padding: 10rpx;
	}
	.diandanList .list .item .prop {
		
	}
	
	.diandanList .list .item .prop .weizhi{
		width: 350rpx;
		font-size: 24rpx;
		color: #969696;
		float: left;
	}
	.diandanList .list .item .prop .renshu{
		width: 220rpx;
		font-size: 24rpx;
		color: #969696;
		float: left;
		text-align: center;
	}
	.diandanList .list .item .prop .leixing{
		width: 180rpx;
		font-size: 24rpx;
		color: #969696;
		float: left;
	}
	.diandanList .list .item .buttons {
		text-align: right;
		width: 700rpx;
	}
	
</style>
