import axios from "axios";
import { REACT_APP_HOST } from "./configData"

export type Login = "login" | "logout" | "profile-init" | "dumbdumb" | "finally";

async function func() {
      try {
            const response = await axios.get('http://' + REACT_APP_HOST + ':3000/api/user/init/status', {withCredentials: true});
            console.log("try: ", response.data);
      }
      catch {
            console.log("catch");
      }
}

const checkLogin = (): Login => {
      func();
//     axios.get('http://' + REACT_APP_HOST + ':3000/api/user', {withCredentials: true})
//       .then(res => {
//             return "login";
//       })
//       .catch(err => {
//             return "logout";
//       })
//       .finally(() => {
//             return "finally";
//       })
    return "dumbdumb";
}



export default checkLogin;