// 目前的时间格式为 hh:mm 的 String, 该方法将其转化为当天的该时间
export const getTimeFromTimeStr = (timeStr:string) => {
    const [hours, minutes] = timeStr.split(':').map(parseInt)
    const time = new Date();
    if(hours){
        time.setHours(hours);
    }
    if(minutes) {
        time.setMinutes(minutes)
    }
    return time;
}

// 计算当前时间是否介于起始与结束算出时间内
export const getIsLive = (startTimeStr:string, endTimeStr:string) => {
    const now = new Date().getTime();
    const startTime = getTimeFromTimeStr(startTimeStr).getTime();
    const endTime = getTimeFromTimeStr(endTimeStr).getTime();
    return now > startTime && now < endTime;
}


