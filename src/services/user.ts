import myAxios from "../plugins/myAxios";

export const getCurrentUser = async ()=>{
    const res = await myAxios.get("/user/current");
    if (res.code === 0 && res.data != null){
        return res.data;
    }
    return null;
}

