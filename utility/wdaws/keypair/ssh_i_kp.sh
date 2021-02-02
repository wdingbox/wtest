#!/bin/bash






SvrIP="3.82.196.119"

#ssh -i /path/my-key-pair.pem my-instance-user-name@my-instance-public-dns-name
WDKEY="wdkeypair"
ssh -i ${WDKEY}.tem ubuntu@${SvrIP}






