## 仿大众点评的排序栏基础展示
入口文件（main.js）引用组件注意组件的路径
```
import sort from '@/uni_modules/zwx-sort/components/zwx-sort/zwx-sort'
Vue.component("sort",sort)
```
调用示例(tab栏：【附近，美食，智能排序，筛选】)
```
<sort :sortlist="topicArr" :panelData="panelArr" @conditionName="conditionName"></sort>
```
```
import optionArr from '../sort/datalist.json'
export default {
		data() {
			return {
				topicArr: optionArr.topicArr,
				panelArr: optionArr.panelArr
			}
		},
```
data格式例子

{
	"topicArr": ["附近", "美食", "智能排序", "筛选"],
	"panelArr": [{
			"name": "附近",
			"children": [{
					"name": "附近",
					"children": [{
							"name": "附近（智能范围）"
						},
						{
							"name": "500米"
						},
						{
							"name": "1000米"
						},
						{
							"name": "2000米"
						},
						{
							"name": "5000米"
						}
					]
				},
				{
					"name": "行政区/商区",
					"children": [{
							"name": "热门商区",
							"children": [{
									"name": "天河城/体育中心"
								},
								{
									"name": "珠江新城"
								}
							]
						},
						{
							"name": "全城",
							"children": []
						},
						{
							"name": "越秀区",
							"children": [{
								"name": "全部越秀区"
							}, {
								"name": "小北/淘金"
							}, {
								"name": "五羊新城"
							}]
						},
						{
							"name": "天河区",
							"children": [{
								"name": "全部天河区"
							}, {
								"name": "天河城/体育中心"
							}, {
								"name": "时尚天河"
							}]
						}
					]
				},
				{
					"name": "地铁",
					"children": [{
							"name": "7号线",
							"children": [{
									"name": "大学城南站"
								},
								{
									"name": "板桥站"
								}
							]
						},
						{
							"name": "1号线",
							"children": [{
								"name": "坑口站"
							}, {
								"name": "花地湾站"
							}]
						}
					]
				}
			]
		}, {
			"name": "美食",
			"children": [{
					"name": "全部美食",
					"stopnum": 0
				},
				{
					"name": "粤菜",
					"stopnum": 663
				},
				{
					"name": "自助餐",
					"stopnum": 18
				},
				{
					"name": "日本菜",
					"stopnum": 78
				},
				{
					"name": "面包甜点",
					"stopnum": 384
				},
				{
					"name": "西餐",
					"stopnum": 126
				},
				{
					"name": "咖啡厅",
					"stopnum": 95
				},
				{
					"name": "韩国料理",
					"stopnum": 95
				}
			]
		},
		{
			"name": "智能排序",
			"children": [{
					"name": "智能排序"
				},
				{
					"name": "距离优先"
				},
				{
					"name": "人气优先"
				},
				{
					"name": "好评优先"
				},
				{
					"name": "口味优先"
				},
				{
					"name": "环境优先"
				},
				{
					"name": "服务优先"
				},
				{
					"name": "低价优先"
				},
				{
					"name": "高价优先"
				}
			]

		},
		{
			"name": "筛选",
			"children": [{
				"name": "价格",
				"children": [{
						"name": "50以下"
					}, {
						"name": "50-100"
					},
					{
						"name": "100-300"
					},
					{
						"name": "300以上"
					}
				]
			}]
		}
	]
}

```
##属性说明
sortlist  排序头的名称数组
panelData 排序条件内容数组（data格式参照上面例子，根据自己需求调整）
```
```
## 事件说明

| 事件名 | 说明 | 回调 |
| ------- | ------- | ------- |
|     conditionName    |     点击筛选条件触发    |     ({ visible })=>{//返回选中条件的name值}    |