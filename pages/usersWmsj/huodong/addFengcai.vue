<template>
	<view>
		<view class='personal-data pad30'>
			<u--form :rules="rules" :model="editActivityLog" ref="form1" labelPosition="left">

				<u-divider text="选择活动" textPosition="left"></u-divider>
				<uni-view v-if="!activityInfo.activityId" class="u-upload__wrap"
					@click="selectActivityShow">
					<uni-view  style="width: 160rpx; height: 160rpx;display: flex;
									flex-direction: column;
									align-items: center;
									justify-content: center;
									width: 80px;
									height: 80px;
									background-color: #f4f5f7;
									border-radius: 2px;
									margin: 0 8px 8px 0;
									box-sizing: border-box;">
							<u-icon name="plus"></u-icon>
					</uni-view>

				</uni-view>


				<view v-if="activityInfo.activityId" class="huodongList skeleton">
					<view class='list' @click="selectActivityShow">
						<!--一张图片的文章-->
						<view hover-class='none' class='item acea-row row-between-wrapper'>
							<view class='pictrue skeleton-rect'>
								<image :src='activityInfo.activityImages'></image>
							</view>
							<view>
								<view class='name line2 skeleton-rect'>
									{{activityInfo.activityName}}
								</view>
								<view class='prop line2 skeleton-rect'>

									<view class="leixing skeleton-rect">
										<text class='iconfont icon-dijiachangxuan'></text>{{activityInfo.serviceType}}
									</view>
									<view class="renshu skeleton-rect">
										<text class='iconfont icon-shijian1'>
										</text>{{activityInfo.createTime.substring(0,12)}}
									</view>
								</view>

							</view>
						</view>
					</view>
				</view>



				<u-divider text="编写活动详细内容" textPosition="left"></u-divider>
				<view class="textarea">
					<u--textarea confirmType="done" v-model="editActivityLog.detail" placeholder="请输入内容" count maxlength="500"
						height="140"></u--textarea>
				</view>
				<u-divider text="上传活动照片" textPosition="left"></u-divider>
				<view class="img">
					<u-upload uploadIcon="plus" :fileList="fileList1" @afterRead="afterRead" @delete="deletePic"
						name="1" multiple previewFullImage :maxCount="6"></u-upload>
				</view>
				<u-divider text="上传活动视频" textPosition="left"></u-divider>
				<view class="video">
					<u-upload :fileList="fileList2" @afterRead="afterRead" @delete="deletePic" name="2" :maxDuration="120" compressed
						:maxCount="1" accept="video" previewFullImage></u-upload>
				</view>

				<p style="padding: 20rpx 20rpx;width: 710rpx; line-height: 40rpx;color: red;">
					完整的填写信息提交点单后，实践站管理员会进行审核，审核通过后进行发布。
				</p>
			</u--form>
			<button class='modifyBnt' @click="formSubmit">发布</button>
		</view>
		<u-popup :show="showMyOverActivity" @close="close" @open="open">
			<view class="huodongList skeleton">
				<view class='list' v-if="huodongList">
					<block v-for="(item,index) in huodongList" :key="index">
						<!--一张图片的文章-->
						<view @tap="selectActivityHandle(item)" hover-class='none'
							class='item acea-row row-between-wrapper'>
							<view class='pictrue skeleton-rect'>
								<image :src='item.activityImages'></image>
							</view>
							<view>
								<view class='name line2 skeleton-rect'>
									{{item.activityName}}
								</view>
								<view class='prop line2 skeleton-rect'>

									<view class="leixing skeleton-rect">
										<text class='iconfont icon-dijiachangxuan'></text>{{item.serviceType}}
									</view>
									<view class="renshu skeleton-rect">
										<text class='iconfont icon-shijian1'> </text>{{item.createTime.substring(0,12)}}
									</view>
								</view>

							</view>
						</view>
					</block>
				</view>
				<uni-load-more :status="more" @clickLoadMore="getPaidans"></uni-load-more>
			</view>

		</u-popup>
	</view>
</template>

<script>
	import {
		addFengcai,
		getMyHuodongOverList
	} from '@/api/wmsj.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js'
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'

	let app = getApp();
	export default {

		dicts: ['sys_normal_disable', 'wmsj_lingyu'],
		components: {
			// #ifdef MP
			authorize,
			// #endif
			'uni-load-more': loadMore
		},
		data() {
			return {
				showMyOverActivity: false,
				editActivityLog: {
					detail: '',
					images: null,
					video: null,
					imageArr: [],
					activityId: null
				},
				activityInfo: {
					activityId: 0,
					serviceType: null,
					activityState: null,
					activityName: null,
					createTime: null,
					activityAddress: null
				},

				fileList1: [],
				fileList2: [],
				huodongList: [],
				page: 1,
				limit: 8,
				more: "noMore",
				rules: {
					'detail': {
						type: 'string',
						required: true,
						message: '请输入',
					},

				},
			};
		},
		computed: mapGetters(['isLogin', 'uid', 'userInfo']),
		onShow() {
			if (this.userInfo.groupId != 2) {
				uni.showModal({
					title: "加入文明实践系统",
					content: "您还未加入文明实践系统，请完善信息。",
					showCancel: false,
					complete: function() {
						uni.navigateTo({
							url: '/pages/usersWmsj/addzyz/index'
						})
					}
				})
			}
		},
		onLoad() {
			if (!this.isLogin) {
				toLogin();
			}
			this.getMyOvers()
		},
		methods: {
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				let that = this
				return new Promise((resolve, reject) => {
					that.$util.uploadLocalImage({
							name: 'multipart',
							model: "user",
							pid: 7
						}, url,
						function(res) {
							setTimeout(() => {
								resolve(res.data.url)
							}, 1000)

						});
				})
			},
			/**
			 * 提交修改
			 */
			formSubmit: Debounce(function(e) {
				let that = this
				if (that.fileList1.length <= 0) {
					uni.showToast({
						title: '请至少选择一张活动照片',
						duration: 2000,
						icon: 'none'
					})
					return
				}
				console.log(that.editActivityLog)
				if (that.editActivityLog.activityId == null) {
					uni.showToast({
						title: '请选择活动',
						duration: 2000,
						icon: 'none'
					})
					return
				}
				
				that.editActivityLog.imageArr = [];
				that.fileList1.forEach(function(element) {
					that.editActivityLog.imageArr.push(element.url);
				});
				if (that.fileList2.length > 0) {
					that.editActivityLog.video = that.fileList2[0].url
				}
				
				that.$refs.form1.validate().then(res => {
					addFengcai(that.editActivityLog).then(res => {
						return that.$util.Tips({
							title: '活动风采稿件已提交。',
						}, {
							tab: 3,
							url: 1
						});
					}).catch(msg => {
						uni.showToast({
							title: msg || '保存失败',
							duration: 4000,
							icon: 'none'
						})
					});
				}).catch(errors => {

				})
			}),
			//已报名
			getMyOvers() {
				let that = this
				let limit = that.limit;
				let page = that.page;
				let huodongList = that.huodongList;
				getMyHuodongOverList({
					page: page,
					limit: limit,
					groupName: that.keyword
				}).then(res => {
					let huodongListNew = [];
					let len = res.data.list.length;
					huodongListNew = huodongList.concat(res.data.list);
					that.page++;
					that.$set(that, 'huodongList', huodongListNew);
					if (limit > len) {
						that.more = "noMore"
					} else {
						that.more = "more"
					}

				});
			},

			selectActivityShow() {
				this.showMyOverActivity = true
			},
			selectActivityHandle(item) {
				this.activityInfo = item
				this.editActivityLog.activityId=item.activityId
				this.showMyOverActivity = false
			},
			close() {
				this.showMyOverActivity = false
			},
			open() {

			}

		},

	}
</script>

<style>
	.disabled {
		background-color: #eeeeee;
	}

	.personal-data {
		padding-top: 30rpx;
		background-color: #fff;
	}

	.personal-data .img {
		margin-top: 30rpx;
	}

	.personal-data .video {
		margin-top: 30rpx;
	}

	.personal-data .textarea {
		padding-bottom: 10rpx;
		border: #eeeeee 1px solid;

		textarea {
			width: 96%;
			padding: 2%;
		}
	}

	.u-form-item {
		width: 640rpx;
	}


	.modifyBnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 76rpx auto 0 auto;
		background-color: #E93323;
	}

	.huodongList {
		width: 750rpx;
		background-color: white;
		margin-top: 20rpx;
	}

	.huodongList .list .item {
		margin: 0 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 35rpx 0;

	}

	.huodongList .list .item .pictrue {
		width: 220rpx;
		height: 150rpx;

	}


	.huodongList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 2rpx;
	}



	.huodongList .list .item .name {
		width: 450rpx;
		font-size: 30rpx;
		font-weight: 700;
		line-height: 50rpx;
		padding: 10rpx;
	}

	.huodongList .list .item .prop .renshu {
		width: 200rpx;
		font-size: 24rpx;
		color: #969696;
		float: left;
		text-align: center;
	}

	.huodongList .list .item .prop .leixing {
		width: 200rpx;
		font-size: 24rpx;
		color: #969696;
		float: left;
	}
</style>
