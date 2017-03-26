# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/trusty64"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.provision "shell", inline: <<-SHELL
        add-apt-repository ppa:jonathonf/python-3.6
        apt-get update
        apt-get upgrade --assume-yes
        apt-get install --assume-yes \
            vim \
            python3.6 \
            python3-pip
        apt-get autoremove --assume-yes
        pip3 install virtualenv
    SHELL
    config.vm.provision "shell", privileged: false, inline: <<-SHELL
        virtualenv /home/vagrant/venv -p python3.6
        . /home/vagrant/venv/bin/activate
        echo ". /home/vagrant/venv/bin/activate" >> /home/vagrant/.profile
        cd /vagrant
        pip install -r requirements.txt
    SHELL
end
