import jwt from "jsonwebtoken";

const key = process.env.PRIVATE_KEY;
export const createAccessToken = (user) => {
  console.log("user", user);
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        email: user.email,
        password: user.password,
      },
      key,
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
};

export const verifyToken = (token) => {
  console.log(token);
  if(token != "undefined" && token != "null"){
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, decoded) => {
      if (err) {
        const errorMessage = err.message || "Invalid token";
         throw reject(errorMessage);
      }
      resolve(decoded);
    });
  });}
  else return {err:"error"}
};
