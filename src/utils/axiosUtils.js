import axios from 'axios';

export default {

  createAxiosInstance: function (jwtToken) {

    return axios.create({
      baseURL: process.env.VUE_APP_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${jwtToken}`,
      },
      responseType: 'json',
      // withCredentials: true,  今回は jwt なのでこれは必要ないはず?
  });

  },

}
