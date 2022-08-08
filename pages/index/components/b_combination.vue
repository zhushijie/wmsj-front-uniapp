<template>
	<view :class="{borderShow:isBorader}" v-if="combinationList.length">
		<view class="combination">
			<view class="title acea-row row-between">
				<view class="spike-bd">
					<view v-if="assistUserList.length > 0" class="activity_pic">
						<view v-for="(item,index) in assistUserList" :key="index" class="picture"
							:style='index===2?"position: relative":"position: static"'>
							<span class="avatar" :style='"background-image: url("+item+")"'></span>
							<span v-if="index===2 && Number(assistUserCount) > 3" class="mengceng">
								<i>···</i>
							</span>
						</view>
						<text class="pic_count">{{assistUserCount}}人参与</text>
					</view>
				</view>
				<view class="more acea-row row-center-wrapper" @click="toCombinationList()">
					GO<text class="iconfont icon-xiangyou"></text>
				</view>
			</view>
			<view class="conter acea-row">
				<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;"
					show-scrollbar="false">
					<view class="itemCon" v-for="(item, index) in combinationList" :key="index" @click="goDetail(item)">
						<view class="item">
							<view class="pictrue">
								<image :src="item.image"></image>
							</view>
							<view class="text lines1">
								<view class="name line1">{{item.title}}</view>
								<view class="x-money">¥<text class="num">{{item.price}}</text></view>
								<view class="y_money">¥{{item.otPrice}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	import {getCombinationIndexApi} from '@/api/activity.js';
	import animationType from '@/utils/animationType.js'
	export default {
		name: 'b_combination',
		data() {
			return {
				combinationList: [],
				isBorader: false,
				assistUserList: [],
				assistUserCount: 0
			};
		},
		created() {
			this.getCombinationList();
		},
		mounted() {},
		methods: {
			// 拼团列表
			getCombinationList: function() {
				let that = this;
				getCombinationIndexApi().then(function(res) {
					that.combinationList = res.data.productList;
					that.assistUserList = res.data.avatarList;
					that.assistUserCount = res.data.totalPeople;
				}).catch((res) => {
					return that.$util.Tips({
						title: res
					});
				})
			},
			goDetail(item) {
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/activity/goods_combination_details/index?id=${item.id}`
				})
			},
			toCombinationList(){
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: `/pages/activity/goods_combination/index`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mengceng {
		width: 38rpx;
		height: 38rpx;
		line-height: 36rpx;
		background: rgba(51, 51, 51, 0.6);
		text-align: center;
		border-radius: 50%;
		opacity: 1;
		position: absolute;
		left: 0px;
		top: 2rpx;
		color: #FFF;
		i{
			font-style: normal;
			font-size: 20rpx;
		}
	}

	.activity_pic {
		margin-left: 28rpx;
		padding-left: 20rpx;

		.picture {
			display: inline-block;
		}

		.avatar {
			width: 38rpx;
			height: 38rpx;
			display: inline-table;
			vertical-align: middle;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			border-radius: 50%;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: 0 0;
			margin-right: -10rpx;
			box-shadow: 0 0 0 1px #fff;
		}

		.pic_count {
			margin-left: 30rpx;
			@include main_color(theme);
			font-size: 22rpx;
			font-weight: 500;
		}
	}

	.default {
		width: 690rpx;
		height: 300rpx;
		border-radius: 14rpx;
		margin: 26rpx auto 0 auto;
		background-color: #ccc;
		text-align: center;
		line-height: 300rpx;

		.iconfont {
			font-size: 80rpx;
		}
	}

	.combination {
		width: auto;
		background-color: #fff;
		border-radius: 14rpx;
		margin: 0 auto 30rpx auto;
		padding: 16rpx 24rpx 24rpx 24rpx;
		// background-image: url(../../../static/images/pth.png);
		background-image: url('data:image/png;base64,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Oc0xkkdLyvUWN9htYD5eZ8E+q23HWyq5xBK326lVvDZ5HsYltLrswFpn0zMhKy9j3XXXXdb+6Uc/+pH2kQvXXHONJmT/93//lz72sY9pou2+++5ruMepwPjCl9SR2Nl//Md/dKqulW/YsIH+9E//tGkd60WJbX3ppZfqxclkkk477bR6/qc//amrkH3nO99J//M//1O/x8uJzMUoZM866yxav369l1u1OsYxer4JFUEABEAABEBgUAjYiCQRm3YvnylXPFzgV22O0b4LkhSMx5XffnjppZsm8+F7FLpj8wilKjGKBsMkK3o1aLgUF24m9avFCqWVPE08l7EbQ5Nu/LokL9ms8auxpXasInbpiumsDw6sqX9+MD0RsjMzM3XX1TwA+9zdd99NIgY7Ta28CNVKXw8//DDddttt9Vte+9rX0he/+MV63ssJ70rVsiNrbXfnzp3Woqb5T3/603TppZc2rYOLIAACIAACIDBQBGzEq2l84Vezqnza9q3pxRfV9mW4vnxck/pvm1N0d2CEpvgFK37fqlHAWppQIkEazSWpsiGp3hnM0TVH5hb7tNTrUlYLo/jWubyGbsD7m9+OY7GKV8nbJKt4dXs+Nk10VmQeZ08ChR999FESF9NLEoH3yCOPeKmKOiAAAiAAAiAAAsuQgLKjtsarF5EUUBLq/ad2FCsqrq66e9NqRpmiURGxXqEaKsYqCbr79HXcVpd+6ncYUzTqwyoMZnHo0NPiDsXGMALHit260DjOnjiyst6plyS7jkp4gMSP9iv90z/9E83NzTXt/uc//7np+rFjx+j222/XymStWyQQAAEQAAEQAIEOCczyslrRiDensbp2fGZ3LDy547nm/wO3GZK6i8JUOHOKQl4FrEG8WtuTNiobptRdlVnl+qNNKlpvbD/fvitrFYUOwx0wB9Zqk/dEyN5zzz31JySbH/zLv/xLPS8bIhh/pj948CCde+652vWHHnqI5MUpPUmM54033qhntaPEjH74wx82lUkdqSvbm7aSRMTKklitpueff74e//ua17ym1du1+rLW7L59+5reK1yMa8m6bYjQ7liaDgIXQQAEQAAEQKAXBMaCBd7cwJuQ5fFMRMeS6ld/M0yhZ096jVfVRGyiJmI9zclB7FnvHQ2Oq3durCrXHumNMxd9ap5K53lmtSgGW1wHtm9ObPNx9kTIWp9vs7zsgqUn2dXLKGRleS3Z3cqYjC8/6eWyisGWLVv0rKejhDR85Stf8VS3G5Vk44crrriiadNGESsVP/CBD9By3Ka2KQRcBAEQAAEQWBkELv1xju7dPqo5pU1nbBCXSYV/1t+8Vr2vkKNZyrsKyYlN41RhF7VpMrTftJ7lYlGdYKE83YuVDZQLqaw+oCxQRBW56ZBkHkZR6DAvJwfWS5iHQ8+tFVvH2fzugROyxuEeOXLEmG1pFyvTjR4y4gp73WHLQ3MtV5FdzIwrIXhpQF6iQwIBEAABEACB5UhAXppSHynxlrPB2pazdrN0EGOBaIImKcEvbxFl1aJ2Z7xYppno0taiqWyYKrwqQdPk0H7Te2oXJdZ2/lQe+9FpL9U7rpN7Yp4i5zkI2RbEoe686seOB9ZqA0ax7X7vQAtZq1B7xSte4T6jNmr893//N5XLZZIwBz3JOrCHDx/Ws5qI1n+qF8H57LPP1q9NTU3V17+VEAEkEAABEAABEACBzgkol/04qz60LcGrtRoEZ4viUnNpeSy5aEQzJPVhVZL6meXYYvuWu+tZaSYUjKi7Tk30Il5WwinUB+bZlR2tiVmreHWYl9WB1SfQMwdW79BhfPplh+PACFkJERBxaNwQIZMxr5ZRqSz9Q8phPm0V/9Zv/ZYpTlca+aM/+iNTWxdeeCF98pOf1MpkeTCjkD3jjDMa7jfd7CGTSCRINjxolt73vvdpgluv85nPfMa0fq1erh/f+9736qc4ggAIgAAIgMBwEsj8vxkKnrmGQjEOAWhP7Hi/rc32rWTrzbAaDIdEMddLrFV9zef+i13ZbTUh69HZ1J1X/ejrgLw21j6evgtZ2dnrS1/6EsmLXRL/ahSy1l3ARDD2IsmGDD/84Q9NXZ1zzjmmvN8ZiX/9xje+0bRZazzwf/zHf9D4+HjTe3ARBEAABEAABIaZgOY07vrJNK3bLMtjeU+ijTxpufZFlGkwDc3ULE21HJaXynoSKyuu7F41RyWFZ94woMXhDrkDa2LOmb4LWePOXtbBicg1JvkJvxfpm9/8pmkHLVkB4aqrrupq1yJkvS5Tpg/kW9/6ln7qepSX6F73ute51kMFEAABEAABEBg0AiIC1V0/PU5THlcY0DWcfnSckGsFxztNF+rN1MSr6SJnQlO8osB0yVrclfzxp9MU5XCMmi/b0IfuvOrHhgq9KKgD67izngpZiUV127FLlrL64z/+Y5IwAolbNaaPfOQjDW/py0tS1nTDDTfU68nP76961ausVRzz0p5xpQSpePHFFzvWH4YLr371q+kv/uIvaGysSbz8MEwEYwQBEAABEFixBBbFLDuzstKAbB1rTaKNBsGBtY5L8uWCbHRrdufs6vlQpjnY97ErS+LKclpmDqwVUU+E7Pe//336/Oc/T4cOHbL235CX+FOnt/e9ripgrBeJtLbBhuwqJi966SkYDFI3NjmIx+MkW9u2koSjMUlsr8TWNkujo6N0880308TERLNquAYCIAACIAACA09AE7Pq4Wnas3WCouWldVNFxErSj4s5mz9dK9jcY1NUb8ZJJVrvibLw7omOXey4xK7sQs2V1Z1X/WgdWk/ydWC+99YTISsCtpmIlR29JAZV4mPFQe1nsm5KIJsQSGiB3+llL3sZffGLX2ypWeuGCB/72Mdo06ZNtm08+OCDdN9999H09DTdcsstmuDVdx+zvQGFIAACIAACIDAEBGRZLqJnZnjDgRhFlTFSIsHmw/ZJRDU0o4cR6McmowiRy1q1Te5t45Lmyn4nkKVcdWlpBg/DbKOrJrc0AGtSt/1LPRGyzYZ3+umna6sByAYGf/mXf9nX7WllJYLHHnvMNNw3v/nNpryfGQlj+NCHPkQScuElWTdEuPbaax13LysWi6ZdwLAsmBfCqAMCIAACIDAoBNS9F4zw9qvm5YsMg5PNDvh/owX6ytoEhRIj9oLWJzFVb8arA2sYaL9OLz6Ypm9uWxKyPR1HHVjXe+27kN2wYUN9F66LLrqoHo8qbqLxZaazzjpLE31WIiIGrUtlffSjH6WNGzdqVVtxUw8cOGASf6tXr6a3vvWt1i59y4sjK322mxYWvP/zyrhGbrv94T4QAAEQAAEQ6AUB9ZFLkxRWR9V/vyhKFz06s+jCNva8WH4sy1eymkM7zlvaZnh3q5Dbbl2NbTWUNGgx/f+5+rHhjoEqYDZVdTe7slGDK9vVETYA62pvWhgJR1f2TMiK8/qOd7yDZNtZ+dnbLukbDsi1O++801RFhKlx+1r9onVJKik/88wz6+JYr+fleP/995uqydqxEiMrSV4+EwdUxm/Xp+lGDxkRsHfddZeHmp1XkRUXPv7xj3feEFoAARAAARAAgS4TYH9KoUcWRok1KcUCUXr0ojXq3soJdmfNb4BbxlHbjjbPxbOy3BXRqWEKFYMUGAlStLiodyRMNRUNklJuHo7QoMk6FK9KvjcrFliY0CF2Zbf1wpVtAGYdib956U5eEeJjT4TseeedR9dcc402ic9+9rPa0e0Pq1g85ZRT3G7p6Prjjz9Ozz33nKmNSy65pJ7/+7//+6ZxvvWKHk/C4TDdeuutHmu3Xy0QCGDZrfbx4U4QAAEQAIFeEzhweYpGyksxpbFAkKrF1eqT584qv/OUJ0UpL4Xx1rA18WjeIVZ22qLRYOMi7A1azFNX3ugoob4IWWUnu7IPpTNUSnVh29EGYN5YtFvLIF61Jmrd90TItrO17C9+8QvTVEOh7g7VGhsroQzbtm3TxiAxrFaH2DS4NjKymoKs0KAnCZH4m7/5Gz1Ln/rUp0xLlb397W+nd7/73fXrEltr3EJXrl133XX16/v376d77rlHy+/Zs0c7yhJcra7iUG8QJyAAAiAAAiDQZQLq7quDND87YtpKVvoM8K5eVZrgUIMEzTw6Ky8ztT2UiaMFqmww396gyXwUsdJTcbZo7rCHue8fzuS2bRtpvsZRq+NpANZqA63Vt4pYw93dVYeGjlo9PXnypOmWVtaCNd3oISPLdX3ve9+jycnJem1jbOxtt91GsoyVUxJ3tdUkqwl897vfrd9mbV92F/vJT35Svy4rFhiTONbShp70EAg9b21fyq0ut14XRxAAARAAARAYCAKj82MNItY4MAk1OPWSteoTuTSdvz/Dtm3jYvLG+jbn2hv9d/AuRKr1f94+i1dj3/+HV3O93ljQu3P/XNk+i1eH7gdSyMrqAYVCwfSUMxnHFxdN9drJyDavDzzwgOOtElYwqElWIxDn+Oyzzx7UIWJcIAACIAACIOBKQN29NUIj1aW1YZvekUjR3guCdOG+2abVnC6W+CWoEBnCC7olYll9BSI5p5fVnIbnezm7svT67UkqtPsSXBNL1PfBcoMtdNdzIStrxrql48ePN1TZunVrQ5kfBSKQf/CDH/jRVL2N+fn5+nm3TmRZsPe+970kqxFIHCwSCIAACIAACAw1gbExg7BsNhNWOSJ0Zve3vcOAcv3RnPrlNSkKVJu/9NVsGK7XZJCckrNtj3Oxgc7/FFf2xN1z2clUK7GytfHXu7fm6xf8OZHmay9waQ167K6nQjabzdK3v/1t1wnncubRy+5VshRWN9LTTz+tbYnbjbb1Nq0/++vlrRy/9rWv0b333ut6i4QofPnLX3atN8gVeGti/veOQhKywatFKLx+riJlyWSS5ubmFD94DvL8MTYQAAEQWGkE1Pu3JyiZ9KBJampHmcl2FCcrgMdeOknpqSl/WTeosXTH4/RpgJO/fzhN956ZpBDHG7sm6zxcb+isQgfdefjSdDY2491//dd/bYrrNF4znssSV8a0atUqY3aozt/ylrfQ7/3e77mOef369U3riLi3Cny7G2688Uay4yXtD4EAlP+4FHmxj+N5NfEqglZeUBPXOZ/Pa2KWN3vQ/iPk+Xj4j9GOEspAAARAAAQGhQAHuSo0knJ+EUX/nVlMLnHsMnmVLjvY8U+fLDCL6q4KhxgEk/6wEDXGSR9nNlBSbujlvrSL3Tv9KeEN6r9VJU4zZV+nNv76RWu+fsGfE2m+DQfW2nnPfpOWF5uc1o+1Dsqal+1chzFddtll2uoDzcYuqyP87d/+rS9rykq4gfElNen3jDPOINkgQjaYaOeltGZj9/NaqyKbhW1dxB48eLB+7ueY0BYIgAAIgEAPCDxx3gj/D8pBjxjUji56osG0iDI/RqZcf3KOAuUOFJt+a+2oD5dFLP1JZumNbD8G60cbV/00Q2X+h0BD0gfecKE7BXp3NWztd5LrzTqyMkBZTus973lPw1jtRKq86PXGN76xXrfZGrLi2Bnryk3NlpjauHFjTwTd2rVr6ZZbbqnPwXoiO5p95jOfIRGfdmnz5s0kIRVekwjBm266qV593bp12iYIshnCsCUJJ5DnykmOcqKICysOLLvSmmOrz4ndW0U2yrDbLEOvgyMIgAAIgMBgEuCVJwP0HXYITf+7q6kc3dmUo54C5Ypy4X5f3/5Wrp2dVe/k8NxqyDQKvUvnY21c9XHWaoqIvSEzzW6sjWB0bq0XV/j/qAZXtsZZc7yldwPnbgzGt+7MDSn8E26etUK0G2NGmyDglcCJEyfez2I1y+vpllicFvh7WWRBW2DntcDfzwKL2ALHyRb5GlcrlvgfO2V+Ua/MMcEV/sdJZd++feoFF1xQ5f5Urj9wf3l45YB6IAACILCSCKgPnD9B4/H40pzNIkWPKqhrrNnqSWWHt00Rltr0dqbetTZJC5VRtvia/MrnMr5sLksfoXluYGD/P8QDU+ieM9ctxsrKfHqQLNja77GxodCi4dV+k7gTBPwgwMK1/rNSzZHlr+aiG6sfuR+tTMIKJiYm+L2AJMmLYIcOHZK/dFTe+EHO9eEM7F8i+gBxBAEQAIGVTEDdTUGKqCxia+Kk7mxK3pD0bJljTnfs79Y6WaS8/1iWx5Sn7HjK3p2tDaQ+ztoYpbgQLNJp6XmJuzWMfCBPRWSrlUCaQrkmcck+DF246OEg0pz+HFtuunlDcGRbBoobukGAN8D4IL/MdUwcWVarRXFk+ai5seLKGh1ZdmZLsViMNWypzM5shV9kkx1eqixk1auvvloELFzZbjwktAkCIAACPhJQ914wTuESSx2D2rFqFmN/k/njymsO9mSrVw55UOgrPLCFFAvtSrju0hrHp3IIQS5TpOcop/ydbIk7XInX7V1H0XLdRPJ19EZOHTXs3lBPVy3oaC64eVkTYLE6wRM8xh8tBlZiYo2JRStXCRiLtHOJm+WtehVZlqsmYpc1J0wOBEAABJYDAe3n7RKLWNkY0xgDK5MT7WJNcWWhVyJWupZYUj5kidL8WUzs1kZq7/tXlD/sYItcvcH+HyXW2D9X1qo57Z6jpzm31lB3lLingaISCCwR4NjXCVGmUqKHFvCp5GUdWfmeygtfAXZg62pWhK185IWveDyucJysIuEFXBcJBEAABEBgkAnsPjdWN2K9vGL16yc6Xm6rUxwSNlD7yK+AQ5+UHc9kqBCSd0s6T1bt2XaLrTcER7Zt2LjRTwK8NNgmbu97NTGrubIiaPlTF64cTqCvLavw5hoByetCdsuWLSSfWhIxixhZnQaOIAACIDBoBE6rhmm+5qW5OXflcoYF5LIQj4P2GCgfTHN4wVhb47JqTrfn6NhJZw3BkXUEiwu9JMCu6quM/dV299IcWRG3uivLdRSOpa2LW7mmhxfINXFlje3gHARAAARAYAAJZFQJKvCWLj/Q9y1evQ10+Gop7/9xti1X1qo9O5q6IUa6jXYgZNuAhlv8J8DO6m+wIB3jo8lJrW3iIHpVE7MSXqBl+A9efourB5Tjx49r4QWyegEvwUUSXsAvjeG77f9jQosgAAIg4A+BYtTb39HaEqH4hc0f6A6t5Ke9/UNBd1ytR4dmnYuNDci5nne+o9kVEQUm4dCsMq6BQDcJjI2NXcGhBPUuxJWVDxfUnVkRsbxRhBzqSWJk5cMbYSiyyxe/9KW3AXdWJ4EjCIAACAwSgWDF29/P1Wp5kIa9HMciy45l3WJlRWt2Zpwa0PnWkNYmYmQNaHHaXwIsRC/nz70sXmesI5Hd2vSXwOSFLxGu4sZKktAC+WzaJGG2RBJewC4tL5SnyjJc1qaQBwEQAAEQ6DeBSlAlL+8ZpcLBfg91JfSfjJ+cp2qKtzczJKt47cw45YY7bsAwuKVTCNklFjjrP4H4+Pj4H7AIvZWHorJYVXk9WW1UHCMrwlXbEUEKNAXLf8zPzyurVq2SjRHoyJEj2ha2HF6g/8ogKlY/19rBHyAAAiAAAgNAgLeaJQq4x8lmlRj/JS6WBP4u7+JjU648mlO/+hspSkYW/+FgFbEd990dESvD8haj0vEE0AAIeCPA4vUSDjE4n83Uau2jskNLHCtr/EtMBKqsXKC5suLMymfjxo3aygUSXqD3tnPnTnzHdRg4ggAIgMCgEPAaMhCoKvRv540MyrCX9TjShcVYWV1z6se2Jy0N6J+2G3G9UV6Kke3eYq41UQEEekegkE6nP8Sfn7AjW+awAdkNocTnJTnnEIMyC1vtyE5smV8Aq/B2tWU+r/KKBlXeHKHK96rs7Go7fbFx6886eb2bP3oCARAAgWVNQH1oU5RCa1d5mmSVXwK+7PEX2ZY1GhqebkWl1giwK7uWlJor29qtltodq2BLe87ZAAtZ56u4AgL9IRBNpVK38ec3WbhWWMBWWazyV1X7ssoXVl1YMG+3feLEiboLu337dtOo+bb6NdMFZEAABEAABPpCQLnicIF/avNmMogr+/DrUn0Z6ErrNFTqYOMJ3X3tnYiVx4OfXVfal3R45ptkIfsFjn+9hMMNKvJhF1bCDbTEO3lpR5kOx9U2/GtMluEyrF4gL35BzA7Ps8dIQQAEVgKBhQXviidQTqo7oVm6/bVQdrywQGpxafkgzx16f5Sem/RYEctveQSFan0hEOfVCj69Zs2ar09NTZ0nYQOSotFoldeQ1YQsZzURy4K3QcxaRwwxayWCPAiAAAj0kUDmQNZz74GYQq99HWJlPQProKJnV7Y/Dqx1ZnBkrUSQHzgCHON6JruxX16/fv3jLGo/zA7s2WvXrj2NXdmkCFldzBoHzktwGbM4BwEQAAEQGDAC2raz2ax3K68UGoEr2/2HqLmyJX7Lumny/tiaNuPDxRCLBFmZFgkEQAAEQAAEQAAEekvgR0/P07bzEhT30K3U2bKdY2UPznmojSqdEKhU5ikcmjQ3MSDiVYZh2FMBjqz5KSEHAiAAAiAAAiDQIwLKTqpSIu89xCBaRaxsD56Ncu2RPJlc2QERsTJ3XcTWbFgI2R58IdAFCIAACIAACICAA4H9B9NkXojGoSIXx1m9nCeuLFLXCYgr24N1YF3noWtoOeofualWDiHrShAVQAAEQAAEQAAEukVAc2XD5Yy39lm95NiV3U3YutYbsLZraa5sMFpquwG/brQ4sOZmF7CUhRkIciAAAiAAAiAAAj0n8P0DmZzjalw160234CRWNvxquLK9eEjZ8uJuX73oy9qH5bHrj5/q9v2ijQ9H1goOeRAAARAAARAAgZ4SEFc2EY7YuLKiZnRLzjCkgJKAK2vg0aXTvrmyDo99UcTKv2SWYlEgZLv08NEsCIAACIAACIBACwQuP5Cmap7XBHe04pYagyu7xKLbZy8e7mC3rxYG5/jYddFqPS62DSHbAmNUBQEQAAEQAAEQ6A4BRSGVChl2ZW0cWGuXomngylqpdCWv3EAFWih1N1a2BQfWOkkIWSsR5EEABEAABEAABPpD4KqfZigtrqxNsjPkEmeN2tREkd8EMi/678q26cBapwYhayWCPAiAAAiAAAiAQF8IaK5sSFxZSxIRaw6NXKxQCcV5t6+QpTayPhPw3ZXtwIG1Tg1C1koEeRAAARAAARAAgf4ReLu4sgG1/j6PnRNrGN38lq1wZQ08unY68mJnO6r55MBa5wchayWCPAiAAAiAAAiAQN8IKMSxspV82taBtRnVaDQSgytrA8bnImUHFalYLbTVrI8OrLV/CFkrEeRBAARAAARAAAT6SkDZ8UyGSqGq50HAlfWMqqOK+V95j5XtkgNrHT+ErJUI8iAAAiAAAiAAAv0nkM01xso6jUpc2b2IlXXC41e5cj2VPLmyXXRgrXOBkLUSQR4EQAAEQAAEQKDvBDRXNtSCK3vylWN9H/RKGICTK9sjB9aKGELWSgR5EAABEAABEACBwSAQKnjfIjUYj6r/uT08GANfvqPQXNmgmjfNsIcOrKlfzkDIWokgDwIgAAIgAAIgMBAElMt+nKVC0Xus7C+yWMGgF09u9QvzzhuwWZeZ0PPdGRiEbHe4olUQAAEQAAEQAAE/CMRj3l8wgivrB3HXNpQLqUwqu7J6OEH9DqcFf+sVfD+BkPUdKRoEARAAARAAARDwi4By5UGWS6WK5/aeTSNW1jOsDiq+wK6slnTH1XrsoO0WboWQbQEWqoIACIAACIAACPSBQCDqPVY2mYyot2+K9mGUK6pLZae4snMcK2u35VrvUEDI9o41egIBEAABEAABEGiDQGuuLBu46wixsm1wbvmWF+bZldWd2Jbv9uUGCFlfMKIREAABEAABEACBrhIozHqIla0FbUaDYfUhuLJdfR7cuObKxkp9VbIQst1+ymgfBEAABEAABECgYwLKjhdYMNnFyop41T+GbjJwZQ00uncanvPwD4zudQ8h2z22aBkEQAAEQAAEQMBPAg2ubM2BtetDXNk7N8bsLqHMPwLKDqpQoX+uLISsf88SLYEACIAACIAACHSRgObKViplWwfWrt9kKGVXjDKfCUz1z5WFkPX5WaI5EAABEAABEACBLhKYkxeMPCa4sh5BdVZNc2UD5Sb2eGftN7sbQrYZHVwDARAAARAAARAYKALKtUfyVEiUPA9qLIgVDDzD6qDiQ7Pel0jroBvrrRCyViLIgwAIgAAIgAAIDDaB7EnvoikYCqm718tip0hdJKDs4VjZnruyOYKQ7eJDRdMgAAIgAAIgAAL+E1h0ZSveXdlyGK6s/4+hscWeuLL6ChWLkQwQso2PASUgAAIgAAIgAAKDTmCEvMfKJiNBuLLdf6CaK1uuZLvXk4jXhKl5CFkTDmRAAARAAARAAASGgYByxeECBdSi57HClfWMqqOKv24h7MNTR2YHdnHFCr5x0ZBFaIEnhqgEAiAAAiAAAiAweAQWwq25srtONdt5gzejoR8R7/ZVJd9c2UYHtg5IniRfhiNbJ4ITEAABEAABEACBYSKg7HimSFkXV7bm3GkOXiqKdWV78YB/fbKD8ALjA5PB1vLGYjmv5SFke/FA0QcIgAAIgAAIgEB3CISedXZlRezUnDutc4VjZe+HK9udB7HUKruy5ZwuPJeKPZxZH5jhFv056p66EixQJDcbMlTBKQiAAAiAAAiAAAgMFQFejL+o3qsUKKhGtYFbtZBVUE1HZAUDa+lQzXkYBpuIkMrjVNzH6vDArMXSUDyUp/J8nj5EC4qite+lA/choAYIgAAIgAAIgAAI9IuAuovCtG7zak2e6s5ds8GUZueU9x/r4OfvZo3jmrqbgpSeWutOwk6tGu4qs1jNhgpE8wt0E+VZFYs4NiU4siYcyIAACIAACIAACAwbAeV6Kqm7s3miZMyT1xqLS6wshGy3HvT02Cgt+uM2PVjFq+Q56cUsXucq4fzYS3MLHKLAz7R58mD5Nm8AV0EABEAABEAABECg3wQ0V3aUXVmvaWZmXvng8YzX6qjnjYB6++QoJQMj9rV1tVoTr7VKuXlSExRZoODsgnIDsQPrPUHIemeFmiAAAiAAAiAAAgNMgDc9mKQKu7JeUrBQpR1Hjtn9XO3ldtQxE1DvpBjlR0YpErP82m8vXjUHNhko0UhmTuKcza15z2HVAu+sUBMEQAAEQAAEQGCQCRx6wXkFA9O4WVxVogHavTppKkamZQLqToqpt4+spurUpGcRK71ILPNsJtOJiJVmLKpZipBAAARAAARAAARAYPgIyLJP6j8vLFAgHm8cvdUZ5HwhkeK3h7JwZRtpuZWot0sULDuwyVjYXNeGs1SwFgeUqnITLZjvbT0HR7Z1ZrgDBEAABEAABEBgUAn87Bdp+6HZLGcQqir0D1MO8Zz2raz0UhGw6q7UFCWnVrmLWAMtHb8cJeWyDs9p8bLXPxEj65UU6oEACIAACIAACAwFAfWfT5uggMqurK6emgy7HFDpfc+/qK9L2qTmir7EIQQROiU1SqFoxAzCarXWrjoUa1d5MwPlQ+kT5nbayyG0oD1uuAsEQAAEQAAEQGBQCYR/MU+VzSxkRU25JHFl7xBXdtoXh9Clt6G7rK0GUWIBG4/aLKjVRK3q/4bQj/rMOaSAjqdP6tlOj3BkOyWI+0EABEAABEAABAaOgHrnxnGKVfQfspuPT1zZnz9/jGNsq80rrpyrzgLWQbwai63iVcdWUSq0Pzut7KGKXtTpEY5spwRxPwiAAAiAAAiAwOARSB5JU2WDNyErruymSXZlZzyuejB40/VrRJqADY6mSInEGpcEMKpVS4+6eNWPlsuk8lJbs5kTLGJ9/ccCHFkraORBAARAAARAAASWBYFWXNkca7TEL3/54kp1ZTkGNkTrR0c1AWt6+k3Eq9RzuSxVTmZz2cmP0Jyc+53gyPpNFO2BAAiAAAiAAAgMBoHnj8zTZm+ubEKcxBXoymoCdpQF7Bg7sA3JRaW6XNZc2HWZuckONjxoGJKlAI6sBQiyIAACIAACIAACy4eAuvuMMaqUvG18IMJshbiymoBdM5aiaKm2uoP+zF3UqctlrRUJI6DMfKvbzeojaOUIR7YVWqgLAiAAAiAAAiAwXAQOPZemDRuS2kpcbiMXV3bLRIp/DO/Kz+Bu3ffiurqbgjQ9NkrRcG3TCON+Bi4q1eWy5sDOZNIcnpHvxVykDziyvSKNfkAABEAABEAABPpCYGbXGWMToy24sqlfHuOtU317s74vk7Z0qgnY7HiKMsUEaXEUegUXdepyWWslFChTjB3Ya3snYPXRw5HVSeAIAiAAAiAAAiCwLAlM/Jpd2VALrqwIPpqdXQ4w1KvZgf0dns+xEAtYnlHCKP1cVKrLZRIBu8AO7J90vtVsu6zhyLZLDveBAAiAAAiAAAgMDQH17slRCia9bUcrAu5b7Mr6uN5pr0FxDGxgdmx8dDzUJQdWBOxN/ROwOk+jLNfLcAQBEAABEAABEACB5UXg8EyGXp5KkqwZ65bEubyCXcw9w+fKioClUzjOtxhMjss8TIvBulisLpdJNjSYzUoMrNQciOT+MAdimBgECIAACIAACIAACHRG4MTtk6OTqx1c2QYRt0CUmh6aWFkRsCdZwEaLhWTC7xhYEbBxFrDXD46A1b8JELI6CRxBAARAAARAAASWNQFV5Zfc7z59naMraxWzhfkF5QNzJwcZiubATvKuZNEAu83Wl/itE7LMxOUyxVjAVgdTwOozgZDVSeAIAiAAAiAAAiCw7Amo/zCVokQ85b4jFTuykn45/RL/lF5ezAzOn5oo/9wkrwObZwGbMOg5F3XqclmbYUCpUo4F7M2UHZwZ24/EMHH7CigFARAAARAAARAAgeVCQJWlR78yxa5sXHEWsyJiZZlVPsZKC8rvD44rqwnYO6ZGqJwbMQtYeUIuKtXlMg2RgJXZSoKQXeSAP0EABEAABEAABFYIAXX36hFKx0bN0zWIV/OFgXBlNQH+D3YC1kWdulzWpioClrIZ5YOUsU590PMQsoP+hDA+EAABEAABEAABXwloovDO1WupGgssNtxExEoFtZhXrpuf8XUQHhvTxvoFSuZCiVTCFEIgDbioVJfLmgPLApY+SFkWhNzV8CUsvzV8zwwjBgEQAAEQAAEQ6ICAiDY1x+5jjNiVFRErST8u5kx/KpGYupdCyoW9i5XVBSwRr7IQiwe0lbS0QVnVqeQNyeWyVrPMorWYy9AtlBlWAavPGI6sTgJHEAABEAABEACBFUVAvXP1OqqqNVfWZeo9dGXVLxBv3LAoYM2jsqpU81U3g5ZluEqjLGD/cPgFrD5zOLI6CRxBAARAAARAAARWFoFgIE3VypinSYsru4vCvJZqyVP9Niqpf0VJSiRT4sAu3W4Vr+05sDPBXHbyRkoPuwO7xGXxDI6slQjyIAACIAACIAACK4ZAS65sqFBQ/iB9wm84ImCzLGCTJgFr7MUiXvVLVo2rl+vHCDuwhVyW/oQFrDKcMbD6VJyOELJOZFAOAiAAAiAAAiCw7Amof7U2SZMeXVmhUZ4+7pcryw5vggLswAbiwSXQLurU5bLWji5gZziEYCfxigTLN0HILt9ni5mBAAiAAAiAAAh4IKB+ec1aClQNYrLJTeVCUbk+Pd2khuslewFrvK1NB1aaiLAD+2t2YJe5gNVpIUZWJ4EjCIAACIAACIDAyiRQDaUpUBz3NPlQNKLuTkeUHVT0VN9QSb2V4tlAcpQ3YzCIZheL1XrZQeOuNAGrY4Ujq5PAEQRAAARAAARAYMUSaMmVzeZLyg2Z415hiYCl+EiKIjEHA9FBnVpFrF2H5VyO5mh+pTiwVgQQslYiyIMACIAACIAACKw4AtrP/aEpb66s0JmZnlNupmwzUOqdvFJtfmTUXsB2IF6lUxGwT3IIwR6qNBvDcr8GIbvcnzDmBwIgAAIgAAIg4IlAS66stDg3fVK5qXEnBRGwGRawI11wYOeCuYWxKXZgd6xsAas/UAhZnQSOIAACIAACIAACK5qAFgIwNjXREgR++Yvi6QV6joXlhqkwFfPxrjiwLGDpJe0lrnJL41vmlSFkl/kDxvRAAARAAARAAAS8E1C/tHYNRSoOsaze2zHX7CCMIBhmATsnqxBAwJqhajmfH5RNDygCARAAARAAARAAgWEhEDs2T9Wpyc6H61G8OlSjUihP8/PyEhcEbJOHAUe2CRxcAgEQAAEQAAEQWHkE1M+nVlE8Gm1/5g7qVIoT/HG4rPUXZwFbmU/7telC+3MYjjvhyA7Hc8IoQQAEQAAEQAAEekXgsfQsXRxdQyFqwfBzUKdW8epQjXQBex2VejXN5dBPCw9oOUwXcwABEAABEAABEAABdwLqTl46a4PXEAMHdWoVsXbdKsEChdPzcGDt4LiXQci6M0INEAABEAABEACBFUhA/QKNUGxq1H7qHYhXabAQLFKGBezO1ncIsx/PyiyFkF2Zzx2zBgEQAAEQAAEQ8EBAvYuSVJoaM1ftQMRGWMBOsIBtY4tb8xiQEwIQsvgegAAIgAAIgAAIgEATAhxmEKKp1BjFK40vgHkJH+C2M2qgNEKZeeUGKjTpCpdaJAAh2yIwVAcBEAABEAABEFiZBNTbKUrRVIpClYhGwIOI1QTsTEbWgc2vTGrdnTWEbHf5onUQAAEQAAEQAIFlRkBzaCd5Ia1oKkLFmqjV5xghlQoBXvs1U6AZyiMGVgeDIwiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAAAiAwLIl8P8Bl2Tm3UfcsxEAAAAASUVORK5CYII=');
		background-repeat: no-repeat;
		background-size: 100%;

		.title {
			width: 80%;
			margin-left: 128rpx;

			.sign {
				width: 40rpx;
				height: 40rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.name {
				font-size: 32rpx;
				color: #282828;
				margin-left: 12rpx;
				font-weight: bold;

				text {
					color: #797979;
					font-size: 24rpx;
					font-weight: 400;
					margin-left: 14rpx;
				}
			}

			.more {
				width: 86rpx;
				height: 40rpx;
				background: linear-gradient(142deg, #FFE9CE 0%, #FFD6A7 100%);
				opacity: 1;
				border-radius: 18px;
				font-size: 22rpx;
				color: #FE960F;
				padding-left: 8rpx;
                 font-weight: 800;
				.iconfont {
					font-size: 21rpx;
				}
			}
		}

		.conter {
			margin-top: 24rpx;

			.itemCon {
				display: inline-block;
				width: 220rpx;
				margin-right: 24rpx;
			}

			.item {
				width: 100%;

				.pictrue {
					width: 100%;
					height: 220rpx;
					border-radius: 6rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 6rpx;
					}
				}

				.text {
					margin-top: 4rpx;

					.y_money {
						font-size: 24rpx;
						color: #999999;
						text-decoration: line-through;
					}

					.name {
						font-size: 24rpx;
						color: #000;
						margin-top: 14rpx;
					}

					.money {
						color: #FD502F;
						font-size: 28rpx;
						height: 100%;
						font-weight: bold;
						margin: 10rpx 0 0rpx 0;

						.num {
							font-size: 28rpx;
						}
					}
				}
			}
		}
		.x-money{
			@include price-color(theme);
			font-size: 28rpx;
			height: 100%;
			font-weight: bold;
			margin: 5rpx 0 0;
		}
	}
</style>
