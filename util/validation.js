function isEmpty(value) {
    return !value || value.trim() === '';
}

function userCredentialsAreValid(email, password) {
    return (
      email && 
      email.includes('@') && 
      password && 
      password.trim().length >= 6
    );
}

function userDetailsAreValid(email,password,fullname) {
    return (
        userCredentialsAreValid(email,password) &&
        !isEmpty(fullname)
    );
}

module.exports = userDetailsAreValid;