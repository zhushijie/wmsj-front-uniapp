<template>
	<view class="content sign2">
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map class="map" @callouttap @controltap="controltap" :scale="scale" :controls="controls"
					:latitude="latitude" :longitude="longitude" :circles="circles" :markers="covers" />
			</view>
			<view class="text-info">
				<view class="inputV" style="display: flex;justify-content: space-between;">
					<view>我的位置 （<text :class="isTrue ? 'colorBlue' : 'colorRed'">{{signstate}}</text> ）</view>
					<view>精确度:{{accuracy}}</view>
				</view>
				<view class="inputV">
					<view class="t">当前位置</view>
					<view class="text" @click="openLocation">{{address}}</view>
				</view>
				<view class="inputV" style="display: none;">
					<view class="t">备注</view>
					<input class="text" type="text" v-model="signInfo.remarks" placeholder="选填备注">
				</view>
				<view class="inputV">
					<u-button :disabled="!isTrue" @click="clickSign" type="primary" :text="time+'---'+signText"></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getActivityInfo,
		daka
	} from "@/api/wmsj.js"
	import {
		formateDate,
		pointInsideCircle
	} from "@/utils/util.js" //时间按格式化
	export default {
		data() {
			return {
				type: null,
				activityId: null,
				isTrue: false, //是否在范围内
				signText: "", //打卡文字
				signstate: "", //打卡状态
				r: 80, //半径
				scale: "17", //缩放
				clickNum: 0, //点击重新获取位置信息次数
				latitude: "", //当前经度
				longitude: "", //当前维度
				accuracy: "",
				activityInfo: {},
				address: "我的位置", //公司位置-名称	
				time: formateDate(new Date(), 'h:min:s'), //当前时分秒
				signInfo: {
					mode: "",
					latitude: "",
					longitude: "",
					address: "",
					time: "",
					remarks: ""
				}, //打卡信息 （模式，经纬度，地址，时间 备注）
				covers: [
					// 公司点信息
					{
						id: 0,
						callout: {
							content: "*****科技有限公司",
							display: "ALWAYS",
						},
						latitude: 37.788338,
						longitude: 112.557031,
						iconPath: '../../static/img/location.png'
					},
				],
				circles: [
					// 公司圆信息
					{
						latitude: 37.788338,
						longitude: 112.557031,
						radius: 80,
						strokeWidth: 1,
						fillColor: "#7fff0099"
					},
				],
				controls: [
					// 控件
					{
						id: 0,
						position: {
							left: 300,
							top: 300,
							width: 32,
							height: 32
						},
						iconPath: "../../static/img/resetlo.png",
						clickable: true
					}
				],
			}
		},
		onLoad(options) {

			if (options.hasOwnProperty('activityId')) {
				this.activityId = options.activityId;
			}
			if (options.hasOwnProperty('type')) {
				this.signInfo.mode = options.type;
			}
			try {
				this.user_latitude = uni.getStorageSync('user_latitude');
				this.user_longitude = uni.getStorageSync('user_longitude');
			} catch (e) {
				// error
			}
			this.getActivity()
			this.getTime()
		},

		methods: {
			// 初始化数据  （公司的经纬度 公司名称 打卡范围 ）
			getActivity() {
				let that = this
				getActivityInfo(that.activityId).then(res => {
					that.activityInfo = res.data
					that.covers[0].callout.content = this.activityInfo.address;
					that.covers[0].latitude = that.circles[0].latitude = this.activityInfo.latitude;
					that.covers[0].longitude = that.circles[0].longitude = this.activityInfo.longitude;
					that.r = that.circles.radius = 80;
					that.getLocation()
					
				});
			},
			// 获取当前位置
			getLocation() {
				var that = this;
				if (this.clickNum !== 0) {
					uni.showLoading({
						title: "获取中...",
						mask: true
					})
				}
				if (this.clickNum >= 3) {
					uni.showToast({
						title: "请稍后尝试！",
						icon: "none",
						mask: true
					});
					return;
				}
				this.clickNum++;
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success(res) { 
						uni.hideLoading();
						that.accuracy = res.accuracy;
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.scale = 17;
						that.covers[1] = {
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../static/img/location.png'					
						}
						var s = pointInsideCircle([that.latitude, that.longitude], [that.circles[0].latitude, that .circles[0].longitude], that.r / 100000);
						that.signstate = s ? "在活动范围内" : "不再活动范围内";
						that.signText = s ? "正常打卡" : "不可打卡";
						that.signInfo.latitude = res.latitude;
						that.signInfo.longitude = res.longitude;
						that.isTrue=s
						that.getAddress()
					},
					fail(err) {
						
						uni.hideLoading()
						that.signText = "请检查位置信息";
						uni.showToast({
							title: "请检查位置信息状态！",
							icon: "none",
							mask: true,
							duration: 3000
						})
					}
				});
			},
			
			// 腾讯位置服务 
			getAddress() {

				var that = this;
				var url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${that.latitude},${that.longitude}&key=77HBZ-MLZWU-FD6VG-BEW5X-COJXV-SVF5L`;
				console.log(url)
				uni.request({
					url,
					success(res) {
						var data = res.data;
						if (data.status != 0) {
							uni.showToast({
								title: data.message,
								icon: "none"
							})
							return;
						}
					}
				})
			},
			// 重新获取位置
			controltap(e) {
				this.getLocation()
			},

			// 选择地址
			openLocation() {
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						that.address = res.address;
						that.signInfo.address = res.address;
						// 这里是有问题的 .返回的 res 中有经纬度，地址名  如果使用这个经纬度 就会存在问题，（当前位置和公司位置重合），所以不建议使用这个经纬度。
						var s = pointInsideCircle([that.latitude, that.longitude], [that.circles[0].latitude,
							that.circles[0].longitude
						], that.r / 10000);
						that.isTrue = s;
						that.signstate = s ? "在活动范围内" : "不再活动范围内";
						that.signText = s ? "正常打卡" : "不可打卡";
					}
				});
			},
			
			// 实时时间
			getTime() {
				var that = this;
				setInterval(function() {
					that.time = formateDate(new Date(), 'h:min:s')
				}, 1000)
			},
			// 点击打卡
			clickSign() {
				let that=this
				var isTrue = this.isTrue;
				if (!isTrue) {
					uni.showToast({
						title: "不在打卡范围内！",
						icon: "none",
						mask: true,
						duration: 3000 
					})
					return;
				}
				daka(this.activityId,this.signInfo).then(res => {
					this.isTrue=false
					return that.$util.Tips({
						title: res.message,
						icon: 'none'
					}, {
						tab: 3,
						url: 1
					});
					this.signInfo.time = formateDate(new Date(), 'Y-M-D h:min:s');
				}).catch(msg => {
					uni.showToast({
						title: msg|| '打卡失败',
						duration: 3000,
						icon:'none'
					})
				});
				
			},
		}
	}
</script>

<style>
	uni-page-body {
		height: 100%;
		overflow: hidden;
		width: 100%
	}

	.sign2 {
		width: 100%;
		height: 100%;
	}

	/* #ifdef APP-PLUS */
	.sign2 {
		height: 100vh;
		overflow: hidden;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.sign2 {
		height: 100vh;
		overflow: hidden;
	}

	/* #endif */
	.map {
		width: 100%;
		height: 350px;
	}

	.colorGreen {
		color: #32CD32;
	}

	.colorBlue {
		color: #007aff
	}

	.colorRed {
		color: red
	}

	.bgBlue {
		background-color: #007aff;
	}

	.bgGreen {
		background-color: #32CD32;
	}

	.bgAsh {
		background-color: #C8C7CC;
	}

	.inputV {
		padding: 20upx
	}

	.inputV .t {
		font-size: 36upx
	}

	.inputV .text {
		border-bottom: 1px solid #000;
		width: 100%;
		color: #666;
	}
</style>
