


cd /var/www/html
sudo mkdir wdaws
cd wdaws
sudo git clone https://github.com/wdingbox/ham12.git
sudo git clone https://github.com/wdingbox/bible_concordance.git
sudo git clone https://github.com/wdingbox/bible_obj_lib.git
#git clone https://github.com/wdingbox/bible_obj_usr.git
#git clone https://github.com/wdingbox/hebrew_ciu.git

cd /var/www/html
sudo cp ./wdaws/ham12/utility/wdaws/*.htm ./index.htm


cd ham12/utility/ndjs/weindjs_restapi/
sudo npm i express
sudo npm i cors
sudo npm i node-cache
sudo npm i cheerio
sudo npm i express-fileupload