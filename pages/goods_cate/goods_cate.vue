<template>
	<view class="page" :data-theme="theme" :style="{height:winHeight + 'px'}">
		<cate v-show="currentPage == 'one'"></cate>
		<contracted v-show="currentPage == 'two'" ref="classTwo"></contracted>
		<optimization v-show="currentPage == 'three'" :showSlide="showSlide" ref="classThree"></optimization>
		<fresh v-show="currentPage == 'four'" :showSlide="showSlide" ref="classFour"></fresh>
		<!-- <home></home> -->
	</view>
</template>
<script>
	import cate from './components/default_cate';
	import optimization from './components/optimization';
	import contracted from './components/contracted';
	import fresh from './components/fresh';
	import {getShare} from '@/api/public.js';
	import {mapGetters} from 'vuex';
	import home from '@/components/home/index.vue';
	const app = getApp();
	export default {
		data() {
			return {
				currentPage:'one',
				theme:app.globalData.theme,
				showSlide:true,
				winHeight:'',
				configApi: {}, //分享类容配置
			}
		},
		computed: mapGetters(['isLogin', 'uid']),
		onLoad(){
			let that = this;
			let config = that.$Cache.getItem('categoryConfig');
			that.showSlide = config.isShowCategory == 'true'? true : false;
			switch (config.categoryConfig) {
				case '1':
					that.$set(that,'currentPage','one');
					uni.showTabBar()
					break;
				case '2':
					that.$set(that,'currentPage','two');
					uni.showTabBar()
					break;
				case '3':
					that.$set(that,'currentPage','three');
					uni.hideTabBar()
					break;
				case '4':
					that.$set(that,'currentPage','four');
					uni.hideTabBar()
					break;
			}
			uni.getSystemInfo({
			    success: function (res) {
			        that.winHeight = res.windowHeight;
			    }
			});
			// #ifdef H5
			that.shareApi();
			// #endif
		},
		onShow(){
			switch (this.currentPage){
				case 'one':
					uni.showTabBar()
					break;
				case 'two':
					uni.showTabBar()
					break;
				case 'three':
					uni.hideTabBar()
					setTimeout(()=>{
						if(this.isLogin){
							//登录的情况下获取模板3,4的购物车商品数量和列表
							this.$refs.classThree.getCartNum();
							this.$refs.classThree.getCartLists(1);
						}
					},500)
					break;
				case 'four':
					uni.hideTabBar()
					setTimeout(()=>{
						if(this.isLogin){
							this.$refs.classFour.getCartNum();
							this.$refs.classFour.getCartLists(1);
						}
					},500)
					break;
			}
		},
		components:{
			cate,optimization,contracted,fresh,home
		},
		methods:{
			shareApi: function() {
				getShare().then(res => {
					this.$set(this, 'configApi', res.data);
					// #ifdef H5
					this.setOpenShare(res.data);
					// #endif
				})
			},
			// 微信分享；
			setOpenShare: function(data) {
				let that = this;
				if (that.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: data.synopsis,
						title: data.title,
						link: location.href,
						imgUrl: data.img
					};
					that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage);
				}
			},
		},
		onReachBottom(){
			if(this.currentPage=='two'){
				this.$refs.classTwo.getProductList();
			}
			if(this.currentPage=='three'){
				this.$refs.classThree.productslist();
			}
			if(this.currentPage=='four'){
				this.$refs.classFour.productslist();
			}
		}
	}
</script>
<style lang="scss">
	.page{
		background: #fff;
		// overflow-y: auto;
	}
</style>