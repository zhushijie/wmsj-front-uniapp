<template>
	<view  class="page-index">
		<view class="header">

			<view class="serch-wrapper flex">	
				<u-search  placeholder="搜索文明实践阵地" :actionStyle="actionStyle"
				 v-model="keyword" @custom="search" @search="search"></u-search>
			</view>
		</view>
		<view class="zhendiList skeleton"> 
			<template > 
				<u-subsection style=" height: 80rpx;border-bottom: 1px solid #e5e5e5;" :list="navList"  
				 @change="sectionChange"  :mode="button" bgColor="#fff" activeColor="#E93323"  :current="current" fontSize="15" :bold="false"></u-subsection>
			</template>
			
			<view class='list' v-if="zhendiList">
				<block  v-for="(item,index) in zhendiList" :key="index"> 
					<!--一张图片的文章-->
					<view @click="goZhendi(item.orgId)" hover-class='none' class='item acea-row row-between-wrapper'>
						<view class='pictrue skeleton-rect'>
							<image v-if="item.imgs" :src='item.imgs' ></image>
							<image v-else :src='defaultImg' ></image>
						</view>
						<view class='text acea-row row-column-between'>
							<view class='name line2 skeleton-rect'>
								{{item.orgName}}
							</view>
							<view class="skeleton-rect">联系电话：{{item.phone}}</view>
							 
							<view v-if="item.adress"class="skeleton-rect"> 所在地址：{{item.adress}}</view>
						</view>
						
					</view>
				</block>
			</view>
		</view>
		<uni-load-more :status="more" @clickLoadMore="getZhendis" ></uni-load-more>
	</view>
</template>

<script>
	import {getZhendiList} from '@/api/wmsj.js';
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
		 
		data() {
			return { 
				navList: ['实践中心', '实践所', '实践站', '实践基地'],
				// 或者如下，也可以配置keyName参数修改对象键名
				// list: [{name: '未付款'}, {name: '待评价'}, {name: '已付款'}],
				current: 0,
				zhendiList: [],
				page: 1,
				defaultImg: require("@/static/img/wmsj/default.jpg"),
				limit: 8, 
				more :"noMore",
				keyword: '',
				actionStyle: {'color':'#fff','font-size':'35rpx'}
			}
		},
		onLoad(){
			this.getZhendis()
		},
		/**
		   * 页面上拉触底事件的处理函数
		*/
		onReachBottom: function () {
			this.getZhendis()
		},
		methods: {
			sectionChange(index) {
				this.current = index;
				this.search()
			},
						
			getZhendis(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let zhendiList = that.zhendiList;
				
				getZhendiList({
					page: page, 
					limit: limit,
					orgName: that.keyword,
					orgLevel: that.current
				}).then(res => {
					let zhendiListNew = [];
					let len = res.data.list.length;
					zhendiListNew = zhendiList.concat(res.data.list);
					that.page++;
					that.$set(that, 'zhendiList', zhendiListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
			
				});
			},
			search(){
				let that=this
				that.limit=8;
				that.page=1;
				that.zhendiList=[];
				this.getZhendis()
			},
			goZhendi(orgId){
				uni.navigateTo({
					url: "/pages/usersWmsj/zhendi/detail?orgId="+orgId
				})
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
	.page-index	.header {
		width: 100%;
		background-color: $theme-color;
		padding: 28rpx 30rpx;
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
			
	.zhendiList{
		background-color: white;
	}
	
	.zhendiList .list .item {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;
		
	}
	
	.zhendiList .list .item .pictrue {
		width: 240rpx;
		height: 140rpx;
	}
	
	.zhendiList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}
	
	.zhendiList .list .item .text {
		width: 400rpx;
		max-width: 400rpx;
		height: 150rpx;
		font-size: 24rpx;
		color: #999;
	}
	
	.zhendiList .list .item .text .name {
		font-size: 30rpx;
		color: #282828;
		display: inline;
	}
	
	
	.zhendiList .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
</style>
