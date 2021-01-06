#!/bin/bash






SvrIP="52.87.154.78"


SRC="ssed_test.txt" 
TARGF="../../../index.htm" 
sed -E 's|'[0-9]+.[0-9]+.[0-9]+.[0-9]+'|'"$SvrIP"'|g'  ${SRC} > ${TARGF}

echo "---------------------"
cat  ${TARGF}

echo "---------------------"
#ssh -i /path/my-key-pair.pem my-instance-user-name@my-instance-public-dns-name
WDKEY="wdkeypair"
ssh -i ${WDKEY}.tem ubuntu@${SvrIP}






