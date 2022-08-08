<template :data-theme="theme">
	<view class="goodCate1">
		<view class="header acea-row row-center-wrapper">
			<navigator url='/pages/index/index' class="pageIndex acea-row row-center-wrapper" hover-class="none" open-type="switchTab">
				<text class="iconfont icon-fanhuishouye"></text>
			</navigator>
			<navigator url="/pages/goods_search/index" class="search acea-row row-middle" hover-class="none">
				<text class="iconfont icon-sousuo5"></text>
				搜索商品
			</navigator>
		</view>
		<view class="conter"  v-if="showSlide">
			<view class='aside'>
				<view class='item acea-row row-center-wrapper' :class='index==navActive?"on":""' v-for="(item,index) in productList"
				 :key="index" @click="tapNav(index,item)">
					<text>{{item.name}}</text>
				</view>
			</view>
			<view class="wrapper">
				<view class="bgcolor" v-if="iSlong">
					<view class="longTab acea-row row-middle">
						<scroll-view scroll-x="true" style="white-space: nowrap; display: flex;height:44rpx;" scroll-with-animation
						 :scroll-left="tabLeft" show-scrollbar="true">
							<view class="longItem" :style='"width:"+isWidth+"px"' :class="index===tabClick?'click':''" v-for="(item,index) in categoryErList"
							 :key="index" @click="longClick(index,item)">{{item.name}}</view>
						</scroll-view>
					</view>
					<view class="openList" @click="openTap"><text class="iconfont icon-xiangxia"></text></view>
				</view>
				<view v-else>
					<view class="downTab">
						<view class="title acea-row row-between-wrapper">
							<view>{{categoryTitle}}</view>
							<view class="closeList" @click="closeTap"><text class="iconfont icon-xiangxia"></text></view>
						</view>
						<view class="children">
							<view class="acea-row row-middle">
								<view class="item line1" :class="index===tabClick?'click':''" v-for="(item,index) in categoryErList" :key="index"
								 @click="longClick(index,item)">{{item.name}}</view>
							</view>
						</view>
					</view>
					<view class="mask" @click="closeTap"></view>
				</view>
				<goodList :tempArr="tempArr" :isLogin="isLogin" @gocartduo="goCartDuo" @gocartdan="goCartDan" @ChangeCartNumDan="ChangeCartNumDan"
				 @detail="goDetail"></goodList>
				<view class='loadingicon acea-row row-center-wrapper mb-2'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
			</view>
		</view>
		<view class="conter"  v-else>
			<view class="hide_slide">
				<view class="bgcolor" v-if="iSlong">
					<view class="hongTab acea-row row-middle">
						<scroll-view scroll-x="true" style="white-space: nowrap; display: flex;height:44rpx;" scroll-with-animation
						 :scroll-left="tabLeft" show-scrollbar="true">
							<view class="longItem" :style='"width:"+isWidth+"px"' :class="index===tabClick?'click':''" v-for="(item,index) in productList"
							 :key="index" @click="navSwitch(index,item)">{{item.name}}</view>
						</scroll-view>
					</view>
					<view class="openList" @click="openTap"><text class="iconfont icon-xiangxia"></text></view>
				</view>
				<view v-else>
					<view class="hownTab">
						<view class="title acea-row row-between-wrapper">
							<view>{{categoryTitle}}</view>
							<view class="closeList" @click="closeTap"><text class="iconfont icon-xiangxia"></text></view>
						</view>
						<view class="children">
							<view class="acea-row row-middle">
								<view class="item line1" :class="index===tabClick?'click':''" v-for="(item,index) in productList" :key="index"
								 @click="navSwitch(index,item)">{{item.name}}</view>
							</view>
						</view>
					</view>
					<view class="mask" @click="closeTap"></view>
				</view>
				<view class="list_prod">
					<view class="item acea-row row-between-wrapper" v-for="(item,index) in tempArr" :key='index' @click="goDetail(item)">
						<view class="pic">
							<image :src="item.image" mode=""></image>
						</view>
						<view class="pictxt">
							<view class="text line2">{{item.storeName}}</view>
							<view class="bottom acea-row row-between-wrapper">
								<view class="money">
									<text class="sign">￥</text>{{item.price}}
								</view>
								<view v-if="item.stock>0">
									<view>
										<!-- 多规格 -->
										<view class="bnt" @click.stop="goCartDuo(item)">
											选规格
											<view class="num" v-if="item.cartNum">{{item.cartNum}}</view>
										</view>
									</view>
								</view>
								<view class="bnt end" v-else>已售罄</view>
							</view>
							<view>
								<text class="otPrice" v-if="item.sales">已售{{item.sales}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper mb-2'>
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
				</view>
			</view>
		</view>
		<view class="footer acea-row row-between-wrapper">
			<view class="cart_theme acea-row row-center-wrapper" v-if="cartData.cartList.length">
				<view class="iconfont icon-gouwuche-yangshi1 hava" @click="getCartLists(0)"></view>
				<view class="num">{{cartCount}}</view>
			</view>
			<view class="noCart" v-else>
				<view class="iconfont icon-gouwuche-yangshi1 no_have"></view>
			</view>
			<view class="money acea-row row-middle">
				<view>￥<text class="num">{{totalPrice}}</text></view>
				<view class="bnt gray_bg" :class="{ 'main_bg': cartCount > 0}"  @click="subOrder">去结算</view>
			</view>
		</view>
		<!-- <home></home> -->
		<cartList :cartData="cartData" @closeList="closeList" @ChangeCartNumDan="ChangeCartList" @ChangeSubDel="ChangeSubDel"
		 @ChangeOneDel="ChangeOneDel"></cartList>
		<productWindow :attr="attr" :isShow='1' :iSplus='1' :iScart='1' @myevent="onMyEvent" @ChangeAttr="ChangeAttr"
		 @ChangeCartNum="ChangeCartNumDuo" @attrVal="attrVal" @iptCartNum="iptCartNum" @goCat="goCatNum" id='product-window'></productWindow>
	</view>
</template>

<script>
	import {
		getCategoryList,
		getProductslist,
		getAttr,
		postCartAdd
	} from '@/api/store.js';
	import {
		getCartList,
		getCartCounts,
		cartDel,
		changeCartNum,
	} from '@/api/order.js';
	import productWindow from '@/components/productWindow';
	import goodList from '@/components/f_goodList';
	import cartList from '@/components/cartList';
	import home from '@/components/home';
	import {mapGetters} from 'vuex';
	import {goShopDetail} from '@/libs/order.js';
	import {toLogin} from '@/libs/login.js';
	import animationType from '@/utils/animationType.js'
	export default {
		computed: mapGetters(['isLogin', 'uid']),
		components: {
			productWindow,
			goodList,
			cartList,
			home
		},
		props: {
			showSlide: {
				type: Boolean,
				default:true 
			},
		},
		data() {
			return {
				productList: [],
				navActive: 0,
				categoryTitle: '',
				categoryErList: [],
				tabLeft: 0,
				isWidth: 0, //每个导航栏占位
				tabClick: 0, //导航栏被点击
				iSlong: true,
				tempArr: [],
				loading: false,
				loadend: false,
				loadTitle: '加载更多',
				page: 1,
				limit: 10,
				cid: 0, //一级分类
				sid: 0, //二级分类
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				productValue: [],
				attrValue: '', //已选属性
				storeName: '', //多属性产品名称
				id: 0,
				cartData: {
					cartList: [],
					iScart: false
				},
				cartCount: 0,
				totalPrice: 0.00,
				lengthCart: 0,
				theme:'theme1'
			}
		},
		created(){
			if(this.isLogin){
				this.getCartNum();
				this.getCartLists(1);
			}
			this.getAllCategory();
			let that = this;
			that.lengthCart = that.cartData.cartList;
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.isWidth = e.windowWidth / 5
				}
			});
		},
		methods: {
			// 生成订单；
			subOrder: function() {
				let that = this,list = that.cartData.cartList,ids = [];
				if(list.length){
					let shoppingCartId = list.map(item => {
						return {
							"shoppingCartId": Number(item.id)
						}
					})
					this.$Order.getPreOrder("shoppingCart", shoppingCartId);
					that.cartData.iScart = false;
				}else{
					return that.$util.Tips({
						title: '请选择产品'
					});
				}
			},
			// 计算总价；
			getTotalPrice: function(){
				let that = this,list = that.cartData.cartList,totalPrice = 0.00;
				list.forEach(item=>{
					if(item.attrStatus ){
						totalPrice = that.$util.$h.Add(totalPrice, that.$util.$h.Mul(item.cartNum, item.vipPrice ? item.vipPrice : item.price));
					}
				})
				that.$set(that,'totalPrice',totalPrice);
			},
			ChangeSubDel: function(event) {
				let that = this,list = that.cartData.cartList,ids = [];
				list.forEach(item=>{
					ids.push(item.id)
				});
				cartDel(ids.join(",")).then(res=>{
					that.$set(that.cartData,'cartList',[]);
					that.cartData.iScart = false;
					that.totalPrice = 0.00;
					that.page = 1;
					that.loadend = false;
					that.tempArr = [];
					that.productslist();
					that.getCartNum();
				})
			},
			ChangeOneDel:function(id,index){
				let that = this,list = that.cartData.cartList;
				cartDel(id.toString()).then(res=>{
					list.splice(index,1);
					if(!list.length){
						that.cartData.iScart = false;
						that.page = 1;
						that.loadend = false;
						that.tempArr = [];
						that.productslist();
					};
					that.getCartNum();
				})
			},
			getCartLists(iSshow) {
				let that = this;
				let data = {
					page: 1,
					limit: that.cartCount,
					isValid: true
				};
				getCartList(data).then(res => {
					that.$set(that.cartData, 'cartList', res.data.list);
					if(res.data.list.length){
						that.$set(that.cartData, 'iScart', iSshow?false:!that.cartData.iScart);
					}else{
						that.$set(that.cartData, 'iScart', false);
					}
					that.getTotalPrice();
				})
			},
			closeList(e) {
				this.$set(this.cartData, 'iScart', e);
				this.page = 1;
				this.loadend = false;
				this.tempArr = [];
				this.productslist();
			},
			getCartNum: function() {
				let that = this;
				getCartCounts(true, 'sum').then(res => {
					that.$set(that,'cartCount',res.data.count);
				});
			},


			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
			},
			/**
			 * 默认选中属性
			 * 
			 */
			DefaultSelect: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				for (let key in this.productValue) {
					if (this.productValue[key].stock > 0) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						break;
					}
				}
				for (let i = 0; i < productAttr.length; i++) {
					this.$set(productAttr[i], "index", value[i]);
				}
				//sort();排序函数:数字-英文-汉字；
				let productSelect = this.productValue[value.join(",")];
				
				if (productSelect && productAttr.length) {
					this.$set(this.attr.productSelect,"storeName",this.storeName);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.id);
					this.$set(this.attr.productSelect, "vipPrice", productSelect.vipPrice);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", value.join(","));
				} else if (!productSelect && productAttr.length) {
					this.$set(this.attr.productSelect,"storeName",this.storeName);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
				} else if (!productSelect && !productAttr.length) {
					this.$set(this.attr.productSelect,"storeName",this.storeName);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
					this.$set(this.attr.productSelect,"unique",this.storeInfo.unique || "");
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
				}
			},
			/**
			 * 属性变动赋值
			 * 
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				if (productSelect) {
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.id);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this.attr.productSelect, "vipPrice", productSelect.vipPrice);
					this.$set(this, "attrValue", res);
				} else {
					this.$set(this.attr.productSelect, "image", this.productInfo.image);
					this.$set(this.attr.productSelect, "price", this.productInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", this.productInfo.id);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this.attr.productSelect, "vipPrice", this.productInfo.vipPrice);
					this.$set(this, "attrValue", "");
				}
			},
			attrVal(val) {
				this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw].attrValues[val
					.indexn]);
			},
			/**
			 * 购物车手动填写
			 * 
			 */
			iptCartNum: function(e) {
				this.$set(this.attr.productSelect, 'cart_num', e);
			},
			onLoadFun() {},
			// 产品列表
			productslist: function() {
				let that = this;
				if (that.loadend) return; //如果返回列表长度小于请求分页长度，就让他为true,就不继续请求了
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '';
				getProductslist({
					page: that.page,
					limit: that.limit,
					type: 1,
					cid: that.sid,
				}).then(res => {
					let list = res.data.list,
						loadend = list.length < that.limit;
					that.tempArr = that.$util.SplitArray(list, that.tempArr);
					that.$set(that, 'tempArr', that.tempArr);
					that.loading = false;
					that.loadend = loadend;
					that.loadTitle = loadend ? "😕人家是有底线的~~" : "加载更多";
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false,
						that.loadTitle = '加载更多'
				});
			},
			// 改变多属性购物车
			ChangeCartNumDuo(changeValue) {
				//changeValue:是否 加|减
				//获取当前变动属性
				let productSelect = this.productValue[this.attrValue];
				//如果没有属性,赋值给商品默认库存
				if (productSelect === undefined && !this.attr.productAttr.length)
					productSelect = this.attr.productSelect;
				//无属性值即库存为0；不存在加减；
				if (productSelect === undefined) return;
				let stock = productSelect.stock || 0;
				let num = this.attr.productSelect;
				if (changeValue) {
					num.cart_num++;
					if (num.cart_num > stock) {
						this.$set(this.attr.productSelect, "cart_num", stock);
						this.$set(this, "cart_num", stock);
					}
				} else {
					num.cart_num--;
					if (num.cart_num < 1) {
						this.$set(this.attr.productSelect, "cart_num", 1);
						this.$set(this, "cart_num", 1);
					}
				}
				
			},
			// 已经加入购物车时的购物加减；
			ChangeCartList(changeValue, index) {
				let list = this.cartData.cartList;
				let num = list[index];
				let stock = list[index].stock;
				this.ChangeCartNum(changeValue, num, stock, 0, num.productId,index,1);
				if(!list.length){
					this.cartData.iScart = false;
					this.page = 1;
					this.loadend = false;
					this.tempArr = [];
					this.productslist();
				}
			},
			// 购物车加减计算函数
			ChangeCartNum: function(changeValue,index) {
				if (changeValue) {
					if (index.cartNum >= index.stock) {
						index.cartNum = index.stock;
					}else{
						index.cartNum++;
						changeCartNum(index.id, index.cartNum).then(res => {
							this.getCartNum(true);
							this.getTotalPrice();
						});
					}
				} else {
					index.cartNum--;
					changeCartNum(index.id, index.cartNum).then(res => {
						this.getCartNum(true);
						this.getTotalPrice();
					});
					if(index.cartNum == 0){
						cartDel(index.id).then(res=>{
							this.getCartLists(1);
							this.getTotalPrice();
							this.productslist();
							this.getCartNum();
						})
					}
				}
			},
			// 多规格加入购物车；
			goCatNum() {
				this.goCat(1);
			},
			/*
			 * 加入购物车
			 */
			goCat: function(num) {
				let that = this,
					productSelect = that.productValue[this.attrValue];
				//打开属性
				if (that.attrValue) {
					//默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
					that.attr.cartAttr = !that.isOpen ? true : false;
				} else {
					if (that.isOpen) that.attr.cartAttr = true;
					else that.attr.cartAttr = !that.attr.cartAttr;
				}
				//只有关闭属性弹窗时进行加入购物车
				if (that.attr.cartAttr === true && that.isOpen === false)
					return (that.isOpen = true);
				//如果有属性,没有选择,提示用户选择
				if (
					that.attr.productAttr.length &&
					productSelect.stock === 0 &&
					that.isOpen === true
				)
					return that.$util.Tips({
						title: "产品库存不足，请选择其它"
					});
				if (num === 1) {
					let q = {
						productId: parseFloat(that.id),
						cartNum: parseFloat(that.attr.productSelect.cart_num),
						isNew: false,
						productAttrUnique: that.attr.productSelect !== undefined ?
							that.attr.productSelect.unique : that.productInfo.id
					};
					postCartAdd(q).then(function(res) {
							that.isOpen = false;
							that.attr.cartAttr = false;
							that.$util.Tips({
								title: "添加购物车成功",
								success: () => {
									setTimeout(()=>{
										that.getCartNum(true);
										that.getCartLists(1);
									},100)
								}
							});
						})
						.catch(res => {
							that.isOpen = false;
							return that.$util.Tips({
								title: res
							});
						});
				} else {
					this.getPreOrder();
				}
			},
			goCartDuo(item) {
				if (!this.isLogin) {
					this.getIsLogin();
				} else {
					uni.showLoading({
						title: '加载中'
					});
					this.storeName = item.storeName;
					this.getAttrs(item.id,item.storeName);
					this.$set(this, 'id', item.id);
				}
			},
			getIsLogin() {
				toLogin();
			},
			// 商品详情接口；
			getAttrs(id) {
				let that = this;
				getAttr(id).then(res => {
					uni.hideLoading();
					that.$set(that.attr, 'productAttr', res.data.productAttr);
					that.$set(that, 'productValue', res.data.productValue);
					let productAttr = that.attr.productAttr.map(item => {
					return {
						attrName : item.attrName,
						attrValues: item.attrValues.split(','),
						id:item.id,
						isDel:item.isDel,
						productId:item.productId,
						type:item.type
					 }
					});
					this.$set(that.attr,'productAttr',productAttr);
					this.$set(that.attr, 'cartAttr', true);
					that.DefaultSelect();
				})
			},
			// 去详情页
			goDetail(item) {
				if (!this.isLogin) {
					toLogin();
				} else {
					goShopDetail(item, this.uid).then(res => {
						uni.navigateTo({
							animationType: animationType.type,							animationDuration: animationType.duration,
							url: `/pages/goods_details/index?id=${item.id}`
						});
					});
				}
			},


			openTap() {
				this.iSlong = false
			},
			closeTap() {
				this.iSlong = true
			},
			getAllCategory: function() {
				let that = this;
				getCategoryList().then(res => {
					res.data.forEach((item)=>{
						if(item.child){
							item.child.unshift({
								id:item.id,
								name:'全部'
							})
						}
					})
					let data = res.data;
					that.categoryTitle = data[0].name;
					that.sid = data[0].id;
					that.productList = data;
					that.categoryErList = res.data[0].child ? res.data[0].child : [];
					that.page = 1;
					that.loadend = false;
					that.tempArr = [];
					that.productslist();
				})
			},
			tapNav(index, item) {
				let list = this.productList[index];
				this.navActive = index;
				this.categoryTitle = list.name;
				this.categoryErList = item.child ? item.child : [];
				this.tabClick = 0;
				this.tabLeft = 0;
				this.sid = item.id;
				this.page = 1;
				this.loadend = false;
				this.tempArr = [];
				this.productslist();
			},
			// 导航栏点击
			longClick(index,item) {
				if (this.productList.length > 3) {
					this.tabLeft = (index - 1) * (this.isWidth + 6) //设置下划线位置
				};
				this.tabClick = index; //设置导航点击了哪一个
				this.iSlong = true;
				this.sid = item.id;
				this.page = 1;
				this.loadend = false;
				this.tempArr = [];
				this.productslist();
			},
			navSwitch(index,item){
				if (this.productList.length > 3) {
					this.tabLeft = (index - 1) * (this.isWidth + 6) //设置下划线位置
				};
				this.tabClick = index; //设置导航点击了哪一个
				this.iSlong = true;
				this.sid = item.id;
				this.page = 1;
				this.loadend = false;
				this.tempArr = [];
				this.productslist();
			},
		},
	}
</script>


<style lang="scss">
	page {
		background-color: $crmeb-bg-color;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	}

	.goodCate1 {
		background-color: $crmeb-bg-color;
		/deep/.mask {
			// z-index: 99;
		}

		/deep/.attrProduct {
			.mask {
				z-index: 100;
			}
		}

		.header {
			position: fixed;
			height: 128rpx;
			background-color: $crmeb-bg-color;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 99;
			border-bottom: 1px solid #D9D9D9;

			.pageIndex {
				width: 68rpx;
				height: 68rpx;
				border-radius: 50%;
				@include main_bg_color(theme);

				.iconfont {
					color: #fff;
					font-size: 30rpx;
				}

				// image{
				// 	width: 29rpx;
				// 	height: 30rpx;
				// }
			}

			.search {
				width: 600rpx;
				/* #ifdef MP || APP-PLUS */
				width: 550rpx;
				/* #endif */
				height: 68rpx;
				border-radius: 36rpx;
				background-color: $crmeb-bg-color-grey;
				font-size: 26rpx;
				color: $crmeb-font-color-disable;
				margin-left: 22rpx;
				padding: 0 30rpx;

				.iconfont {
					font-size: 30rpx;
					margin-right: 18rpx;
					color: $crmeb-font-color-subtitle;
				}

				// image{
				// 	width: 27rpx;
				// 	height: 27rpx;
				// 	margin-right: 18rpx;
				// }
			}
		}

		.conter {
			padding-top: 64px;
			box-sizing: border-box;
			.aside {
				position: fixed;
				width: 23%;
				left: 0;
				bottom: 0;
				top: 0;
				background-color: $crmeb-bg-color-grey;
				overflow-y: auto;
				overflow-x: hidden;
				margin-top: 128rpx;
				z-index: 99;
				padding-bottom: 140rpx;

				.item {
					height: 100rpx;
					width: 100%;
					font-size: 26rpx;
					color: $crmeb-font-color;

					&.on {
						background-color: $crmeb-bg-color;
						width: 100%;
						text-align: center;
						@include main_color(theme);
						font-weight: 500;
						position: relative;

						&::after {
							content: "";
							position: absolute;
							width: 6rpx;
							height: 46rpx;
							@include main_bg_color(theme);
							border-radius: 0 4rpx 4rpx 0;
							left: 0
						}
					}
				}
			}
		}
		.wrapper {
			margin-top: 104rpx;
			width: 77%;
			float: right;
			background-color: $crmeb-bg-color;
			padding-bottom: 130rpx;
		}
		.hide_slide{
			margin-top: 104rpx;
			width: 100%;
			float: right;
			background-color: $crmeb-bg-color;
			padding-bottom: 130rpx;
		}
		.bgcolor {
			width: 100%;
			background-color: $crmeb-bg-color;
		}
				
		.goodsList {
			margin-top: 0 !important;
		}
				
		.longTab {
			width: 65%;
			position: fixed;
			top: 0;
			margin-top: 128rpx;
			height: 100rpx;
			z-index: 99;
			background-color: $crmeb-bg-color;
		}
		.hongTab{
			width: 100%;
			position: fixed;
			top: 0;
			margin-top: 128rpx;
			height: 100rpx;
			z-index:99;
			background-color: $crmeb-bg-color;
		}
		.longItem {
			height: 44rpx;
			display: inline-block;
			line-height: 44rpx;
			text-align: center;
			font-size: 26rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: $crmeb-font-color;
			background-color: $crmeb-bg-color-grey;
			border-radius: 22rpx;
			margin-left: 12rpx;
			
			&.click {
				font-weight: bold;
				@include main_bg_color(theme);
				color: $crmeb-font-color-white;
			}
		}
			
		.underlineBox {
			height: 3px;
			width: 20%;
			display: flex;
			align-content: center;
			justify-content: center;
			transition: .5s;
			
			.underline {
				width: 33rpx;
				height: 4rpx;
				background-color: $crmeb-bg-color;
			}
		}	
		.openList {
			width: 12%;
			height: 100rpx;
			background-color: $crmeb-bg-color;
			line-height: 100rpx;
			padding-left: 30rpx;
			position: fixed;
			right: 0;
			top: 128rpx;
			z-index: 99;
				
			.iconfont {
				font-size: 22rpx;
				color: $crmeb-font-color-subtitle;
			}
		}
				
		.downTab {
			width: 77%;
			position: fixed;
			top: 0;
			margin-top: 128rpx;
			z-index: 99;
			background-color: $crmeb-bg-color;
			right: 0;
		}
		.hownTab{
			width: 100%;
			position: fixed;
			top: 0;
			margin-top: 128rpx;
			z-index: 99;
			background-color: $crmeb-bg-color;
			right: 0;
		}
		.title {
			font-size: 26rpx;
			color: $crmeb-font-color-assist;
			// padding-left: 20rpx;
			
			.closeList {
				width: 90rpx;
				height: 100rpx;
				line-height: 100rpx;
				padding-left: 30rpx;
				transform: rotate(180deg);
			
				.iconfont {
					font-size: 22rpx;
					color: $crmeb-font-color-subtitle;
				}
			}
		}
			
		.children {
			max-height: 500rpx;
			overflow-x: hidden;
			overflow-y: auto;
			padding-bottom: 20rpx;
			
			.item {
				height: 60rpx;
				background-color: $crmeb-bg-color-grey;
				border-radius: 30rpx;
				line-height: 60rpx;
				padding: 0 15rpx;
				margin: 0 0 20rpx 20rpx;
				width: 165rpx;
				text-align: center;
			
				&.click {
					font-weight: bold;
					@include main_bg_color(theme);
					color: $crmeb-font-color-white;
				}
			}
		}		
		.list_prod{
			padding: 0 30rpx;
			.item{
				width: 100%;
				box-sizing: border-box;
				margin-bottom: 40rpx;
				.pic{
					width: 180rpx;
					height: 180rpx;
					position: relative;
					image{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
			}
			.pictxt{
				width: 490rpx;
				.text{
					font-size:26rpx;
					font-family:PingFang SC;
					font-weight:500;
					color: $crmeb-font-color;
				}
				.bottom{
					margin-top: 22rpx;
					.money{
						font-size: 34rpx;
						font-weight: 800;
						width: 212rpx;
						@include price_color(theme);
						.sign{
							font-size: 24rpx;
						}
					}
					.cart{
						height: 46rpx;
						.pictrue{
							color: $crmeb-theme-color;
							font-size:46rpx;
							width: 46rpx;
							height: 46rpx;
							text-align: center;
							line-height: 46rpx;
							&.icon-jiahao{
								 color: $crmeb-theme-color;
							}
						}
						.num{
							font-size: 30rpx;
							color: $crmeb-font-color;
							font-weight: bold;
							width: 60rpx;
							text-align: center;
						}
					}
					.icon-gouwuche6{
						width: 46rpx;
						height: 46rpx;
						background-color: $crmeb-theme-color;
						border-radius: 50%;
						color: $crmeb-font-color-white;
						font-size: 30rpx;
					}
					.bnt{
						padding: 0 20rpx;
						height: 46rpx;
						line-height: 46rpx;
						@include main_bg_color(theme);
						border-radius:23rpx;
						font-size: 22rpx;
						color: $crmeb-font-color-white;
						position: relative;
						&.end{
							background:$crmeb-font-color-disable;
						}
						.num{
							min-width: 12rpx;
							@include main_color(theme);
							@include coupons_border_color(theme);
							background: #fff;
							border-radius: 15px;
							position: absolute;
							right: -13rpx;
							top: -11rpx;
							font-size: 16rpx;
							padding: 0 11rpx;
							height: 32rpx;
							line-height: 32rpx;
						}
					}
				}
				.otPrice{
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 400;
					line-height: 24rpx;
					color: #999999;
					
				}
			}
		}
		.footer {
			position: fixed;
			left: 0;
			bottom:env(safe-area-inset-bottom); 
			width: 100%;
			background-color: #fff;
			box-shadow: 0px -3rpx 16rpx rgba(36, 12, 12, 0.05);
			z-index: 101;
			padding: 0 30rpx;
			box-sizing: border-box;
			height: 100rpx;
			&:after{
				content:'';
				height:env(safe-area-inset-bottom); // 这里是重点
				position: absolute;
				top:100%;
				left: 0;
				right:0;
				background-color: #fff;
			}
			.cart_theme{
				margin-top: -50rpx;
				position: relative;
				.hava{
					font-size: 110rpx;
					@include main_color(theme);
				}
				.num{
					min-width: 12rpx;
					color: #fff;
					border-radius: 15px;
					position: absolute;
					right: -6rpx;
					bottom: 10rpx;
					font-size: 22rpx;
					padding: 0 10rpx;
					height: 34rpx;
					line-height: 34rpx;
					@include main_color(theme);
					@include coupons_border_color(theme);
					background-color: #fff;
				}
			}
			.noCart{
				margin-top: -50rpx;
				.no_have{
					font-size: 110rpx;
					color: #cbcbcb;
				}
			}
		
			.money {
				@include price_color(theme);
				font-size: 28rpx;
				font-weight: bold;
		
				.num {
					font-size: 42rpx;
				}
		
				.bnt {
					width: 222rpx;
					height: 76rpx;
					border-radius: 46rpx;
					line-height: 76rpx;
					text-align: center;
					color: #fff;
					margin-left: 24rpx;
				}
				.main_bg{
					@include main_bg_color(theme);
				}
				.gray_bg{
					background-color: #B3B3B4;
				}
			}
		}
	}
</style>