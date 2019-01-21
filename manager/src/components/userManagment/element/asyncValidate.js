
import HTTP from "../../../services/http";

const asyncValidate = (values, dispatch, props, blurredField) => {
    
   return  new Promise((resolve, reject) => {
       if( blurredField ) {
           Object.assign(values, { blurredField })
           HTTP.Request('get', window.admin.asyncCheck, values)
               .then(result => {
                   if (result.data) {
                       reject({ [result.key]: result.message });
                   } else {
                       resolve();
                   }

               })
          
       } else {
           resolve();
       };
       
   });
   
}

export default asyncValidate;