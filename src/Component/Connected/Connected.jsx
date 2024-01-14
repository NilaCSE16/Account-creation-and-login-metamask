import React from "react";

const Connected = ({ account }) => {
  return (
    <div>
      <h1 className="text-4xl font-bold">You are connected to Metamask!!!</h1>
      <p>Metamask Account is: {account}</p>
    </div>
  );
};

export default Connected;
