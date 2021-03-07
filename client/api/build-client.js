//I would prefer a name of 'build-axios.js'
//in this file, but we will follow the Stephen convention
import axios from 'axios';

const buildAxios = ({ req }) => {
  if (typeof window === 'undefined') {
    //We are on the server!
    //Requests should be made to http://<ServiceName>.<NameSpace>.svc.cluster.local
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // we are on the browser
    //requests can be made with a base url of ''
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildAxios;
