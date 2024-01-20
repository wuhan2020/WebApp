// 目前的时间格式为 hh:mm 的 String, 该方法将其转化为当天的该时间
export const getTimeFromTimeStr = (timeStr: string) =>
    new Date(new Date().toJSON().split('T')[0] + 'T' + timeStr);

// 计算当前时间是否介于起始与结束算出时间内
export const getIsLive = (startTimeStr:string, endTimeStr:string) => {
    const now = new Date().getTime();
    const startTime = getTimeFromTimeStr(startTimeStr).getTime();
    const endTime = getTimeFromTimeStr(endTimeStr).getTime();
    return now > startTime && now < endTime;
}


