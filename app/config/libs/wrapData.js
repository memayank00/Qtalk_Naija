let WrapData = {

    success :  res =>{
        return {data:res};
    },

    error : err =>{
       return  {error:err}
    }

 }

module.exports = WrapData ;