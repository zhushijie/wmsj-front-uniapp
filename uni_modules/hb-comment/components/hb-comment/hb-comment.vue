<template>
	<view class="hb-comment">
		
		<!-- 阅读数下边那条线-start -->
		<view class="seg_line_box">
			<view class="seg_line"></view>
			<view class="seg_dot"></view>
			<view class="seg_line"></view>
		</view>
		<!-- 阅读数下边那条线-end -->
		<!-- 评论主体-start --> 
		<view class="comment-list" v-if="commentData.comment.length != 0">
			<!-- 评论主体-顶部数量及发表评论按钮-start -->
			<view class="comment-num">
				<view>共 {{commentData.commentSize}} 条评论</view>
				<!-- 阅读数-start -->
				<view style="width: 80rpx;">
					<u-icon name="eye" color="#999999" size="20"></u-icon>
					
				</view>
				<view style="width: 200rpx;">
					<span class="top-read">浏览量：{{commentData.readNumer}}</span>
				</view>
				<!-- 阅读数-end -->
				
				<view class="add-btn">
					<u-button type="primary" size="mini" @click="commentInput">发表评论</u-button>
				</view>
			</view>
			<!-- 评论主体-顶部数量及发表评论按钮-end -->
			<!-- 评论列表-start -->
			<view class="comment-box" v-for="(item, index) in commentData.comment">
				<view class="comment-box-item">
					<view class="comment-avatar"  >
						<u-avatar class="comment-avatar" :src="item.avatarUrl" mode="circle"></u-avatar>
					</view>
					<view class="comment-main">
						<!-- 父评论体-start -->
						<view class="comment-main-top">
							<view class="nick-name-box">
								<view class="comLogo com1" v-if="index == 0">沙发</view>
								<view class="comLogo com2" v-if="index == 1">板凳</view>
								<view class="comLogo com3" v-if="index == 2">地板</view>
								<view class="nick-name">{{item.nickName}}</view>
							</view>
							<view class="zan-box" @click="like(item.id)">
								<span
									:class="item.hasLike ? 'isLike' : 'notLike'">{{item.likeNum == 0 ? '抢首赞' : item.likeNum}}</span>
								<u-icon :name="item.hasLike?'thumb-up-fill':'thumb-up'"
									:color="item.hasLike?'#2d8cf0':'#999999'" size="28"></u-icon>
							</view>
						</view>
						<view class="comment-main-content">
							<u-read-more :toggle="true" show-height="300" text-indent="0" close-text="展开">
								<rich-text :nodes="item.content"></rich-text>
							</u-read-more>
						</view>
						<view class="comment-main-foot">
							<view class="foot-time">{{item.createTime}}</view>
							<view class="foot-btn" @click="reply(item.nickName,item.nickName,item.id)">回复</view>
							<view class="foot-btn" v-if="item.owner" @click="confirmDelete(item.id)">删除</view>
						</view>
						<!-- 父评论体-end -->
						<!-- 子评论列表-start -->
						<view class="comment-sub-box">
							<view class="comment-sub-item" v-for="each in item.children">
								<view class="comment-avatar">
									<u-avatar class="comment-avatar" :src="each.avatarUrl" mode="circle"></u-avatar>
								</view>
								<view class="comment-main">
									<view class="sub-comment-main-top">
										<view class="nick-name">{{each.nickName}}</view>
										<view class="zan-box" @click="like(each.id)">
											<span
												:class="each.hasLike ? 'isLike' : 'notLike'">{{each.likeNum == 0 ? '抢首赞' : each.likeNum}}</span>
											<u-icon :name="each.hasLike?'thumb-up-fill':'thumb-up'"
												:color="each.hasLike?'#2d8cf0':'#999999'" size="28"></u-icon>
										</view>
									</view>
									<view class="comment-main-content">
										<u-read-more :toggle="true" show-height="300" text-indent="0" close-text="展开">
											<rich-text :nodes="each.content"></rich-text>
										</u-read-more>
									</view>
									<view class="comment-main-foot">
										<view class="foot-time">{{each.createTime}}</view>
										<view class="foot-btn" @click="reply(item.nickName,each.nickName,item.id)">
											回复</view>
										<view class="foot-btn" v-if="each.owner" @click="confirmDelete(each.id)">删除
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 子评论列表-end -->
					</view>
				</view>
			</view>
			<!-- 评论列表-end -->
		</view>
		<!-- 评论主体-end -->
		<!-- 无评论-start -->
		<view class="comment-none" v-else>
			暂无评论，<view @click="commentInput" style="color: #007AFF;display: inline;">抢沙发</view>
		</view>
		<!-- 无评论-end -->
		<!-- 新增评论-start -->
		<view class="comment-add" :style="'bottom:'+KeyboardHeight+'px;'">
			<view class="comment-submit">
				<view>
					<u-tag :text="'回复在 '+ pUser +' 的评论下'" type="info" closeable :show="showTag" @close="tagClose" />
				</view>
				<view>
					<u-button type="primary" size="mini" @click="add">提交评论</u-button>
				</view>
			</view>
			<u-input v-model="commentReq.content" type="textarea" :maxlength="800" height="100" :auto-height="true"
				:focus="focus" @blur="blur" @focus="focusOn" />
		</view>
		<!-- 新增评论-end -->
	</view>
</template>

<script>
	export default {
		name: 'hb-comment',
		props: {
			cmData: {
				type: Object,
				default: () => {
					return {
						"readNumer":0,
						"commentSize": 0,
						"comment": []
					};
				}
			},
			deleteTip: {
				type: String,
				default: () => {
					return '操作不可逆，如果评论下有子评论，也将被一并删除，确认？';
				}
			},
		},
		watch: {
			cmData: {
				handler: function(newVal, oldVal) {
					if(newVal.comment){
						this.commentData = newVal;
						//console.log(newVal)
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				"commentData": {
					"readNumer":0,
					"commentSize": 0,
					"comment": []
				},
				"commentReq": {
					"pId": null, // 评论父id
					"content": null // 评论内容
				},
				"pUser": null, // 标签-回复人
				"showTag": false, // 标签展示与否
				"focus": false, // 输入框自动聚焦
				"KeyboardHeight":0
			};
		},
		methods: {
			// 回复评论
			reply(pUser, reUser, pId) {
				this.pUser = pUser;
				this.commentReq.pId = pId;
				if (reUser) {
					this.commentReq.content = '@' + reUser + ' ';
				} else {
					this.commentReq.content = '';
				}
				this.showTag = true;
				this.commentInput();
			},
			// 删除评论前确认
			confirmDelete(commentId) {
				var that = this;
				uni.showModal({
					title: '警告',
					content: that.deleteTip,
					confirmText: '确认删除',
					success: function(res) {
						if (res.confirm) {
							that.$emit('del', commentId);
						}
					}
				});
			},
			// 新增评论
			add() {
				this.commentInput();
				if (this.commentReq.content == null || this.commentReq.content.length < 2) {
					uni.showToast({
						title: '评论内容过短',
						duration: 2000
					});
					return
				}
				this.$emit('add', this.commentReq);
			},
			// 点赞评论
			like(commentId) {
				this.$emit('like', commentId);
			},
			// 新增完成
			addComplete() {
				this.commentReq.content = null;
				this.tagClose();
			},
			// 点赞完成-本地修改点赞结果
			likeComplete(commentId) {
				for (var i in this.commentData.comment) {
					if (this.commentData.comment[i].id == commentId) {
						this.commentData.comment[i].hasLike ? this.commentData.comment[i].likeNum-- : this.commentData.comment[i].likeNum++;
						this.commentData.comment[i].hasLike = !this.commentData.comment[i].hasLike;
						return
					}
					for (var j in this.commentData.comment[i].children) {
						if (this.commentData.comment[i].children[j].id == commentId) {
							this.commentData.comment[i].children[j].hasLike ? this.commentData.comment[i].children[j].likeNum-- : this.commentData.comment[i].children[j].likeNum++;
							this.commentData.comment[i].children[j].hasLike = !this.commentData.comment[i].children[j].hasLike;
							return
						}
					}
				}
			},
			// 删除完成-本地删除评论
			deleteComplete(commentId) {
				for (var i in this.commentData.comment) {
					for (var j in this.commentData.comment[i].children) {
						if (this.commentData.comment[i].children[j].id == commentId) {
							this.commentData.comment[i].children.splice(Number(j), 1);
							return
						}
					}
					if (this.commentData.comment[i].id == commentId) {
						this.commentData.comment.splice(Number(i), 1);
						return
					}
				}
			},
			// 输入框失去焦点
			blur() {
				this.focus = false;
				this.KeyboardHeight=0;
			},
			// 输入框聚焦
			focusOn() {
				this.focus=true;
				this.$emit('focusOn');
				uni.onKeyboardHeightChange(res=>{
					console.log('log',res);
					this.KeyboardHeight = res.height
				})
			},
			// 标签关闭
			tagClose() {
				this.showTag = false;
				this.pUser = null;
				this.commentReq.pId = null;
			},
			// 输入评论
			commentInput() {
				this.focus=true;
				this.focusOn() 
			}
		}
	};
</script>

<style>
	.hb-comment {
		padding: 10rpx;
	}

	.top-read {
		float: left;
		font-size: 28rpx;
		padding-left: 10rpx;
		color: #999999;
	}

	.seg_line_box {
		display: flex;
		height: 5rpx;
		justify-content: space-between;
		margin: 5rpx 0;
	}

	.seg_line {
		width: 45%;
		border-bottom: 1rpx solid #e1e1e1;
	}

	.seg_dot {
		width: 8%;
		border-bottom: 5rpx dotted #dbdbdb;
	}

	.comment-num {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}
	.comment-avatar {
		width: 100rpx;
		height: 100rpx;
	}
	.comment-avatar1 {
		width: 100rpx;
		height: 100rpx;
	}

	.comment-box {
		padding: 10rpx 0;
	}

	.comment-box-item {
		display: flex;
	}

	.comment-main {
		padding-left: 20rpx;
	}

	.comment-main-top {
		width: 600rpx;
		padding-top: 6rpx;
		display: flex;
		justify-content: space-between;
	}

	.sub-comment-main-top {
		width: 510rpx;
		padding-top: 6rpx;
		display: flex;
		justify-content: space-between;
	}

	.nick-name-box {
		display: flex;
		align-items: center;
	}

	.comLogo {
		margin-right: 18rpx;
		font-size: 22rpx;
		border-radius: 10rpx;
		padding: 5rpx 15rpx;
		color: #FFFFFF;
	}

	.com1 {
		background-color: #d218b1;
	}

	.com2 {
		background-color: #f19c0b;
	}

	.com3 {
		background-color: #c8da85;
	}

	.com4 {
		background-color: #bfd0da;
	}

	.nick-name {
		color: #2d8cf0;
	}

	.isLike {
		font-size: 28rpx;
		padding-right: 10rpx;
		color: #2d8cf0;
	}

	.notLike {
		font-size: 28rpx;
		padding-right: 10rpx;
		color: #999999;
	}

	.comment-main-content {
		padding: 10rpx 10rpx 10rpx 0;
	}

	.comment-main-foot {
		display: flex;
		font-size: 22rpx;
	}

	.foot-btn {
		padding-left: 10rpx;
		color: #007AFF;
	}

	.comment-sub-box {
		padding: 20rpx 0;
	}

	.comment-sub-item {
		display: flex;
	}

	.comment-none {
		padding: 20rpx;
		width: 100%;
		text-align: center;
		color: #999999;
	}

	.comment-add {
		padding: 5rpx;
		border: 1px solid #ddd;
		border-radius: 10rpx;
		margin-bottom: 100rpx;
	}

	.comment-submit {
		margin-bottom: 5rpx;
		padding: 5rpx 20rpx 10rpx 20rpx;
		border-bottom: 1px dashed #ddd;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center; 
	}
	.u-avatar__image{
		height: 80rpx;
	}
	
	
</style>
