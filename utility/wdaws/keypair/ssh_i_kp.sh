#!/bin/bash






SvrIP="52.87.154.78"


TARGF="ssed_test.txt" 
sed -E 's|'[0-9]+.[0-9]+.[0-9]+.[0-9]+'|'"$SvrIP"'|g'  ${TARGF} > ../../../index.htm





#ssh -i /path/my-key-pair.pem my-instance-user-name@my-instance-public-dns-name
WDKEY="wdkeypair"
ssh -i ${WDKEY}.tem ubuntu@${SvrIP}






