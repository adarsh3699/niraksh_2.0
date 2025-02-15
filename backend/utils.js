const { enc, AES, MD5 } = require("crypto-js");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
var createError = require("http-errors");
const JWT = require("jsonwebtoken");

const encryptionKey = "bhemu_is_kutta";
const JWT_SECRET = "bhemu_is_kutta";

const CLIENT_ID = "238415785154-hlq2rg2psoi9cikjqdop740k7i5pjlgf.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
    "1//04XTT9t6VEjv5CgYIARAAGAQSNwF-L9Ir3J2Yz2y5cMcz4J8S20EAFcM9XTKWdrLbXmc9ukETxzpv4q78CdzAgV_dzKVx5zO1ttU";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLEINT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

function getMongoDb() {
    // return 'mongodb://localhost/bhemu-notes';
    return "mongodb+srv://adarsh3699:adarsh123@cluster0.6gfam.mongodb.net/Niraksh-Guardian";
}

function createTokens(payload) {
    try {
        const options = {
            expiresIn: "240h",
        };

        const token = JWT.sign(payload, JWT_SECRET, options);
        return token;
    } catch (err) {
        console.log(err);
        return createError.InternalServerError().message;
    }
}

function signLoginInfoToken(verified, linkWithGoogle, linkWithPassword) {
    try {
        const payload = {
            verified: verified,
            linkWithGoogle: linkWithGoogle,
            linkWithPassword: linkWithPassword,
        };
        const options = {
            expiresIn: "240h",
        };

        const token = JWT.sign(payload, JWT_SECRET, options);
        return token;
    } catch (err) {
        console.log(err);
        return createError.InternalServerError().message;
    }
}

function verifyAccessToken(req) {
    try {
        if (!req?.headers?.authorization) return { authorization: false, message: "Please provide Token" };

        const authHeader = req.headers["authorization"];
        const bearerToken = authHeader.split(" ");
        const token = bearerToken[1];

        const isTokenValid = JWT.verify(token, JWT_SECRET, (err, payload) => {
            if (err) {
                const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                return { authorization: false, message };
            }

            return { authorization: true, payload };
        });
        return isTokenValid;
    } catch (err) {
        console.log(err);
        return { authorization: false, message: "Internal server error" };
    }
}

function verifyLoginInfoToken(token) {
    try {
        if (!token) return { authorization: false, message: "Please provide Token" };

        const isTokenValid = JWT.verify(token, JWT_SECRET, (err, payload) => {
            if (err) {
                const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                return { authorization: false, message };
            }

            return { authorization: true, payload };
        });
        return isTokenValid;
    } catch (err) {
        console.log(err);
        return { authorization: false, message: "Internal server error" };
    }
}

function encryptText(text) {
    try {
        const encryptedValue = AES.encrypt(text, encryptionKey).toString();
        return encryptedValue;
    } catch {
        return null;
    }
}

function decryptText(enryptedValue) {
    let value = null;
    try {
        const decrypted = AES.decrypt(enryptedValue, encryptionKey);
        value = enc.Utf8.stringify(decrypted);
    } catch {
        return null;
    }

    return value;
}

function md5Hash(text) {
    try {
        return MD5(text).toString();
    } catch {
        return null;
    }
}

async function sendMail(mailTo, mailSubject, title, object) {
    try {
        //mailing to the new user
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "bhemu3699@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: "Bhemu Notes" + " <bhemu3699@gmail.com>",
            to: mailTo,
            subject: mailSubject,
            text: title + "/n" + object,
            html:
                '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><style>#wrapper {background-color: rgb(32, 32, 32);text-align: center;min-height: 50vh;padding: 50px;}#title {color: lightgray;font-size: 30px;font-weight: bold;letter-spacing: 1px;Padding-top: 5vh;margin-bottom: 20px;}#object {background-color: #f1f1f1;width: fit-content;margin: auto;margin: 20px auto;color: black;padding: 15px 25px;font-size: 20px;}@media only screen and (max-width: 768px) {#wrapper {padding: unset;}}</style></head><body id="wrapper"><div id="title">' +
                title +
                '</div><div id="object">' +
                object +
                "</div></body></html>",
        };

        const result = await transport.sendMail(mailOptions);

        console.log("Email sent...", result);
        return result;
    } catch (err) {
        console.log("Fail to send mail ", err);
    }
}

module.exports = {
    encryptText,
    JWT_SECRET,
    decryptText,
    md5Hash,
    getMongoDb,
    sendMail,
    createTokens,
    verifyAccessToken,
    signLoginInfoToken,
    verifyLoginInfoToken,
};