<template>

	<view class='page' :data-theme="theme">
		<view class="page_content skeleton">
			<view class="mp-bg"></view>
			<view id="pageIndex">
				<!--幻灯片-->
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
			</view>
		</view>
		
		
		<!--志愿者社区 活动风采-->
		<view style="margin-top: 20rpx;border-top: 10px solid #f5f5f5;">			
			<Dynamic v-for="(item,index) in fengcaiList" :key="index" 
				:imgList="item.imageArr" 
				:avatar="item.avatar"
				:name="item.realName"
				:publishTime="item.createTime"
				:content="item.detail"
				:isLike="true"
				:isGiveReward="true"
				:likeNumber="20"
				:giveRewardNumber="20"
				:chatNumber="50"
				@clickDynamic="clickDynamic(index)"
				@clickUser="clickUser(item.id)"
				@clickThumbsup="clickThumbsup(item.id)"
				@clickGiveReward="clickGiveReward(item.id)"
				@clickChat="clickChat(item.id)">
			</Dynamic>
			
		</view>
		<uni-load-more :status="more" @clickLoadMore="getFengcaiLists" ></uni-load-more>

	</view>
</template>

<script>

	import { getIndexData,getFengcaiList } from '@/api/wmsj.js';
	import animationType from '@/utils/animationType.js' 
	import {goPage} from '@/libs/iframe.js'
	import home from '@/components/home';
	import parser from "@/components/jyf-parser/jyf-parser";
	import Dynamic from '@/components/qizai-dynamic/Dynamic.vue'
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			home,
			"jyf-parser": parser,
			Dynamic,
			'uni-load-more':loadMore
		},
		data() {
			return {
				id: 770,
				aid: 0,
				imgUrls: [{
					imageInputs: []
				}],
				circular: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				zhiyuanzheNum:0,
				theme: 'theme1',
				fengcaiList:[],
				page: 1,
				limit: 8, 
				more :"noMore",
				keyword: '',
				
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			uni.getStorage({
				key: 'theme',
				success: function(res) {
					that.theme = res.data;
				}
			});
			this.indexInit()
			this.getFengcaiLists()
		},
		onReachBottom: function () {
			this.getFengcaiLists();
		},
		onPullDownRefresh () {
		    this.page=1
			this.fengcaiList=[]
			this.getFengcaiLists();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
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
			indexInit() {
				let that = this;
				getIndexData().then(res => {
					console.log(res)
					that.$set(that, "imgUrls", res.data.banner);
					that.$set(that, "zhiyuanzheNum", res.data.zhiyuanzheNum);
					
				})
				
			},
			getFengcaiLists(){
				let that=this
				let limit = that.limit;
				let page = that.page;
				let fengcaiList = that.fengcaiList;
				
				getFengcaiList({
					page: page, 
					limit: limit
				}).then(res => {
					let fengcaiListNew = [];
					let len = res.data.list.length;
					fengcaiListNew = fengcaiList.concat(res.data.list);
					that.page++;
					that.$set(that, 'fengcaiList', fengcaiListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
							
				});
			},
			clickDynamic(e){
				console.log('childDynamic');
			},
			// 点击用户信息
			clickUser(e){
				console.log(e);
				console.log('childUser');
			},

			// 点赞
			clickThumbsup(e){
				console.log(e);
				console.log('childThumbsup');
			},
			// 点击打赏
			clickGiveReward(e){
				console.log(e);
				console.log('clickGiveReward');
			},
			// 点击聊天
			clickChat(e){
				console.log(e);
				console.log('clickChat');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #fff !important;
	}

	.line {
		border-bottom: 5px solid #eee;
		margin: 10px 0px 0 0px;
	}

	.show {
		text-align: right;
		margin-right: -30rpx;
		margin-top: -40rpx;
	}

	.unfold {}

	.fold {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;

	}


	.button {
		width: 80rpx;
		height: 60rpx;
		background: linear-gradient(-90deg, rgba(231, 182, 103, 1) 0%, rgba(255, 234, 181, 1) 100%);
		border-radius: 25rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #8D5306;
	}
	.service .service_title {
		display: inline;
		justify-content: space-between;
		padding: 24rpx 0rpx;
		margin: 0rpx 24rpx;
	}

	.service .service_title .left_con {
		width: 500rpx;
		display: inline;
	}

	.service .service_title .left_con .Stitle {
		line-height: 60rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		float: left;
		margin-left: 20rpx;

	}

	.service .service_title .left_con image {
		width: 60rpx;
		height: 60rpx;
		float: left;
		margin-left: 10rpx;
	}

	.service .service_title .right_con {
		font-size: 30rpx;
		font-weight: 400;
		line-height: 60rpx;
		width: 180rpx;
		display: inline;
		float: right;
		color: #999999;
	}

	.service .nav {
		padding-bottom: 26rpx;
		background: #fff;
		opacity: 1;
		border-radius: 14rpx;
		width: 100%;
		margin-bottom: 30rpx;
	}

	.service .nav .item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 25%;  
		margin-top: 5rpx;

	}

	.service .nav .item .menu-txt {
		font-size: 24rpx;
		color: #000000;
	}

	.service .nav .item image {
		width: 82rpx;
		height: 82rpx;
		border-radius: 40rpx;
	}

   .fengcai_title{
		display: flex;
		justify-content: space-between;
		padding: 24rpx 0rpx;
		margin: 0rpx 24rpx;
	}
	.fengcai_title .left_con{
	
	}
	
	.fengcai_title .left_con .title{
		line-height: 60rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		float: left;
		margin-left: 20rpx;
		    
	}
	
	.fengcai_title .left_con image{
		width: 60rpx;
		height: 60rpx;
		float: left;
		margin-left: 10rpx;
	}
	
	.fengcai_title .right_con{
		font-size: 24rpx;
		font-weight: 400;
		line-height: 45rpx;
		color: #999999;
	}
	
	.mp-bg {
		position: absolute;
		left: 0;
		width: 100%;
		height: 344rpx;
		background-image: url('@/static/img/wmsj/wmsj_bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.page_content {
		background-color: #fff;
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
				width: 25%;
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
							margin-top: 0;

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
</style>
