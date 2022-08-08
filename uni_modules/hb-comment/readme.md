# hb-comment
## 接口使用，包括点赞回复评论删除逻辑，建议参考示例项目进行二次封装。

## 本插件依赖uView，如果环境没有uView，请把其中用到的地方替换成普通组件，包括输入框，头像，图标，展开等。

直接使用

```html
<hb-comment ref="hbComment" @add="add" @del="del" @like="like" @focusOn="focusOn" :deleteTip="'确认删除？'"
			:cmData="commentData" v-if="commentData"></hb-comment>
```

后端返回数据格式(给到前端后前端整合成树)：

```js
{
    "readNumer":193,
    "commentList":[
        {
            "id":1,									// 主键
            "owner":false,							// 是否是主人，如果是，则可以删除评论
            "hasLike":false,						// 是否已经点赞
            "likeNum":2,							// 点赞数
            "avatarUrl":"https://ae02.alicdn.com/kf/Heb9582da365a4358af55acfb8828319b8.png",
            										// 头像
            "nickName":"无敌寂寞字好...",				// 昵称
            "content":"啦啦啦啦",					// 评论内容
            "parentId":null,						// 所属父评论id
            "createTime":"2021-07-02 16:32:07"		// 创建时间
        },
        {
            "id":2,
            "owner":false,
            "hasLike":false,
            "likeNum":2,
            "avatarUrl":"https://ae01.alicdn.com/kf/H10a699d93e014dd8b1adb6c268e23534d.png",
            "nickName":"寂寞无敌",
            "content":"我是评论的评论",
            "parentId":1,
            "createTime":"2021-07-02 17:05:50"
        },
        {
            "id":4,
            "owner":true,
            "hasLike":true,
            "likeNum":1,
            "avatarUrl":"https://ae01.alicdn.com/kf/H65a791ad717641e7a6b5ce72cc1c2f07f.png",
            "nickName":"name111",
            "content":"评论啦啦啦啦啦啦啦啦啦啦",
            "parentId":null,
            "createTime":"2021-07-13 09:37:50"
        },
        {
            "id":5,
            "owner":false,
            "hasLike":false,
            "likeNum":0,
            "avatarUrl":"https://ae02.alicdn.com/kf/Heb9582da365a4358af55acfb8828319b8.png",
            "nickName":"无敌寂寞字好...",
            "content":"超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论",
            "parentId":null,
            "createTime":"2021-07-13 16:04:35"
        },
        {
            "id":13,
            "owner":false,
            "hasLike":false,
            "likeNum":0,
            "avatarUrl":"https://ae02.alicdn.com/kf/Heb9582da365a4358af55acfb8828319b8.png",
            "nickName":"无敌寂寞字好...",
            "content":"@寂寞无敌 你怕不是个大聪明",
            "parentId":1,
            "createTime":"2021-07-14 11:01:23"
        }
    ]
}
```

假设后端返回数据为`res`，则`commentData`可以这样得到

```js
{
    "readNumer": res.readNumer,
    "commentSize": res.commentList.length,
    "comment": this.getTree(res.commentList)
}
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
```

