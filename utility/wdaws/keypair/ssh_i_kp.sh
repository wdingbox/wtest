#!/bin/bash






SvrIP="152.87.154.78"
WDKEY="wdkeypair"


#ssh -i /path/my-key-pair.pem my-instance-user-name@my-instance-public-dns-name
ssh -i ${WDKEY}.tem ubuntu@${SvrIP}






