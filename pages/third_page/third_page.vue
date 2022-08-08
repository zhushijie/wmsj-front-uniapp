<template>
	<view>
		<web-view :src="src">
		</web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:'',
				title:'三方页面'
			}
		},
		onLoad: function (options) { 
			if (options.hasOwnProperty('path')){
				this.src = options.path;
			}
			if (options.hasOwnProperty('title')){
				this.title = options.title;
			}
			//#ifdef APP-PLUS
			uni.setNavigationBarTitle({
			　　title:this.title
			})
			//#endif
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
