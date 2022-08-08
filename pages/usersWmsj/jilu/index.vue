<template>
	<view :data-theme="theme">
		<view class='sign-record'>
			<u-subsection class="tabBar" style=" height: 80rpx;border-bottom: 1px solid #e5e5e5;" :list="navList"
				@change="sectionChange" mode="button" bgColor="#fff" activeColor="#E93323" :current="current"
				fontSize="15" :bold="false"></u-subsection>

			<view class='list'>
				<view class='item' style="padding: 20rpx;background-color: white;">
					<view class='listn borRadius14'>
						<view class='itemn acea-row row-between-wrapper' v-for="(item,index) in dataList"
							:key="index">
							<view>
								<view class='name line1'>{{item.title}}</view>
								<view>{{item.createTime}}</view>
							</view>
							<view class='num font_color'  v-if="current==0" >+{{item.serviceNum}}</view>
							<view class='num font_color'  v-if="current==1" >+{{item.integral}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class='loadingicon acea-row row-center-wrapper'>
				<uni-load-more :status="more" @clickLoadMore="gengduo" ></uni-load-more>
			</view>
		</view>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
	</view>
</template>

<script>
	import { getintegralLog, getserviceNumLog } from '@/api/wmsj.js';
	import { toLogin } from '@/libs/login.js';
	import { mapGetters } from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue';
	let app = getApp();
	export default {
		components: {
			// #ifdef MP
			authorize,
			// #endif
			'uni-load-more': loadMore,
		},
		data() {
			return {
				current: 0,
				navList: ['时长记录', '积分记录'],
				more :"noMore",
				page: 1,
				limit: 8,
				dataList: [],
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				theme: app.globalData.theme,
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.search();
					}
				},
				deep: true
			}
		},
		onLoad() {
			if (this.isLogin) {
				this.search();
			} else {
				toLogin();
			}
		},

		onReachBottom: function () {
			this.gengduo();
		},
		methods: {
			/**
			 * 
			 * 授权回调
			 */
			onLoadFun: function() {
				this.search();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			sectionChange(index) {
				this.current = index;
				this.search()
			},
			search(){
				let that=this
				that.limit=8;
				that.page=1;
				that.dataList=[];
				if(this.current==0){
					this.getserviceNumLogList()
				}else if(this.current==1){
					this.getintegralLogList()
				}
			},
			gengduo(){
				if(this.current==0){
					this.getserviceNumLogList()
				}else if(this.current==1){
					this.getintegralLogList()
				}
			},
			/**
			 * 获取服务时长记录列表
			 */
			getserviceNumLogList: function() {
				this.more="loading";
				let that = this;
				let limit = that.limit;
				let page = that.page;
				let dataList = that.dataList;
				getserviceNumLog({
					page: page,
					limit: limit,
				}).then(res => {
					console.log(res)
					let dataListNew = [];
					let len = res.data.length;
					dataListNew = dataList.concat(res.data);
					that.page++;
					that.$set(that, 'dataList', dataListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
					
				})
			},
			/**
			 * 获取积分记录列表
			 */
			
			getintegralLogList: function() {
				this.more="loading";
				let that=this;
				let limit = that.limit;
				let page = that.page;
				let dataList = that.dataList;
				getintegralLog({
					page: page,
					limit: limit,
				}).then(res => {
					console.log(res)
					let dataListNew = [];
					let len = res.data.length;
					dataListNew = dataList.concat(res.data);
					that.page++;
					console.log(that.page)
					that.$set(that, 'dataList', dataListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
				})
			},
		
		}
	}
</script>

<style lang="scss">
	.font_color {
		@include main_color(theme);
	}
</style>
