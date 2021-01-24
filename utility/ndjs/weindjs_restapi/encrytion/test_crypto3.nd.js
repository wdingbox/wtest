const { generateKeyPairSync, publicEncrypt, privateDecrypt } = require('crypto');

//generate a key pair RSA type encryption with a .pem format
const { publicKey1, privateKey1 } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',

    }
});
var publicKey = `
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxYXi56foxwDb9WbcUSqy
pp/sr4j48inNVb/3bfz7WPrsale9k4v7iOh5sD1r8nF+IsYNTSeqqbZGHguTONCt
SFGBHoHlDLId3ZcKJrxzgnEYxMIEbfYEHXVp9DsECzzH3VBKwJCXYnSUgXjvkMbP
qhFRQ9D2V9/ZsndYImb/BdQZ9wR4PI7U53eourbsYEa9pHhNDxRm4Nrmxg+LX8Bj
qOoU95Nw4LIxx+D9xLAE1aYRSGWM+LbCPESeAK1Jo5p1smpoP655ILbK4IF24WGI
eYnDbVgmVeENIo6NYIj/oBynZ+Q94rHJXlzxKehAQcJfMsDvCeaCwGnJt+ajkPbz
0+rKXnJywYojUEBE0pJFn+PyUViv3gU6BQhbUz5pX62yL89RkFb6l92lIrriz0iH
xvpJlAX3VRDGUMZgVg8dYonIWA0l2JwtYLxOkXK5VtMb9NSJrcghTZDM04UO/fPj
Y6gA2XYUphwVU+eMtoq5K0guAo+dPJePGrMwWveo7UNWs3TZ4YBGQxcXhWFxyKZK
yVGJcAqUz7Tb/TTqXEMv5a08clsyJbPsVh3qmHnkZ5tJcZNPiOabSbEeTUbZ8gsk
XT+LkTG6+pld5eHjnHZOl4fneBYXgTuejZf5Mk8/zZI7FM2DFXv0WlzI+iGjlg8n
YwFizyF9m0qXtXFRck3Fi4MCAwEAAQ==
-----END PUBLIC KEY-----
`

var privateKey = `
-----BEGIN PRIVATE KEY-----
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
zRJrbPtEJZlZ55KIWKHGwSEr9uRc
-----END PRIVATE KEY-----
`





// print out the generated keys
console.log(`var PublicKey= \n${publicKey}`);
console.log(`var PrivateKey= \n${privateKey}`);

//message to be encrypted
var toEncrypt = "my secret text to be encrypted";
var encryptBuffer = Buffer.from(toEncrypt);

//encrypt using public key
var encrypted = publicEncrypt(publicKey, encryptBuffer);

//print out the text and cyphertext
console.log("Text to be encrypted:");
console.log(toEncrypt);
console.log("cipherText:");
console.log(encrypted.toString());
console.log("cipherText64:");
var cipherTxt64 = encrypted.toString("base64")



cipherTxt64 = `omtbImHH+yMqHsz/J725mCUF4lan6XaI9ByTmy4o8iAuzda4Vf3Hb9S0xoKJ937tpipXqBixuBFCB9F/ZTFUuQCZljZygEBAOTMsFzjeXdqNFaCs6HXhqkSyKawfECFp7n+RI+xeS9jd/Aunkx/8yCHrKWoSDUwbmECycaKjgXIqDC6tDsu6N+w9txn14i9pGrW5T5NtqeR9c9n/dX+8sjo/2wNdiAgtr+Esgq679RQWXG14MoThsLweAqtoMoBYUD+sJup/chjSbbzufDH1tJ00aOyWqQUAuEDVZwOPVc+BEniSjI2aepl+cLt1t0/dBjrfoXTKu0LhheNzd3s2Njd0EShb7N0h1bADb7oAo0/6lN0ko7jQUil4ed6mKPtOMjZ/ThJYgHSzAJUqj8k3B3n5fJXGgt5jEqKHj37El5cRK9Hu1Rb/XjyGgiR+pMLYsVChnhtRO9M5A9OWEJNfg5q1wkWSUTZ9RfF5wQZXmI0FQDeRdI00HfaKlcs36zVB5MjYSlN1JzrWbYckpWH+RejDYnFvSX6bDq2MKeDho5/uHMMu+AQViJUhRjzBWbQwFnll2+Z1YitZfQSJdw9pmB+COfZmoxUqxAbNaxPQFuDkxycTQfpgfjiNgvC2pLxdL6MS2IAf/8bHl5mlDGsBiolZuootIz3sheQv50JoVbs`
console.log(cipherTxt64);

//decrypt the cyphertext using the private key
var decryptBuffer = Buffer.from(cipherTxt64, "base64");
var decrypted = privateDecrypt(privateKey, decryptBuffer);

//print out the decrypted text
console.log("decripted Text:");
console.log(decrypted.toString());