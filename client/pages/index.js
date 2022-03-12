import axios from 'axios';
import buildClient from './auth/api/build-client';
const landing = ({ currentUser }) => {
  // axios.get('http://auth-srv/api/users/currentuser');
  return currentUser != null ? (
    <center>
      <h1>Welcome to {currentUser.email} </h1>
    </center>
  ) : (
    <center>
      <h1>You are Not Signed In! </h1>
    </center>
  );
};

landing.getInitialProps = async (context) => {
  try {
    const response = await buildClient(context).get('/api/users/currentuser');
    return { currentUser: response.data.currentUser };
  } catch (e) {
    return { currentUser: null };
  }

  // if (response.status === 200) {
  //   return { currentUser: response.data.currentUser };
  // } else return { currentUser: null };
};

export default landing;
