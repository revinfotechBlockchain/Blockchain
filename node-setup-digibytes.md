# NEXT Exchange

## Setup Digibytes node

```console

-#upgrade
sudo apt update
sudo apt upgrade
#setup php 7.1
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install php7.1
sudo apt-get install php7.1 php7.1-cli php7.1-common php7.1-curl php7.1-gmp php7.1-json php7.1-opcache php7.1-mysql php7.1-mbstring php7.1-mcrypt php7.1-zip php7.1-fpm php-sodium
sudo systemctl restart php7.1-fpm.service
#setup nginx
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/example.com #replace example with your domain
################### File Start
server {
        listen 80;
        server_name example.com www.example.com;
        root /var/www/html;
        index index.php;
        location / {
                try_files $uri $uri/ =404;
        }
        location ~ \.php$ {
            fastcgi_pass unix:/run/php/php7.1-fpm.sock;
            include snippets/fastcgi-php.conf;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
        location ~ /\.ht {
                deny all;
        }
}
################### File End

sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com #replace example with your domain
sudo nginx -t  #this checks for erros
sudo systemctl restart nginx.service
sudo systemctl enable nginx.service
sudo systemctl enable php7.1-fpm.service
#install digibyte
sudo apt-get install build-essential libtool autotools-dev automake pkg-config libssl-dev libevent-dev bsdmainutils python3 libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-test-dev libboost-thread-dev
cd ~
wget https://github.com/digibyte/digibyte/releases/download/v6.16.5.1/digibyte-6.16.5-x86_64-linux-gnu.tar.gz
sudo tar xvzf digibyte-6.16.5-x86_64-linux-gnu.tar.gz
sudo rm -rf digibyte-6.16.5-x86_64-linux-gnu.tar.gz
cd ~/digibyte-6.16.5/bin
./digibyted
#let run for 8h

nano /home/mctrivia/.digibyte/digibyte.conf
################### File Start
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
rpcallowip=127.0.0.1
rpcuser=localdgb
rpcpassword=Fjl399kPp1
rpcbind=127.0.0.1
rpcport=14022
uacomment=bitcore
addnode=seed1.digibyte.io
addnode=seed2.digibyte.io
addnode=seed3.digibyte.io
addnode=seed.digibyte.io
addnode=seed.digibyteprojects.com
addnode=digihash.co
addnode=digiexplorer.info
addnode=seed.digibyteguide.com
addnode=explorer-1.us.digibyteservers.io
addnode=10.0.1.41
################### File End

crontab -e
################### File Start
@reboot ~/digibyte-6.16.5/bin/digibyted
################### File End
sudo reboot
