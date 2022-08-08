<template>
	
	<view class='page' :data-theme="theme">
		开发中。。。
	</view>
</template>

<script>
	import {
		getMenusData
	} from '@/api/api.js';
	import home from '@/components/home';
	export default {
		components: {
			home
		},
		data() {
			return {
				
			};
		},
		 /**
		   * 生命周期函数--监听页面加载
		   */
		onLoad: function (options) {
		
			let that = this;
			uni.getStorage({
				key: 'theme',
				success: function (res) {
					that.theme = res.data;
				}
			});
		},
		methods: {
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #fff !important;
	}
	.page .catlist {
		padding-left: 10rpx;
	}

</style>
