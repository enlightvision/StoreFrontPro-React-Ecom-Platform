const Validation = (data: any, type: string) => {
  const err = [];

  const {
    firstName,
    lastName,
    email,
    password,
    ConfirmPassword,
    address,
    city,
    pincode,
    fullName,
  } = data;

  if (type == "register") {
    if (!firstName) {
      err.push({ key: "firstName", message: "Please enter First Name" });
    } else if (!/^[a-zA-Z '.-]{2,10}$/.test(firstName)) {
      err.push({ key: "firstName", message: "Invalid First Name" });
    }

    if (!lastName) {
      err.push({ key: "lastName", message: "Please enter Last Name " });
    } else if (!/^[a-zA-Z '.-]{2,10}$/.test(lastName)) {
      err.push({ key: "lastName", message: "Invalid Last Name" });
    }

    if (!email) {
      err.push({ key: "email", message: "Please Enter Email" });
    } // eslint-disable-next-line
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      err.push({ key: "email", message: "Inavalid Email" });
    }

    if (!password) {
      err.push({ key: "password", message: "Please Enter Password" });
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      err.push({
        key: "password",
        message: "Password is To Weak Plaese enter Strong Password ",
      });
    }

    if (!ConfirmPassword) {
      err.push({
        key: "ConfirmPassword",
        message: "Requird To feild Confirm-Password",
      });
    }
    if (!(ConfirmPassword === password)) {
      err.push({ key: "ConfirmPassword", message: "Password Not Match" });
    }
  }

  if (type == "login") {
    if (!email) {
      err.push({ key: "email", message: "Please enter email" });
    } // eslint-disable-next-line
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      err.push({ key: "email", message: "Inavalid Email" });
    }

    if (!password) {
      err.push({ key: "password", message: "Please enter password" });
    }
  }

  if (type == "checkout") {
    if (!address) {
      err.push({ key: "address", message: "Please Enter Address" });
    } // eslint-disable-next-line
    if (!fullName) {
      err.push({ key: "fullName", message: "Please Enter Full Name" });
    } // eslint-disable-next-line
    if (!city) {
      err.push({ key: "city", message: "Please Enter Town/City" });
    }
    if (!pincode) {
      err.push({ key: "pincode", message: "Please Enter Pincode" });
    } else if (!Number(pincode)) {
      err.push({ key: "pincode", message: "Invalid Pincode" });
    } else if (pincode.length > 6) {
      err.push({ key: "pincode", message: "Invalid Pincode" });
    }
  }

  return err;
};

export default Validation;
