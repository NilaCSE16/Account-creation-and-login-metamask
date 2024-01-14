import "./Login.css";

const Login = ({ connectToMetamask }) => {
  return (
    <div className="flex flex-col items-center pt-12">
      <h1 className="text-red-600 text-4xl font-bold pb-4">
        Welcome to decentralized voting application
      </h1>
      <button className="btn btn-primary" onClick={connectToMetamask}>
        Login Metamask
      </button>
    </div>
  );
};

export default Login;
