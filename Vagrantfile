# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/trusty64"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.provision "shell", inline: <<-SHELL
        apt-get update
        apt-get upgrade --assume-yes
        apt-get install --assume-yes \
            git \
            vim \
            linux-image-extra-$(uname -r) \
            linux-image-extra-virtual \
            apt-transport-https \
            ca-certificates \
            curl \
            software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
        add-apt-repository \
            "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
            $(lsb_release -cs) \
            stable"
        apt-get update
        apt-get install --assume-yes docker-ce
        apt-get autoremove --assume-yes

        wget -qO- https://raw.githubusercontent.com/vantage-org/vantage/master/bootstrap | sh
        vantage __plugins install redis

        groupadd docker
        usermod -aG docker vagrant
        docker pull python:3.6-onbuild
    SHELL
    config.vm.provision "shell", privileged: false, inline: <<-SHELL
        mkdir -p /vagrant/.env
        touch /vagrant/.env/default
        chown -R vagrant:vagrant /vagrant/.env
    SHELL
end
