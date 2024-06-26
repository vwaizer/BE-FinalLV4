import { checkSchema, validationResult } from "express-validator";
import databaseProject from "../../mongodb/GetDataBase.js";
import bcrypt from "bcrypt";
export const validator = (schema) => {
  return async (req, res, next) => {
    console.log(req);
    await schema.run(req);
    const error = validationResult(req).mapped();
    if (Object.values(error).length > 0) {
      // next(error);
      return res.json({ error });
    }
    next();
  };
};

export const validateRegister = validator(
  checkSchema(
    {
      email: {
        errorMessage: "Invalid username",
        isEmail: true,
        custom: {
          options: async (value, { req }) => {
            const isExist = await databaseProject.users.findOne({
              email: value,
            });

            if (isExist) {
              throw new Error("Email is already existed");
            }
            return true;
          },
        },
      },
      password: {
        trim: true,
        isLength: {
          options: { min: 8 },
          errorMessage: "Password should be at least 8 chars",
        },
      },
      confirmPassword: {
        trim: true,
        isLength: {
          options: { min: 8 },
          errorMessage: "Password should be at least 8 chars",
        },

        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error("Confirm password must be same as password");
            }
            return true;
          },
        },
      },
      // gender: {
      //   errorMessage: "Invalid gender",
      //   custom: {
      //     options: (value, { req }) => {
      //       if (
      //         !value ||
      //         !(["male","female","other"].includes(value.toLowerCase()))
      //       ) {
      //         throw new Error(`Gender should be male, female or other`);
      //       }
      //       return true;
      //     },
      //   },
      // },
      // birthday: {
      //   errorMessage: "Invalid birthday",
      //   custom: {
      //     options: (value, { req }) => {
      //       if (!value || isNaN(Date.parse(value))) {
      //         throw new Error("Birthday should be a valid date");
      //       }
      //       return true;
      //     },
      //   },
      // },
    },
    ["body"]
  )
);

export const loginValidator = validator(
  checkSchema(
    {
      email: {
        errorMessage: "Invalid email",
        isEmail: true,
        custom: {
          options: async (value) => {
            const isUserExist = await databaseProject.users.findOne({
              email: value,
            });

            if (isUserExist) {
              // if(isUserExist.verifyToken == "Đã xác thực"){
              //   return true;
              // } 
              // else{
              //   throw new Error("Email chưa xác thực")
              // }
              
              return true
            } else {

              throw new Error("Email chưa đăng ký");

            }
          },
        },
      },
      password: {
        trim: true,
        isLength: {
          options: { min: 8 },
          errorMessage: "Password should be at least 8 chars",
        },
        custom: {

          options: async (value, { req }) => {
            let checked = false;
            const userLogin = await databaseProject.users.findOne({
              email: req.body.email,
            });
            if(userLogin){
              checked = bcrypt.compareSync(value, userLogin.password)
            console.log(checked);
            if (checked == true) {
              return true
            }
            else { throw new Error(" PASSWORD DOES NOT MATCH") }
            }
            


          },
        },
      },
    },
    ["body"]
  )
);
export const staffLoginValidator = validator(
  checkSchema(
    {
      email: {
        errorMessage: "Invalid email",
        isEmail: true,
        custom: {
          options: async (value) => {
            const isUserExist = await databaseProject.users.findOne({
              email: value,role:"staff"
            });

            if (isUserExist) {
              if(isUserExist.verifyToken == "Đã xác thực"){
                return true;
              } 
              else{
                throw new Error("Email chưa xác thực")
              }
              

            } else {

              throw new Error("Email chưa đăng ký");

            }
          },
        },
      },
      password: {
        trim: true,
        isLength: {
          options: { min: 8 },
          errorMessage: "Password should be at least 8 chars",
        },
        custom: {

          options: async (value, { req }) => {
            let checked = false;
            const userLogin = await databaseProject.users.findOne({
              email: req.body.email,
            });
            if(userLogin){
              console.log(value);
            checked = bcrypt.compareSync(value, userLogin.password)
           
            if (checked == true) {
              return true
            }
            else { throw new Error(" PASSWORD DOES NOT MATCH") }
            }
            


          },
        },
      },
    },
    ["body"]
  )
);