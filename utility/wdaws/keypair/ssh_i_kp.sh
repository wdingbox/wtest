#!/bin/bash






SvrIP="35.175.63.11"

#ssh -i /path/my-key-pair.pem my-instance-user-name@my-instance-public-dns-name
WDKEY="wdkeypair"
ssh -i ${WDKEY}.tem ubuntu@${SvrIP}






