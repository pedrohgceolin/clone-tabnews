import bcryptjs from "bcryptjs";

async function hash(password){
    const rounds = getNumberofRounds();
    return await bcryptjs.hash(password, rounds)
}

function getNumberofRounds(){
    return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providePassword, storePassword){
    return await bcryptjs.compare(providePassword, storePassword);
}

const password = {
    hash,
    compare
}

export default password;