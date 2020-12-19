#!/bin/sh


password="lll"
cd ../../../../bible_obj_usr/account
echo ${password} | sudo -S git status
echo ${password} | sudo -S git diff
echo ${password} | sudo -S git add *
echo ${password} | sudo -S git commit -m "svr auto checkin"
echo ${password} | sudo -S git push
echo ${password} | sudo -S git status
cd -

