<template>
	<view class="comment-eg">
		<hb-comment ref="hbComment" @add="add" @del="del" @like="like" @focusOn="focusOn" :deleteTip="'确认删除？'"
			:cmData="commentData" v-if="commentData"></hb-comment>
	</view>
</template>

<script>
	import {getCommentList,addComment,deleteComment,likeComment} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	import hbComment from "@/uni_modules/hb-comment/components/hb-comment/hb-comment.vue"
	export default {
		components: {
			'hb-comment': hbComment,
		},
		name: 'comment-eg',
		props: {
			commentObj: {
				type: Object,
				default: function() {
					return {
						objId: '',
						objType: '',
					};
				}
			},
			visit: {
				type: Number,
				default: 0
			}
		},
		watch: {
			commentObj: {
				handler: function(newVal, oldVal) {
					
					if (newVal.objId &&  newVal.objType&&  newVal.objId!='' && newVal.objType!='' ) {
						this.getComment(newVal.objId , newVal.objType);
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				"commentData": {},
				"reqFlag": false // 请求标志，防止重复操作，true表示请求中
			}
		},
		computed: mapGetters(['isLogin', 'chatUrl', 'userInfo', 'uid']),
		methods: {
			// 登录校验
			// 输入框聚焦
			focusOn() {
				if (this.isLogin == false) {
					// #ifdef H5 || APP-PLUS
					toLogin() 
					// #endif
				}
			},
			// 获取评论
			getComment(objId,objType) {
				// TODO 接入真实接口
				let that=this
				getCommentList({'objId':objId,'objType':objType,'random':Math.random()}).then(res=>{
					that.commentData = {
						"readNumer":that.visit,
						"commentSize": res.data.list.length,
						"comment": that.getTree(res.data.list)
					};
					//console.log(that.commentData)
				}).catch(res => {
					//console.log(res)
				})
			},
			// 新增评论
			add(req) {
				if (this.isLogin == false) {
					// #ifdef H5 || APP-PLUS
					toLogin()
					// #endif
				}
				if (this.reqFlag) {
					uni.showToast({
						title: '操作频繁',
						duration: 1000
					});
					return
				}
				this.reqFlag = true;
				//TODO 接入真实接口
				let params = {
					"objId": this.commentObj.objId,
					"parentId": req.pId,
					"content": req.content,
					"objType": this.commentObj.objType,
				}
				addComment(params).then(res => {
					uni.showToast({
						title: '操作成功！',
						duration: 3000
					});
					this.$refs.hbComment.addComplete();
					this.getComment(this.commentObj.objId,this.commentObj.objType,);
					this.reqFlag = false;
				}).catch(res => {
					this.reqFlag = false;
				})
			},
			// 点赞评论
			like(commentId) {
				if (this.isLogin == false) {
					// #ifdef H5 || APP-PLUS
					toLogin()
					// #endif
				}
				if (this.reqFlag) {
					uni.showToast({
						title: '操作频繁',
						duration: 1000
					});
					return
				}
				this.reqFlag = true;
				// TODO 接入真实接口
				likeComment(commentId).then(res => {
					this.$refs.hbComment.likeComplete(commentId);
					this.reqFlag = false;
				}).catch(res => {
					this.reqFlag = false;
				})
				
			},
			// 删除评论
			del(commentId) {
				if (this.isLogin == false) {
					// #ifdef H5 || APP-PLUS
					toLogin()
					// #endif
				}
				if (this.reqFlag) {
					uni.showToast({
						title: '操作频繁',
						duration: 1000
					});
					return
				}
				this.reqFlag = true;
				// TODO 接入真实接口
				deleteComment(commentId).then(res => {
					this.reqFlag = false;
					this.$refs.hbComment.deleteComplete(commentId);
				}).catch(res => {
					this.reqFlag = false;
				})
				
			},
			// 列表按照父子转换成树
			getTree(data) {
				let result = [];
				let map = {};
				data.forEach(item => {
					map[item.id] = item;
				});
				data.forEach(item => {
					let parent = map[item.parentId];
					if (parent) {
						(parent.children || (parent.children = [])).push(item);
					} else {
						result.push(item);
					}
				});
				return result;
			}
		}
	};
</script>


<style>
	.comment-eg{
		padding: 0 30rpx;
	}
</style>
