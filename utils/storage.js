//封装localStorage
var storage={
    //存数据
    setData(key,arr){
        localStorage.setItem(key,JSON.stringify(arr));
    },
    //取数据
    getData(key)
    {
        return JSON.parse(localStorage.getItem(key))||[]
    }
}
export default storage