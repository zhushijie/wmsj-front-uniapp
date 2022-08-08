<template>
	<view class="aui-news-box">
		<u-collapse  @open="cangestatus">
			<block v-for="(item, i) in recordList" :key="i">
				<u-collapse-item :name="item.id" :title="item.title+'【'+item.createTime.substring(0,10)+'】'">
					<u-icon v-if="item.type==1" name="tags-fill" size="20" slot="icon"></u-icon>
					<u-icon v-if="item.type==2" name="start" size="20" slot="icon"></u-icon>
					<u-icon v-if="item.type==3" name="bell" size="20" slot="icon"></u-icon>
					<u-icon v-if="item.type==4" name="bag" size="20" slot="icon"></u-icon>

					<text slot="value" class="u-page__item__title__slot-title statusOn">{{item.status==0?"未读":"已读"}}</text>
					<text class="u-collapse-content">{{item.remark}}</text>
					<text style="text-align: right;color: #a8a8a8;margin-top: 20rpx;">{{item.createTime.substring(0,16)}}</text>
				</u-collapse-item>
			</block>
		</u-collapse>
		<uni-load-more :status="more" @clickLoadMore="getPaidans" ></uni-load-more>
	</view>
</template>

<script>
	import {
		getRecord,
		setYidu,
		setYiduAll
	} from '@/api/record.js';
	import loadMore from '@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue'
	
	export default {
		components: {
			'uni-load-more':loadMore
		 },
		data() {
			return {
				title: 'Hello',
				page: 1,
				limit: 10,
				more: "noMore",
				recordList: [
				],
			}
		},
		onLoad() {
			this.getrecordList()
		},
		methods: {
			getrecordList() {
				let that = this
				let limit = that.limit;
				let page = that.page;
				let recordList = that.recordList;
				getRecord({
					page: page,
					limit: limit
				}).then(res => {
					let recordListNew = [];
					let len = res.data.list.length;
					recordListNew = recordList.concat(res.data.list);
					that.page++;
					that.$set(that, 'recordList', recordListNew);
					if (limit > len) {
						that.more = "noMore"
					} else {
						that.more = "more"
					}

				});
			},
			cangestatus(e){
				this.setYiduHandle(e)
			},
			setYiduHandle(id) {
				let that = this
				setYidu(id).then(res => {
					that.recordList.forEach((item, index) => {
					   if(item.id==id){
						   that.recordList[index].status=1
					   }
					});
					  
				});
			},
			setYiduAllHandle(id) {
				let that = this
				setYiduAll().then(res => {
					that.recordList.forEach((item, index) => {
					    that.recordList[index].status=1
					});
				});
			},
		}
	}
</script>

<style>
	.aui-news-box{
		background-color: white;
	}
	.statusOn{
		color: #08acee;
	}
	.statusOff{
		color: #ffaa7f;
	}
</style>
 