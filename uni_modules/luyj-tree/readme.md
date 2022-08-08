# luyj-tree
> 代码块 `luyj-tree` 内包含`luyj-tree-search`、`luyj-tree-navigation`、`luyj-tree-item`

## 说明

* 本插件是基于[xiaolu-tree](https://ext.dcloud.net.cn/plugin?id=2423)进行了uni_modules模块化。并进行了一些修改。
* 本人暂时只在微信小程序端和H5 使用Chrome浏览器测试。更改了一些内容，有可能会有一些错误 或说明与实际不一致，介意者慎用。本人会适当的抽出业余时间，把它完善，毕竟有一定的下载量了，而且自己也需要学习，再次感谢原作者。
* 暂时，使用自定义插件渲染有问题，会出现``duplication is found under a single shadow root. The first one was accepted`` ，还未找到解决方案。

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法

在 ``template`` 中使用组件

```html
<!-- 基础用法 -->
<luyj-tree v-slot:default="{item}" :max="max" :trees="tree">
	<!-- 内容插槽 -->
	<view>
		<view class="content-item">
			<view class="word">{{item.name}}</view>
		</view>
	</view>
</luyj-tree>
```

``` javascript
import dataList from '@/common/data.js'; // 引用数据
export default {
	data() {
		return {
			tree: dataList,
			max: 5,
		}
	},
}
```
### 功能说明

1. 树形结构展示。
2. 包含搜索框。能够自定义搜索框的样式,能够直接搜索树形图、子文件的内容。
3. 包含面包屑导航。
4. 可以仅仅展示或选择树形的项内容。
5. 可以显示选择改变，或确认选择的方法。
6. 只需传checkList字段就可以回显默认选中。
7. 支持自定义显示内容的插件（slot)。
8. 支持懒加载。

### 属性

|属性名						|类型		|默认值		|	说明		|																								
|:-:						|:-:		|:-:		|	:-:		|
|search-if					|Boolean	|true		|	是否开启搜索	|
|search-background-color	|String		|#FFFFFF	|	搜索框背景色	|
|search-input-background-color	|String	|#EEEFF0	|	搜索框的输入框背景色	|
|search-radius				|Number		|40			|	搜索框的圆角值，单位rpx（默认40）	|
|search-placeholder			|String		|搜索		|	搜索框的内容物空时提示内容	|
|search-placeholder-style	|String		|			|	搜索框的placehoder的样式	|
|search-maxlength			|Number		|140		|	搜索框的最大输入长度 ,设置为 -1 的时候不限制最大长度	|
|search-iconColor			|String		|			|	搜索框的图标颜色	|
|search-clearable			|Boolean	|true		|	搜索框是否显示清除按钮	|
|trees						|Array		|[]			|	trees 传入的树形结构，每个对象必须包含唯一的id值	|
|is-check					|Boolean	|false		|	是否开启选择操作	|
|slot-obj					|Object		|null		|	传入插槽的参数（自定义的slot中不能引用页面的参数，否则样式会出错）|
|check-list					|Array		|[]			|	选中的列表	|
|parent						|Boolean	|false		|	当子级全选时,是否选中父级数据(prop.checkStrictly为true时生效)。此参数占时失效。	|
|parent-list				|Array		|[]			|	父级列表	|
|check-active-color			|String		|#00AAFF	|	选中时单选框/复选框的颜色	|
|check-none-color			|String		|#B8B8B8	|	未选中时单选框/复选框的颜色	|
|props						|Object		|{id: 'id',label:'name',children:'children'，hasChilren: 'user',multiple: false,checkStrictly: false ，nodes: false}	|	参数配置，详细见下表。	|
|step-reload				|Boolean	|false		|	是否懒加载数列	|
|page-size					|Number		|50			|	每次加载的条数，stepReload = true时生效	|

#### props 参数说明
|参数			|类型		|默认值		|	说明		|																								
|:-:			|:-:		|:-:		|	:-:		|
|id				|String		|id			|	id列的属性名	|
|label			|String		|name		|	指定选项标签为选项对象的某个属性值	|
|children		|String		|children	|	指定选项的子选项为选项对象的某个属性值	|
|multiple		|Boolean	|true		|	值为true时为多选，为false时是单选	|
|checkStrictly	|Boolean	|false		|	需要在多选模式下才传该值，checkStrictly为false时，可让父子节点取消关联，选择任意一级选项。为true时关联子级，可以全选（暂时不可用）	|
|nodes			|Boolean	|true		|	在单选模式下，nodes为false时，可以选择任意一级选项，nodes为true时，只能选择叶子节点	|

### 事件

|事件名			|说明			|返回值			|																			
|:-:			|:-:			|:-:		|
|@clickItem		|点击Item列事件	|(item : Object ,realHasChildren : Boolean)	|
|@change		|选项改变时触发事件 当前选中的值	|
|@sendValue		|点击确认按钮时触发事件	|	参数（选中的项值）	|

``@clickItem``,当点击item列时有效。返回值说明如下：

|返回值				|类型	| 说明	|
|:-:				|:-:	|:-:	|
|item				|Object	| 当前选中的值	|
|realHasChildren	|Boolean| 是否包含子级	|

``@change`` ,``is-check``为```true```时，当选中的值改变时触发。返回值说明如下：

|参数			|类型		|	说明		|																								
|:-:			|:-:		|	:-:		|
|e.detail.value	|Boolean	|	当前项是否选中	|
|item			|Object		|	当前的Item值	|

# luyj-tree-search

### 说明

``luyj-tree-search`` 是 ``luyj-tree``内的组件,作为搜索框,可以单独引用。

![Image text](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c07243ab-98a3-4f90-9b4d-2fa60aba2ee9/ba6ace1d-4881-4373-8a8e-b90079d3e290.png)

### 基本用法
### 
在 ``template`` 中使用组件

``` html 
<luyj-tree-search></luyj-tree-search>
```

### 属性

|属性名					|类型		|默认值		|	说明		|																								
|:-:					|:-:		|:-:		|	:-:		|
|background-color		|String		|#FFFFFF	|	背景色	|
|input-background-color	|String		|#EEEFF0	|	输入框背景色	|
|radius					|Number		|40			|	输入框圆角，单位rpx	|
|icon-color				|String		|#B8B8B8	|	图标颜色	|
|placeholder			|String		|搜索		|	输入框为空时占位符	|
|placeholder-style		|String		|			|	placeholder的样式	|
|maxlength				|Number		|140		|	最大输入长度 ,设置为 -1 的时候不限制最大长度	|

### 事件

|事件名			|说明		|返回值	|
|:-:			|:-:		|:-:	|
|@input			|输入框内容变化时，触发事件	| event	|
|@focus			|输入框获得焦点时，触发事件	| event	|
|@blur			|输入框失去焦点时，触发事件	| event	|
|@confirm		|输入框内容提交时，触发事件	| event	|
|@clear			|清空输入框内容时，触发事件	| ''	|

# luyj-tree-navigation

``luyj-tree-navigation`` 是 ``luyj-tree``内的组件,作为面包屑导航栏，可以单独引用。

# luyj-tree-item 

``luyj-tree-item`` 是 ``luyj-tree``内的组件，是树的选择项。包含单选、多选的样式，可以单独引用。

### 基础用法

在``template``中使用组件

``` html
<!-- 普通使用 -->				
<luyj-tree-item :item="item" :isCheck="ischecked" :multiple="multiple" :checked="ischecked" :comparison="comparison" @change="change" @clickItem="clickItem">
</luyj-tree-item>
<!-- 使用插件 -->
<luyj-tree-item :item="item" :isCheck="isCheck" :multiple="multiple" :checked="ischecked" :comparison="comparison" @change="change" @clickItem="clickItem">
	<!-- 自定义插件内容 -->
	<template slot="body" >
		{{ item.label }} 
	</template>
	<!-- 自定义插件内容 -->
</luyj-tree-item>
```

对应的数据及方法如下：

``` javascript
import  dataItem from '../../common/item-data.js';
export default {
	data() {
		return {
			item : dataItem,		// 当前item值
			isCheck : true,			// 是否可选
			ischecked : true,		// 是否选中
			multiple : false,		// 是否多选
			comparison :{
				value : 'value',			// 选中值
				label : 'label',			// 显示名称
				children:'children',		// 子级名称
			},
			test :124
		}
	},
	onLoad:function(){
	},
	methods: {
		// 修改change
		change : function(e , item){
			console.log("修改当前值=>" ,e , item);
		},
		// 点击当前项目
		clickItem : function(item , hasChildren){
			console.log("点击当前项目");
		}
	}
}
```

### 属性

|属性名					|类型		|默认值		|	说明		|																						
|:-:					|:-:		|:-:		|	:-:		|
|item					|Object		|{}			| 当前项的值	|
|is-check				|Boolean	|false		|判断是否可选择，与multiple组合使用。判断显示类型为展示、单选、多选|
|multiple				|Boolean	|false		|是否多选。当isCheck值为true时有效。multiple=false时为单选，multiple=true时多选|
|checked				|Boolean	|false		|当前项是否选中状态|
|nodes					|Boolean	|false		|是否只能选择叶子结点|
|check-active-color		|String		|#00AAFF	|选中状态下，单选框/复选框的颜色|
|check-none-color		|String		|#B8B8B8	|未选中状态下，单选框/复选框的颜色|
|comparison				|Object		|{value : 'value',label : 'label',children:'children'};	|当前项的列名称。	|

#### **comparison**的值
|参数			|类型		|默认值		|	说明		|																								
|:-:			|:-:		|:-:		|	:-:		|
|value			|String		|value		| value值的列名，即选中时单选按钮或复选按钮的值 |
|label			|String		|label		| label值的列名，即当前item默认展示的名称		|
|children		|String		|children	| children对的列名，即当前item的下一级			|

### 事件

|事件名			|说明						|返回值	|
|:-:			|:-:						|:-:	|
|@change		|单选框/复选框值改变时执行方法	|(e , item) 	|
|@clickItem		|点击当前选项					|{item , hasChildren}			|

#### **change** 的参数说明

|参数			|类型		|	说明		|																								
|:-:			|:-:		|	:-:		|
|e.detail.value	|Boolean	|	当前项是否选中	|
|item			|Object		|	当前的Item值	|

#### **clickItem** 的参数说明

|参数			|类型		|	说明		|																								
|:-:			|:-:		|	:-:		|
|item			|Object		|	当前的Item值	|
|hasChildren	|Boolean	|	是否包含子级，即children是否包含对象	|

### 源码地址

[代码csdn地址](https://codechina.csdn.net/qq_28624235/luyj-tree-app) <br>
[代码github地址](https://github.com/luyanjie00436/luyj-tree-app)