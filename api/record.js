import request from "@/utils/request.js";

export function getRecord(data)
{
  return request.get("sys/record/list",data,{ noAuth : false});
}
export function getCount()
{
  return request.get("sys/record/count",{},{ noAuth : false});
}

export function setYidu(id)
{
  return request.post("sys/record/yidu/"+id,{},{ noAuth : false});
}
export function setYiduAll()
{
  return request.post("sys/record/yiduAll",{},{ noAuth : false});
}
