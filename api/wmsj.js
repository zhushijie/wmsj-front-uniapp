import request from "@/utils/request.js";


/**
 * 当前用户在时长排行第几名
 * 
 */
export function serviceNumRankNumber(data)
{
	return request.get("wmsjuser/serviceNumRankNumber",data);
}

//时长排行
export function getserviceNumRank(q)
{
  return request.get("wmsjuser/serviceNum_rank",q);
}
//积分记录
export function getintegralLog(param)
{
  return request.get("wmsjuser/integral_log",param,{ noAuth : true});
}
//时长记录
export function getserviceNumLog(param)
{
  return request.get("wmsjuser/serviceNum_log",param,{ noAuth : true});
}



/** * 获取主页数据 无需授权 *  */

export function getIndexData()
{
  return request.get("wmsjShouyeInfo",{},{ noAuth : true});
}
/**************************阵地******************************/

export function getZhendiList(data)
{
  return request.get("zhendi/list",data,{ noAuth : false});
}
export function getZhendiInfo(id)
{
  return request.get("zhendi/"+id,{},{ noAuth : false});
}

/**************************************************************/

/**************************志愿者团队******************************/

export function getTuanduiInfo(id)
{
  return request.get("zhendi/tuandui/"+id,{},{ noAuth : false});
}

export function addTuandui(data)
{
  return request.post("zhendi/tuandui/add",data,{ noAuth : false});
}
/**
 * 我申请的
 * @param {*} data 
 */
export function getMyTuanduiList(data)
{
  return request.get("zhendi/tuandui/myList",data,{ noAuth : false});
}
/**
 * 我加入的
 * @param {*} data 
 */
export function getMyAddTuanduiList(data)
{
  return request.get("zhendi/tuandui/myAddList",data,{ noAuth : false});
}
export function getTuanduiList(data)
{
  return request.get("zhendi/tuandui/list",data,{ noAuth : false});
}

/**
 * 申请加入团队
 * @param {*} id 
 */
export function tuanduiAddUser(id)
{
  return request.post("zhendi/tuandui/addUser/"+id,{},{ noAuth : false});
}

export function tuanduiAddUserShenhe(data)
{
  return request.post("zhendi/tuandui/addUserShenhe",data,{ noAuth : false});
}

export function tuanduiTuiChuUser(id)
{
  return request.post("zhendi/tuandui/tuichuUser/"+id,{},{ noAuth : false});
}

export function getTuanduiUsers(id,data)
{
  return request.get("zhendi/tuandui/getTuanduiUsers/"+id,data,{ noAuth : false});
}
/**
 * 获取未审核users
 * @param {*} id 
 * @param {*} data 
 */
export function getTuanduiUsersNoShenhe(id,data)
{
  return request.get("zhendi/tuandui/getTuanduiUsersNoShenhe/"+id,data,{ noAuth : false});
}


/********************************************************************/


/**************************活动**************************/

/**
 * 用户点单
 * @param {*} data 
 */
export function addDiandan(data)
{
  return request.post("huodong/diandan",data,{ noAuth : false});
}
/**
 * 用户催单
 * @param {*} data 
 */
export function cuidan(activityId)
{
  return request.post("huodong/cuidan/"+activityId,{},{ noAuth : false});
}
/**
 * 活动详情
 * @param {} id 
 */
export function getActivityInfo(activityId)
{
  return request.get("huodong/"+activityId,{},{ noAuth : false});
}

/**
 * 订单评价
 * @param object data
 * 
 */
export function activityComment(data) {
	return request.post('huodong/comment', data);
}


/**
 * 获取正在招募中的活动
 * @param {*} data 
 */
export function getZhaomuList(data)
{
  return request.get("huodong/zhaomuList",data,{ noAuth : false});
}

export function getPaidanList(data)
{
  return request.get("huodong/getMyPaidan",data,{ noAuth : false});
}
export function getMyHuodongList(data)
{
  return request.get("huodong/getMyList",data,{ noAuth : false});
}
export function getMyDiandanList(data)
{
  return request.get("huodong/getMyDiandanList",data,{ noAuth : false});
}

export function getMyStartHuodongList(data)
{
  return request.get("huodong/getMyStartHuodong",data,{ noAuth : false});
}
export function getMyHuodongOverList(data)
{
  return request.get("huodong/getMyOverList",data,{ noAuth : false});
}
export function baoming(id)
{
  return request.post("huodong/baoming/"+id,{},{ noAuth : false});
}

export function juejue(id)
{
  return request.post("huodong/juejue/"+id,{},{ noAuth : false});
}

export function jiedan(id)
{
  return request.post("huodong/jiedan/"+id,{},{ noAuth : false});
}


export function addFengcai(data)
{
  return request.post("huodong/addFengcai",data,{ noAuth : false});
}

export function getFengcaiList(data)
{
  return request.get("huodong/getFengcaiList",data);
}
export function daka(id,data)
{
  return request.post("huodong/daka/"+id,data,{ noAuth : false});
}


/********************************************************************/


/****************************通知**********************************/

export function getRecordList()
{
  return request.get("sys/record/list",{},{ noAuth : false});
}
export function yidu(id)
{
  return request.post("sys/record/yidu/"+id,{},{ noAuth : false});
}
export function yiduAll()
{
  return request.post("sys/record/yiduAll",{},{ noAuth : false});
}
/********************************************************************/