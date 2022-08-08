<template>
    <view class="scroll-wrap" :style="{zIndex: zIndex}">
        <scroll-view
            v-if="!isShowList"
            class="scroll-view_hold"
            scroll-x="true"
            scroll-with-animation="true"
            :scroll-left="position"
        >
            <view
                v-for="(item, index) in list"
                :key="index"
                :style="choseInd === index ? getActiveStyle : getDefaultStyle"
                class="scroll-view-item"
                :data-item="item"
                @click="onClickScrollItem(index, $event)"
            >{{item.name}}</view>
            <view v-if="isUseOpenList" style="width:62rpx;display: inline-block;"></view>
        </scroll-view>
        <view v-if="isUseOpenList" v-show="!isShowList" class="open-list" @click="handleShowList">
            <slot name="icon-unfold">
				<view class="iconfont icon-fenlei2"></view>
            </slot>
        </view>
        <view v-show="isShowList" class="list-wrap bg-fff">
            <slot name="open-list-tit">
                <view class="flex justify-between border-bottom-solid-ccc" style="width: 95%;margin-left: auto;margin-right: auto;" >
                    <view class="text-lineheight-lg padding-lr size-28">{{ openListTit }}</view>
                    <view  class="flex align-center text-lineheight-lg padding-lr"  @click="handleShowList">
                        <slot name="icon-fold">
							<view class="iconfont icon-xiangxia"></view>
						</slot>
                    </view>
                </view>
            </slot>
            
            <view class="flex flex-wrap padding-lr padding-bottom-sm">
                <view
                    v-for="(item, index) in list"
                    :key="index"
                    :style="choseInd === index ? getActiveStyle : getDefaultStyle"
                    class="scroll-view-item_wrap"
                    :data-item="item"
                    @click="onClickListItem(index, $event)"
                >{{item.name}}</view>
            </view>
			
			<slot name="open-list-tit" v-if="huatiList.length>0">
			    <view class="flex justify-between border-bottom-solid-ccc" style="width: 95%;margin-left: auto;margin-right: auto;">
			        <view class="text-lineheight-lg padding-lr size-28">热门话题</view>
			    </view>
			</slot>
			<view class="flex flex-wrap padding-lr padding-bottom-sm">
			    <view
			        v-for="(item, index) in huatiList"
			        :key="index"
			        :style="getDefaultStyle"
			        class="scroll-view-item_wrap"
			        :data-item="item"
			        @click="gopage(item.id,8)"  v-if="item.pid!=0"
			    >#{{item.name}}#</view>
			</view>
			
			<slot name="open-list-tit" v-if="zhuantiList.length>0">
			    <view class="flex justify-between border-bottom-solid-ccc" style="width: 95%;margin-left: auto;margin-right: auto;" >
			        <view class="text-lineheight-lg padding-lr size-28">专题栏目</view>
			    </view>
			</slot>
			<view class="flex flex-wrap padding-lr padding-bottom-sm">
			    <view
			        v-for="(item, index) in zhuantiList"
			        :key="index"
			        :style="getDefaultStyle"
			        class="scroll-view-item_wrap"
			        :data-item="item"
			        @click="gopage(item.id,9)" v-if="item.pid!=0"
			    >{{item.name}}</view>
			</view>
			
			
        </view>
    </view>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            required: true,
            default: [],
        },
		zhuantiList: {
		    type: Array,
		    required: false,
		    default:  () => []
		},
		huatiList: {
		    type: Array,
		    required: false,
		    default: () => []
		},
        isUseOpenList: {
            type: Boolean,
            default: true
        },
        openListTit: {
            type: String,
            default: '频道切换'
        },
        itemStyleDefault: {
            type: Object,
            default: ()=>({}),
        },
        itemStyleActive: {
            type: Object,
            default: ()=>({})
        },
        zIndex: {
            type:  [String, Number], 
            default: 1000
        },
        defaultChoseInd: {
            type: Number,
            default: 0
        },
        defaultChoseItem: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            scrollViewLeftArr: new Map(), // 存储scroll信息
            choseInd: 0, // 当前选中
            position: 0, // 滑动位置
            windowWidth: 0, // 页面高度
            isShowList: false, // 是否展示为列表形式
        }
    },
	watch:{
		
	},
    computed: {
        getDefaultStyle() {
           const { itemStyleDefault } = this
            let defaultStyleObj = {
                color: '#393939',
                background: '#f4f4f4'
            }
            return this.setStyle(defaultStyleObj, itemStyleDefault)
        },
        getActiveStyle() {
            const { itemStyleActive } = this
            let activeStyleObj = {
                color: '#E93323',
                'border': '1rpx solid #E93323;'
            }
            return this.setStyle(activeStyleObj, itemStyleActive)
        }
    },
    async mounted() {
        const { defaultChoseInd, defaultChoseItem }  = this || {}
        this.choseInd = defaultChoseInd

        let defaultItemInd = -1
        if (defaultChoseItem) {
           defaultItemInd =  this.list.findIndex((item) => item === defaultChoseItem)
           this.choseInd = defaultItemInd !== -1 ? defaultItemInd : 0
        }

        const [_, { windowWidth }] = await uni.getSystemInfo() || {}
        this.windowWidth = windowWidth
        // 获取列表每个dom的偏移量
        const query = uni.createSelectorQuery().in(this)
        query.selectAll('.scroll-view-item').boundingClientRect()
        query.exec((res) => {
            res[0].forEach((element, i)=> {
                const item = element.dataset.item
				//console.log(item)
                const { left } = element || {}
                const obj = {
                    name: item.name,
                    left: left,
                }
                this.scrollViewLeftArr.set(item.name, obj)
                if (i === defaultChoseInd && !defaultChoseItem) {
                    this.position = left - (windowWidth / 2 - 30)
                }
                if (i === defaultItemInd && defaultChoseItem) {
                    this.position = left - (windowWidth / 2 - 30)
                }
            })
        })
        
    },
    methods: {
        onClickListItem(index, event) {
            this.isShowList = false
            const { item } = event.currentTarget.dataset
			console.log(this.scrollViewLeftArr)
            const val = this.scrollViewLeftArr.get(item.name)
            this.position = val.left - (this.windowWidth / 2 - 30)
            this.choseInd = index
            this.$emit('onValueChange', {index: index, id: item.id})
            this.$emit('onListShow', true)
        },
        onClickScrollItem(index, event) {
            this.choseInd = index
            const { item } = event.currentTarget.dataset
            const { offsetLeft } = event.target
            this.position = offsetLeft - (this.windowWidth / 2 - 30)
            this.$emit('onValueChange', {index: index, id: item.id})
        },
        handleShowList() {
            this.isShowList = !this.isShowList
            this.$emit('onListShow', !this.isShowList)
        },
        setStyle(DefaultStyleObj, CurrentStyleObj) {
            Object.assign(DefaultStyleObj, CurrentStyleObj)
            let style = ''
            Object.keys(DefaultStyleObj).forEach(e=> {
                style += `${e}: ${DefaultStyleObj[e]};`
            })
            return style
        },
		gopage(id,type){
			if(type===8){
				
				uni.navigateTo({
				 	url:"/pages/news_details/huati?id="+id+"&aid=0"
				})

			}
			if(type===9){
				uni.navigateTo({
				 	url:"/pages/news_details/zhuanti?id="+id+"&aid=0"
				})
			}
		}
    },
}
</script>

<style scoped>
	

.flex {
    display: flex;
}

.flex-wrap {
    flex-wrap: wrap;
}


.padding-lr {
    padding: 0 30rpx;
}

.padding-bottom-sm {
    padding-bottom: 20rpx;
}

.justify-between {
    justify-content: space-between;
}

.align-center {
    align-items: center;
}

.text-lineheight-lg {
    line-height: 80rpx;
}

.border-bottom-solid-ccc {
    border-bottom: 1rpx solid #ccc;
}

.size-28 {
    font-size: 28rpx;
}

.scroll-view_hold {
    position: relative;
    padding: 15rpx 0 15rpx 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    background: #fff;
	border-bottom: 0.5px solid #f0f0f0;
}

.scroll-view_hold  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}

.scroll-view-item {
    min-width: 120rpx;
    padding: 0 20rpx;
    display: inline-block;
    text-align: center;
    line-height: 60rpx;
    font-size: 25rpx;
    border-radius: 32rpx;
    margin: 0 0 0 20rpx;
}

.scroll-wrap {
    position: relative;
    width: 100%;
}

.open-list {
    position: absolute;
    right: 0;
    top: 0;
    width: 60rpx;
    line-height: 100rpx;
    text-align: center;
    color: #585858;
    background: rgba(255, 255, 255, 0.7);
}

.scroll-view-item_wrap {
    padding: 0px 30rpx;
    text-align: center;
    line-height: 60rpx;
    font-size: 25rpx;
    border-radius: 32rpx;
    margin: 20rpx 0 0 30rpx;
}

.icon-unfold {
    width: 30rpx;
    height: 60rpx;
    padding: 30rpx 0 30rpx 0;
	
}

.icon-fold {
    width: 30rpx;
    height: 60rpx;
}
.iconfont{
	font-size: 40rpx ;
}

</style>