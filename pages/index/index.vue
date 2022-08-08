<template>
	<view :data-theme="theme">
		<skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton"
			bgcolor="#FFF"></skeleton>
		<view class="page-index skeleton" :class="{'bgf':navIndex >0}" :style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
			<!-- #ifdef H5 -->
			<view class="header">
				<view class="serch-wrapper flex">
					<view class="logo skeleton-rect">
						融媒商城
						<image style="display: none;" :src="logoUrl" mode=""></image>
					</view>
					<navigator url="/pages/goods_search/index" class="input" hover-class="none"><text
							class="iconfont icon-xiazai5"></text>
						搜索商品</navigator>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP || APP-PLUS -->
			<view class="mp-header">
				<view class="sys-head skeleton-rect" :style="{ height: statusBarHeight }"></view>
				<view class="serch-box skeleton-rect" style="height: 40px;">
					<view class="serch-wrapper flex">
						<view class="logo">
							<image :src="logoUrl" mode=""></image>
						</view>
						<navigator url="/pages/goods_search/index" class="input" hover-class="none"><text
								class="iconfont icon-xiazai5"></text>
							搜索商品</navigator>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- 首页展示 -->
			<view class="page_content skeleton" :style="'margin-top:'+(marTop)+'px;'" v-if="navIndex == 0">
				<view class="mp-bg"></view>
				<view id="pageIndex">
					<!-- banner -->
					<view class="swiper skeleton-rect" @click.native="bindEdit('indexBanner')">
						<swiper indicator-dots="true" :autoplay="true" :circular="circular" :interval="interval"
							:duration="duration" indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
							<block v-for="(item,index) in imgUrls" :key="index">
								<swiper-item>
									<view @click="menusTap(item.url)">
										<image :src="item.pic" class="slide-image" lazy-load></image>
									</view>
								</swiper-item>
							</block>
						</swiper>
					</view>
					<!-- 新闻简报 -->
					<view class='notice acea-row row-middle row-between skeleton-rect'
						@click.native="bindEdit('indexNews')">
						<view class="pic" :style="{backgroundImage:'url('+imgHost+picBg+')'}" v-if="imgHost" @click="toNewsList()"></view>
						<text class='line'>|</text>
						<view class='swipers'>
							<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" interval="2500" duration="500"
								vertical="true" circular="true">
								<block v-for="(item,index) in roll" :key='index'>
									<swiper-item @touchmove.stop="stopTouchMove">
										<view class='item' @click="menusTap(item.url)">
											<view class='line1'>{{item.info}}</view>
										</view>
									</swiper-item>
								</block>
							</swiper>
						</view>
						<view class="iconfont icon-xiangyou" @click="toNewsList()"></view>
					</view>
					<!-- menu -->
					<view class='nav acea-row' @click.native="bindEdit('indexMenu')">
						<block v-for="(item,index) in menus" :key="index">
							<view class='item' @click="menusTap(item.url)">
								<view class='pictrue'>
									<image :src='item.pic' class="skeleton-radius"></image>
								</view>
								<view class="menu-txt skeleton-rect">{{item.name}}</view>
							</view>
						</block>
					</view>
				</view>
				<!-- 优惠券 -->
				<coupons class="skeleton skeleton-rect"></coupons>
				<!-- 秒杀-->
				<seckill class="skeleton skeleton-rect"></seckill>
				<!-- 拼团-->
				<combination class="skeleton skeleton-rect"></combination>
				<!-- 砍价-->
				<bargain class="skeleton-rect"></bargain>
				<!-- 排行榜 -->
				<goods-rank class="skeleton skeleton-rect"></goods-rank>
				<!-- 商品列表模板选择性显示 -->
				<promotion :tabData="explosiveMoney" :showType="cardShow" v-if="cardShow !== 1"></promotion>
				<!-- 底部分类 -->
				<view class="sticky-box" :style="'top:'+(marTop)+'px;'" v-if="cardShow == 1">
					<scroll-view class="scroll-view_H" style="width: 100%;" scroll-x="true" scroll-with-animation
						:scroll-left="tabsScrollLeft" @scroll="scroll">
						<view class="tab nav-bd" id="tab_list">
							<view id="tab_item" :class="{ 'active': listActive == index}" class="item skeleton-rect"
								v-for="(item, index) in explosiveMoney" :key="index" @click="ProductNavTab(item,index)">
								<view class="txt">{{item.name}}</view>
								<view class="label">{{item.info}}</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 首发新品 -->
				<view class="index-product-wrapper" :class="iSshowH?'on':''" v-if="cardShow == 1">
					<view class="list-box animated" :class='tempArr.length > 0?"fadeIn on":""'>
						<view class="item" v-for="(item,index) in tempArr" :key="index" @click="goDetail(item)">
							<view class="pictrue">
								<span class="pictrue_log pictrue_log_class"
									v-if="item.activityH5 && item.activityH5.type === '1'">秒杀</span>
								<span class="pictrue_log pictrue_log_class"
									v-if="item.activityH5 && item.activityH5.type === '2'">砍价</span>
								<span class="pictrue_log pictrue_log_class"
									v-if="item.activityH5 && item.activityH5.type === '3'">拼团</span>
								<image :src="item.image" mode=""></image>
							</view>
							<view class="text-info">
								<view class="title line1">{{item.storeName}}</view>
								<view class="old-price"><text>¥{{item.otPrice}}</text></view>
								<view class="price">
									<text>￥</text>{{item.price}}
								</view>
							</view>
						</view>
					</view>
					<view class='loadingicon acea-row row-center-wrapper' v-if="goodScroll">
						<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>
					</view>
					<view class="mores-txt flex" v-if="!goodScroll">
						<text>我是有底线的</text>
					</view>
				</view>
			</view>
			<!-- #ifdef MP -->
			<aTip :isCustom="true" :text="wxText" :borderR="5"></aTip>
			<atModel v-if="locationStatus" :locationType="true" @closeModel="modelCancel" @confirmModel="confirmModel" :content="locationContent"></atModel>
			<!-- #endif -->
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="privacy-wrapper" v-if="privacyStatus">
			<view class="privacy-box">
				<view class="title">服务协议与隐私政策</view>
				<view class="content">
					尊敬的用户，欢迎您注册成为本应用用户。请您仔细阅读<i
						@click="xieyiApp">《服务协议与隐私政策》</i>
				</view>
				<view class="btn-box">
					<view class="btn-item" @click="confirmApp">我同意</view>
					<view class="btn" @click="closeModel">随便逛逛</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import Auth from '@/libs/wechat';
	import Cache from '../../utils/cache';
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	let app = getApp();
	import {
		getIndexData,
		setCouponReceive,
		getTheme,
		getAppVersion,
	} from '@/api/api.js';
	import { spread } from "@/api/user";
	// #ifdef MP-WEIXIN || APP-PLUS
	import { getTemlIds } from '@/api/api.js';
	// #endif
	// #ifdef H5  
	import { follow } from '@/api/public.js';
	// #endif
	import { getShare } from '@/api/public.js';
	import a_seckill from './components/a_seckill';
	import b_combination from './components/b_combination';
	import c_bargain from './components/c_bargain';
	import d_coupons from './components/d_coupons';
	import promotion from './components/promotion';
	import goodsRank from './components/goodsRank';
	import atModel from '@/components/accredit/index.vue'
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import aTip from '@/components/add-tips/index.vue';
	import { goShopDetail } from '@/libs/order.js'
	import { goPage } from '@/libs/iframe.js'
	import { mapGetters } from "vuex";
	import {
		getCategoryList,
		getProductHot,
		getGroomList
	} from '@/api/store.js';
	import { silenceBindingSpread } from '@/utils';
	import animationType from '@/utils/animationType.js' 
	// #ifndef MP
	import { getWechatConfig } from "@/api/public";
	// #endif
	import Loading from '@/components/Loading/index.vue';
	const arrTemp = ["beforePay", "afterPay","createBargain", "pink"];
	export default {
		computed: mapGetters(['isLogin', 'uid']),
		components: {
			'seckill':a_seckill,
			'combination':b_combination,
			'bargain':c_bargain,
			'coupons':d_coupons,
			goodsRank,
			promotion,
			Loading,
			aTip,
			atModel
		},
		data() {
			return {
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				loaded: false,
				loading: false,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				statusBarHeight: statusBarHeight,
				navIndex: 0,
				navTop: [],
				followUrl: "",
				followHid: true,
				followCode: false,
				logoUrl: "",
				imgUrls: [{url: '',pic: '',id: '',name: ''}],
				menus: [{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''},{url: '',pic: '',id: '',name: ''}, ],
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 2500,
				duration: 500,
				window: false,
				navH: "",
				ProductNavindex: 0,
				marTop: 0,
				sortProduct: [],
				hostProduct: [],
				hotPage: 1,
				hotLimit: 10,
				hotScroll: false,
				explosiveMoney: [{title: ''}, {title: ''}, {title: ''}, {title: ''}],
				searchH: 0,
				goodType: 0, //精品推荐Type
				goodScroll: true, //精品推荐开关
				params: { //精品推荐分页
					page: 1,
					limit: 10,
				},
				tempArr: [], //精品推荐临时数组
				roll: [], // 新闻简报
				site_name: '', //首页title
				iSshowH: false,
				configApi: {}, //分享类容配置
				privacyStatus: true, // 隐私政策是否同意过
				tabsScrollLeft: 0, // tabs当前偏移量
				scrollLeft: 0,
				listActive: 0, // 当前选中项
				// duration: 2 // 下划线动画时长
				theme: 'theme1',
				imgHost: '',
				picBg: 'attachimage/change/new_header/new_header1.png',
				appUpdate: {},
				wxText: "点击添加到我的小程序，微信首页下拉即可访问商城。",
				locationContent:'授权位置信息，提供完整服务',
				cardShow:1,
				locationStatus:false
			}
		},
		watch: {
			ProductNavindex(newVal) { // 监听当前选中项
				this.setTabList()
			},
			listActive(newVal) { // 监听当前选中项
				this.setTabList()
			}
		},
		onLaunch: function() {
			//this.isNodes++;
		},
		mounted() {
			this.setTabList()
		},
		onLoad(options) {
			if (app.globalData.isIframe) {
				setTimeout(() => {
					let active;
					document.getElementById('pageIndex').children.forEach(dom => {
						dom.addEventListener('click', (e) => {
							e.stopPropagation();
							e.preventDefault();
							if (dom === active) return;
							dom.classList.add('borderShow');
							active && active.classList.remove('borderShow');
							active = dom;
						})
					})
				});
			}
			setTimeout(() => {
				this.isNodes++;
			}, 100);
			var that = this;

			// #ifdef APP-PLUS
			try {
				let val = uni.getStorageSync('privacyStatus')
				if (val) {
					// uni.showLoading({
					// 	title: '加载中'
					// })
					that.privacyStatus = true
				} else {
					that.privacyStatus = true
				}
			} catch (e) {}
			this.appVersionConfig(); //APP版本检测
			// #endif
			// 获取系统信息
			uni.getSystemInfo({
				success(res) {
					that.$store.commit("SYSTEM_PLATFORM", res.platform);
				}
			});
			
			let self = this
			//根据换色配置动态获取‘新闻简报’图片
			getTheme().then(resP => {
				self.theme = `theme${Number(resP.data.value)}`;
				self.picBg = `attachimage/change/new_header/new_header${Number(resP.data.value)}.png`;
			})
			// #ifdef MP
			// 获取小程序头部高度
			this.navH = app.globalData.navHeight;
			let info = uni.createSelectorQuery().select(".mp-header");
			info.boundingClientRect(function(data) {
				self.marTop = data.height
				self.poTop = Number(data.height) + 84
			}).exec()
			if (options.scene) { // 仅仅小程序扫码进入
				let qrCodeValue = self.$util.getUrlParams(decodeURIComponent(options.scene));
				let mapeMpQrCodeValue = self.$util.formatMpQrCodeData(qrCodeValue);
				app.globalData.spread = mapeMpQrCodeValue; //将解码后的分销员id保存在globalData中
				setTimeout(() => {
					spread(mapeMpQrCodeValue).then(res => {}).catch(res => {})
				}, 2000)
			} else {
				app.globalData.spread = options.spread; //非小程序扫码进入情况下，直接获取url中的分销员id保存在globalDta中
			}
			// #endif
			// #ifndef MP || APP-PLUS
			this.navH = 0;
			// #endif
			this.getIndexConfig();
			// #ifdef MP || APP-PLUS
			this.getTemlIds()
			// #endif
			// #ifdef H5 || APP-PLUS
			silenceBindingSpread()
			uni.getLocation({
				type: 'gcj02',
				altitude: true,
				geocode: true,
				success: function(res) {
					try {
						uni.setStorageSync('user_latitude', res.latitude);
						uni.setStorageSync('user_longitude', res.longitude);
					} catch {}
				}
			});
			// #endif
		},
		onShow() {
			let self = this;
			// #ifdef APP-PLUS
			let barHeight = uni.getSystemInfoSync().statusBarHeight;
			self.marTop = barHeight + 40; //刘海屏
			setTimeout(() => {
				if (self.appUpdate.openUpgrade == 'true') {
					self.appVersionConfig();
				}
			}, 1000)
			// #endif
			uni.showTabBar();
		},
		methods: {
			menusTap(url) {
				goPage().then(res => {
					uni.navigateTo({
						animationType: animationType.type,
						animationDuration: animationType.duration,
						url: url
					})
				})
			},
			toNewsList(){
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url:'/pages/news_list/index'
				})
			},
			bindEdit(name) {
				if (app.globalData.isIframe) {
					window.parent.postMessage({
							name: name
						},
						'*'
					);
					return;
				}
			},
			reloadData() {
				setTimeout(() => {
					this.showSkeleton = false
				}, 1000)
			},
			// scroll-view滑动事件
			scroll(e) {
				this.scrollLeft = e.detail.scrollLeft;
			},
			setTabList() {
				this.$nextTick(() => {
					this.scrollIntoView()
				})
			},
			// 计算tabs位置
			scrollIntoView() { // item滚动
				let lineLeft = 0;
				this.getElementData('#tab_list', (data) => {
					let list = data[0]
					this.getElementData(`#tab_item`, (data) => {
						let el = data[this.listActive]
						lineLeft = el.width / 2 + (-list.left) + el.left - list.width / 2 - this.scrollLeft
						this.tabsScrollLeft = this.scrollLeft + lineLeft
					})
				})
			},
			getElementData(el, callback) {
				uni.createSelectorQuery().in(this).selectAll(el).boundingClientRect().exec((data) => {
					callback(data[0]);
				});
			},
			// xieyiApp() {
			// 	uni.navigateTo({
			// 		url: '/pages/users/web_page/index?webUel=https://xxxxxxxxxxxxx/xieyi.html&title=协议内容'
			// 	})
			// },
			// #ifdef APP-PLUS
			// xieyiApp() {
			// 	uni.navigateTo({
			// 		animationType: animationType.type,
			// 		animationDuration: animationType.duration,
			// 		url: '/pages/users/web_page/index?webUel=https://xxxxxxxxx/xieyi.html&title=协议内容'
			// 	})
			// },
			// 同意隐私协议
			confirmApp() {
				uni.setStorageSync('privacyStatus', true)
				this.privacyStatus = false
			},
			// 关闭Model
			closeModel() {
				this.privacyStatus = false
			},
			// #endif
			// #ifdef MP || APP-PLUS
			getTemlIds() {
				for (var i in arrTemp) {
					this.getTem(arrTemp[i]);
				}
			},
			getTem(data) {
				getTemlIds({
					type: data
				}).then(res => {
					if (res.data) {
						let arr = res.data.map((item) => {
							return item.tempId
						})
						wx.setStorageSync('tempID' + data, arr);
					}
				});
			},
			// #endif
			// 关闭优惠券弹窗
			onColse() {
				this.$set(this, "window", false);
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				that.loading = true;

				if (that.hotScroll) return
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.list.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
				});
			},

			// 首页数据
			getIndexConfig: function() {
				let that = this;
				//this.isNodes++;
				getIndexData().then(res => {
					that.$set(that, "logoUrl", res.data.logoUrl);
					let imgHost = res.data.logoUrl.split('attachimage')[0];
					that.imgHost = imgHost;
					that.$Cache.set('imgHost', imgHost);
					that.$set(that, "imgUrls", res.data.banner);
					that.$set(that, "menus", res.data.menus);
					that.$set(that, "roll", res.data.roll ? res.data.roll : []);
					that.$set(that,'cardShow',res.data.homePageSaleListStyle == '' ? 1 : Number(res.data.homePageSaleListStyle)); //首页商品列表模板获取配置
					// 保存商品分类页配置
					that.$Cache.setItem({
						name: 'categoryConfig',
						value: {
							categoryConfig: res.data.categoryPageConfig,
							isShowCategory: res.data.isShowCategory
						}
					});
					// #ifdef H5 || APP-PLUS
					that.$store.commit("SET_CHATURL", res.data.yzfUrl);
					Cache.set('chatUrl', res.data.yzfUrl);
					// #endif
					Cache.setItem({
						name:'chatConfig',
						value:{
							consumer_hotline:res.data.consumerHotline,
							telephone_service_switch:res.data.telephoneServiceSwitch
						}
					});
					that.$set(that, "explosiveMoney", res.data.explosiveMoney);
					that.goodType = res.data.explosiveMoney[0].type
					this.getGroomList();
					this.shareApi();
					this.reloadData();
					// #ifdef MP
					if(!Cache.has('user_latitude')){
						this.locationStatus = true;
					}
					// #endif
					
				});
			},
			appVersionConfig() {
				var that = this;
				//app升级
				// 获取本地应用资源版本号  
				getAppVersion().then(res => {
					that.$set(that.appUpdate, 'androidAddress', res.data.androidAddress);
					that.$set(that.appUpdate, 'appVersion', res.data.appVersion);
					that.$set(that.appUpdate, 'iosAddress', res.data.iosAddress);
					that.$set(that.appUpdate, 'openUpgrade', res.data.openUpgrade);
					plus.runtime.getProperty(plus.runtime.appid, function(inf) {
						let nowVersion = (inf.version).split('.').join('');
						let appVersion = (res.data.appVersion).split('.').join('');
						uni.getSystemInfo({
							success: (res) => {
								if (appVersion > nowVersion) {
									uni.showModal({
										title: '更新提示',
										content: '发现新版本，是否前去下载?',
										showCancel: that.appUpdate.openUpgrade ==
											'false' ? true : false,
										cancelColor: '#eeeeee',
										confirmColor: '#FF0000',
										success(response) {
											if (response.confirm) {
												switch (res.platform) {
													case "android":
														plus.runtime.openURL(that
															.appUpdate
															.androidAddress);
														break;
													case "ios":
														plus.runtime.openURL(encodeURI(
															that.appUpdate
															.iosAddress));
														break;
												}

											}
										}
									});
								}
							}
						})
					});
				})
			},
			shareApi: function() {
				getShare().then(res => {
					this.$set(this, 'configApi', res.data);
					this.$set(this, "site_name", res.data.title);
					uni.setNavigationBarTitle({
						title: this.site_name
					})
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
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// 首发新品切换
			ProductNavTab(item, index) {
				if (this.listActive !== index) {
					this.listActive = index
					this.goodType = item.type
					this.listActive = index
					this.ProductNavindex = index
					this.tempArr = []
					this.params.page = 1
					this.goodScroll = true
					let onloadH = true
					this.getGroomList(onloadH)
				}
			},
			// 首发新品详情
			goDetail(item) {
				if (item.activityH5 && item.activityH5.type === "2" && !this.isLogin) {
					toLogin();
				} else {
					goShopDetail(item, this.uid).then(res => {
						uni.navigateTo({
							animationType: animationType.type,
							animationDuration: animationType.duration,
							url: `/pages/goods_details/index?id=${item.id}` 
						})
					})
				}
			},
			// 精品推荐
			getGroomList(onloadH) {
				this.loading = true
				let type = this.goodType;
				if (!this.goodScroll) return
				if (onloadH) {
					this.iSshowH = true
				}
				getGroomList(type, this.params).then(({
					data
				}) => {
					this.iSshowH = false
					this.loading = false
					this.goodScroll = data.list.length >= this.params.limit
					this.params.page++
					this.tempArr = this.tempArr.concat(data.list)
				})
			},
			stopTouchMove() {
				return true //禁止新闻swiper手动滑动
			},
			modelCancel(){
				this.locationStatus = false;
			},
			confirmModel(){
				uni.getLocation({
					type: 'gcj02',
					altitude: true,
					geocode: true,
					success: function(res) {
						try {
							uni.setStorageSync('user_latitude', res.latitude);
							uni.setStorageSync('user_longitude', res.longitude);
						} catch {}
					}
				});
				this.locationStatus = false;
			}
		},
		mounted() {
			let self = this;
			// #ifdef H5 || APP-PLUS
			// 获取H5 搜索框高度
			let appSearchH = uni.createSelectorQuery().select(".serch-wrapper");
			appSearchH.boundingClientRect(function(data) {
				self.searchH = data.height
			}).exec()
			// #endif
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			return {
				title: this.configApi.title,
				imageUrl: this.configApi.img,
				desc: this.configApi.synopsis,
				path: '/pages/index/index'
			};
		},
		// #endif
		// 滚动到底部
		onReachBottom() {
			if (this.navIndex == 0) {
				// 首页加载更多
				if (this.params.page != 1) {
					this.getGroomList();
				}
			} else {
				// 分类栏目加载更多
				if (this.sortProduct.length > 0) {
					//this.get_product_list();
				} else {
					this.get_host_product();
				}
			}
		},
		
	}
</script>
<style>
	page {
		height: auto;
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef H5 */
		background-color: #fff;
		/* #endif */

	}
</style>
<style lang="scss" scoped>
	.notice {
		width: 100%;
		height: 70rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin-bottom: 25rpx;
		line-height: 70rpx;
		padding: 0 14rpx;

		.line {
			color: #CCCCCC;
		}

		.pic {
			width: 130rpx;
			height: 36rpx;
			background-size: 100%;
			// @include index_new_img(theme);

			image {
				width: 100%;
				height: 100%;
				display: block !important;
			}
		}

		.swipers {
			height: 100%;
			width: 444rpx;
			overflow: hidden;

			swiper {
				height: 100%;
				width: 100%;
				overflow: hidden;
				font-size: 22rpx;
				color: #333333;
			}
		}

		.iconfont {
			color: #999999;
			font-size: 20rpx;
		}
	}

	.sticky-box {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		position: -webkit-sticky;
		/* #endif */
		position: sticky;
		/* #ifdef H5*/
		top: var(--window-top);
		/* #endif */

		z-index: 99;
		flex-direction: row;
		margin: 0px;
		background: #f5f5f5;
		padding: 30rpx 0;
		/* #ifdef MP || APP-PLUS*/
		//top: 110rpx;
		/* #endif */
	}

	.tab {
		position: relative;
		display: flex;
		font-size: 28rpx;
		white-space: nowrap;

		&__item {
			flex: 1;
			padding: 0 20rpx;
			text-align: center;
			height: 60rpx;
			line-height: 60rpx;
			color: #666;

			&.active {
				color: #09C2C9;
			}
		}
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.privacy-wrapper {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #7F7F7F;

		.privacy-box {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 560rpx;
			padding: 50rpx 45rpx 0;
			background: #fff;
			border-radius: 20rpx;

			.title {
				text-align: center;
				font-size: 32rpx;
				text-align: center;
				color: #333;
				font-weight: 700;
			}

			.content {
				margin-top: 20rpx;
				line-height: 1.5;
				font-size: 26rpx;
				color: #666;
				text-indent: 54rpx;

				i {
					font-style: normal;
					color: $theme-color;
				}
			}

			.btn-box {
				margin-top: 40rpx;
				text-align: center;
				font-size: 30rpx;

				.btn-item {
					height: 82rpx;
					line-height: 82rpx;
					background: linear-gradient(90deg, #F67A38 0%, #F11B09 100%);
					color: #fff;
					border-radius: 41rpx;
				}

				.btn {
					padding: 30rpx 0;
				}
			}
		}
	}

	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		background: linear-gradient(180deg, #fff 0%, #f5f5f5 100%);

		.header {
			width: 100%;
			@include main_bg_color(theme) padding: 28rpx 30rpx;

			.serch-wrapper {
				align-items: center;


				.logo {
					width: 180rpx;
					height: 42rpx;
					margin-right: 24rpx;
					color: white;
					font-size: 40rpx;
					line-height: 40rpx;
				}

				image {
					width: 118rpx;
					height: 42rpx;
				}

				.input {
					display: flex;
					align-items: center;
					width: 546rpx;
					height: 58rpx;
					padding: 0 0 0 30rpx;
					background: rgba(247, 247, 247, 1);
					border: 1px solid rgba(241, 241, 241, 1);
					border-radius: 29rpx;
					color: #BBBBBB;
					font-size: 26rpx;

					.iconfont {
						margin-right: 20rpx;
						font-size: 26rpx;
						color: #666666;
					}
				}
			}

			.tabNav {
				padding-top: 24rpx;
			}
		}

		/* #ifdef MP || APP-PLUS */
		.mp-header {
			z-index: 999;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			/* #ifdef H5 */
			padding-bottom: 20rpx;
			/* #endif */
			@include main_bg_color(theme);

			.serch-wrapper {
				height: 100%;
				align-items: center;
				padding: 0 50rpx 0 53rpx;

				image {
					width: 118rpx;
					height: 42rpx;
					margin-right: 30rpx;
				}

				.input {
					display: flex;
					align-items: center;
					/* #ifdef MP */
					width: 305rpx;
					/* #endif */
					/* #ifdef APP-PLUS */
					flex: 1;
					/* #endif */
					height: 50rpx;
					padding: 0 0 0 30rpx;
					background: rgba(247, 247, 247, 1);
					border: 1px solid rgba(241, 241, 241, 1);
					border-radius: 29rpx;
					color: #BBBBBB;
					font-size: 28rpx;

					.iconfont {
						margin-right: 20rpx;
					}
				}
			}
		}

		/* #endif */

		.page_content {
			background-color: #f5f5f5;
			/* #ifdef H5 */
			// margin-top: 20rpx !important;
			/* #endif */
			padding: 0 30rpx;

			.swiper {
				position: relative;
				width: 100%;
				height: 320rpx;
				margin: 0 auto;
				border-radius: 10rpx;
				overflow: hidden;
				margin-bottom: 25rpx;
				/* #ifdef MP */
				z-index: 10;
				margin-top: 20rpx;

				/* #endif */
				swiper,
				.swiper-item,
				image {
					width: 100%;
					height: 320rpx;
					border-radius: 10rpx;
				}
			}

			.nav {
				padding-bottom: 26rpx;
				background: #fff;
				opacity: 1;
				border-radius: 14rpx;
				width: 100%;
				margin-bottom: 30rpx;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 20%;
					margin-top: 30rpx;

					image {
						width: 82rpx;
						height: 82rpx;
					}
				}
			}

			.nav-bd {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.txt {
						font-size: 32rpx;
						color: #282828;
					}

					.label {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 124rpx;
						height: 32rpx;
						margin-top: 5rpx;
						font-size: 24rpx;
						color: #999;
					}

					&.active {
						color: $theme-color;

						.txt {
							@include main-color(theme);
						}

						.label {
							// background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
							@include linear-gradient(theme);
							border-radius: 16rpx;
							color: #fff;
						}
					}
				}
			}

			.index-product-wrapper {
				margin-bottom: 110rpx;

				&.on {
					min-height: 1500rpx;
				}

				.list-box {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.item {
						width: 335rpx;
						margin-bottom: 20rpx;
						background-color: #fff;
						border-radius: 10rpx;
						overflow: hidden;

						image {
							width: 100%;
							height: 330rpx;
						}

						.text-info {
							padding: 10rpx 20rpx 15rpx;

							.title {
								color: #222222;
							}

							.old-price {
								margin-top: 8rpx;
								font-size: 26rpx;
								color: #AAAAAA;
								text-decoration: line-through;

								text {
									margin-right: 2px;
									font-size: 20rpx;
								}
							}

							.price {
								display: flex;
								align-items: flex-end;
								@include price-color(theme);
								font-size: 34rpx;
								font-weight: 800;
								margin-top:0;
								text {
									padding-bottom: 4rpx;
									font-size: 24rpx;
									font-weight: 800;
								}

								.txt {
									display: flex;
									align-items: center;
									justify-content: center;
									width: 28rpx;
									height: 28rpx;
									margin-left: 15rpx;
									margin-bottom: 10rpx;
									border: 1px solid $theme-color;
									border-radius: 4rpx;
									font-size: 22rpx;
									font-weight: normal;
								}
							}
						}
					}

					&.on {
						display: flex;
					}
				}
			}
		}
	}

	.pictrue {
		position: relative;
	}

	.fixed {
		z-index: 100;
		position: fixed;
		left: 0;
		top: 0;
		background: linear-gradient(90deg, red 50%, #ff5400 100%);

	}

	.mores-txt {
		width: 100%;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		color: #999;
		font-size: 24rpx;

		.iconfont {
			margin-top: 2rpx;
			font-size: 20rpx;
		}
	}

	.menu-txt {
		font-size: 24rpx;
		color: #454545;
	}

	.mp-bg {
		position: absolute;
		left: 0;
		/* #ifdef H5 */
		top: 98rpx;
		/* #endif */
		width: 100%;
		height: 344rpx;
		@include index-gradient(theme);
	}
</style>
