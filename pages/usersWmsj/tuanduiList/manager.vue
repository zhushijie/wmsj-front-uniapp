<template>
	<view  class="page-index">
		
		<u-tabs class="tab" :list="tabList" @click="tabSelect" :current="tabIndex" ></u-tabs>		
		<view class="tuanduiChengyuan" >
			<view class="tuanduiChengyuan skeleton">
				<view class='list'>
					<block  v-for="(item,index) in userList" :key="index">
						<view hover-class='none' class='item acea-row row-between-wrapper'>
							<view class='pictrue skeleton-rect'>
								<image :src='item.avatar'></image>
							</view>
							<view class='text acea-row row-column-between'>
								<view class='skeleton-rect'>
									成员姓名：{{item.realName}}
								</view>
								<view class="skeleton-rect">
									服务时长：{{item.serviceNum||0}}
								</view>
								<view>
								 	联系电话：{{item.phone}}
								</view>
								<view>
								  	队员性别：{{item.sex==1?'男':'女'}}
								</view>
							</view>
							
							<view class="buttons" v-if="tabIndex==1">
								<u-button class="btn" type="primary" shape="circle" @click="shenhe(1,item)" size="mini" text="审核通过"></u-button>
								<u-button class="btn" type="warning" shape="circle" @click="shenhe(2,item)" size="mini" text="拒绝申请"></u-button>
							</view>
						</view>
					</block>
				</view>
			</view>
			
			
		</view>
		
		<uni-load-more :status="more" @clickLoadMore="tuanduiUsers" ></uni-load-more>
		
	</view>
</template>

<script>
	import {getTuanduiInfo,tuanduiAddUser,getTuanduiUsers,
	getTuanduiUsersNoShenhe,tuanduiAddUserShenhe } from '@/api/wmsj.js';
	import {switchH5Login,getOrgTree} from '@/api/api.js';
	import {toLogin} from '@/libs/login.js';
	import {mapGetters} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	 
	export default {
		computed: mapGetters(['isLogin','isWmsj', 'uid', 'userInfo']),
		components: {
			'uni-load-more':loadMore
		 },
		 
		data() {
			return {
				groupId:0,
				tuanduiInfo: {},
				userList: [],
				page: 1,
				limit: 8, 
				more :"noMore",
				tabIndex:0,
				tabList: [
					{
						name: '团队所有成员',
						badge: {
							type:'success',
							value: 0,
						}
						
					}, {
						name: '待审核成员',
						badge: {
							value: 0
						}
					}
				]
			}
		},
		onLoad: function (options){
			if (options.hasOwnProperty('groupId')){
				this.groupId = options.groupId;
			}
			this.getTuanduis(this.groupId)
			if(!this.isWmsj){
				uni.showModal({
					title:"成为志愿者",
					content:"您还不是志愿者，请完善信息后成为志愿者。",
					showCancel:false,
					complete:function(){
						uni.navigateTo({
							url: '/pages/usersWmsj/addzyz/index'
						})				
					}
				})
			}
		},
		onReachBottom: function () {
			this.getTuanduis(this.groupId)
		},
		methods: {
			getTuanduis(groupId){
				getTuanduiInfo(groupId).then(res => {
					this.tuanduiInfo=res.data
					this.tuanduiUsers()
				});
			},
			tabSelect(option){
				this.limit = 8;
				this.page =1;
				this.userList=[];
				this.tabIndex=option.index;
				if(option.index==0){
					this.tuanduiUsers()
				}
				if(option.index==1){
					this.tuanduiUsersNoShenhe()
				}
			},
			tuanduiUsers(){
				let that=this
				let groupId=this.groupId
				let limit = that.limit;
				let page = that.page;
				let userList = that.userList;
				
				getTuanduiUsers(groupId,{
					'page':this.page,
					'limit':this.limit
				}).then(res => {
					that.tabList[0].badge.value=res.data.total  //设置显示总人数
					let usersListNew = [];
					let len = res.data.list.length;
					usersListNew = userList.concat(res.data.list);
					that.page++;
					that.$set(that, 'userList', usersListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
					console.log(userList)
				});
				
			},
			tuanduiUsersNoShenhe(){
				let that=this
				let groupId=this.groupId
				let limit = that.limit;
				let page = that.page;
				let userList = that.userList;
				
				getTuanduiUsersNoShenhe(groupId,{
					'page':this.page,
					'limit':this.limit
				}).then(res => {
					that.tabList[1].badge.value=res.data.total  //设置显示总人数
					let usersListNew = [];
					let len = res.data.list.length;
					usersListNew = userList.concat(res.data.list);
					that.page++;
					that.$set(that, 'userList', usersListNew);
					if(limit > len){
						that.more="noMore"
					}else{
						that.more="more"
					}
				});
			},
			shenhe(flag,user){
				let that=this
				tuanduiAddUserShenhe({
					'uid':user.uid,
					'flag':flag,
					'groupId':this.groupId,
				}).then(res => {
					uni.showToast({
						icon:'none',
						title:res.message
					})
					let userListnow = that.userList
					let userListAfter=[]
					for (var i = 0; i < userListnow.length; i++) {
						if(userListnow[i].uid!=user.uid){
							userListAfter.push(userListnow[i]);
						}
					}
					that.userList=userListAfter
					that.tabList[1].badge.value=that.tabList[1].badge.value-1
					
				}).catch(error => {
					uni.showToast({
						icon:'none',
						title:error
					})
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}
	.tab{
		background-color: white;
	}
			
	.tuanduiList{
		background-color: white;
	}
	
	.tuanduiList .list .item {
		margin: 0 24rpx;
		padding: 35rpx 0;
	}
	
	.tuanduiList .list .item .pictrue {
		width: 140rpx;
		height: 140rpx;
	}
	.tuanduiList .list .item .shenqing {
		position: absolute;
		width: 140rpx;
		height: 40rpx;
		line-height: 40rpx;
		color: white;
		background: $theme-color;
		text-align: center;
		border-radius: 20rpx;
		right: 40rpx;
		top: 35rpx;
	}
	
	.tuanduiList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}
	
	.tuanduiList .list .item .text {
		width: 530rpx;
		height: 140rpx;
		font-size: 30rpx;
		color: #999;
	}
	
	.tuanduiList .list .item .text .name {
		font-size: 40rpx;
		color: #282828;
		display: inline;
	}
	
	
	.tuanduiList .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
	.tuanduiDetail{
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx 40rpx ;
	}
	.tuanduiDetail .detail{
	}
	.tuanduiDetail .detail .item{
		height: 40rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
		background-color: white;
	}
	
	.tuanduiJianjie{
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx 40rpx ;
	}
	.tuanduiJianjie .detail{
		
	}
	
	
	.tuanduiJihua{
		margin-top: 20rpx;
		background-color: white;
		//padding: 20rpx 40rpx ;
	}
	.tuanduiJihua .list{
		padding: 20rpx 40rpx ;
	}
	
	.tuanduiJihua .list .item{
		height: 40rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
		background-color: white;
	}
	

	
	.tuanduiChengyuan{
		background-color: white;
	}
	
	.tuanduiChengyuan .list .item {
		margin: 0 24rpx;
		padding: 35rpx 0;
	}
	
	.tuanduiChengyuan .list .item .pictrue {
		width: 100rpx;
		height: 100rpx;
		margin-left: 40rpx;
	}
	.tuanduiChengyuan .list .item .buttons {
		width: 750rpx;
	}
	
	.tuanduiChengyuan .list .item .buttons .btn {
		float: right;
		margin-right: 20rpx;
		width:150rpx;
	}

	
	.tuanduiChengyuan .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50rpx;
	}
	
	.tuanduiChengyuan .list .item .text {
		width: 530rpx;
		height: 80rpx;
		font-size: 24rpx;
		color: #999;
	}
	
	.tuanduiChengyuan .list .item .text .name {
		font-size: 40rpx;
		color: #282828;
		display: inline;
	}
	
	
	.tuanduiChengyuan .list .item .time {
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 22rpx;
	}
	
</style>
