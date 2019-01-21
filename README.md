# SGS Frontend

Web and mobile app for the SGS (Sistema de Gestão de Sinistros) platform

[![Build Status](https://travis-ci.com/ajcerejeira/sgs-frontend.svg?token=j8y9wRARtpEPNHv6oQDY&branch=master)](https://travis-ci.com/ajcerejeira/sgs-frontend)


## Running and compilling

**Note** - In order for the camera to work flawlessly in Google Chrome browser, install
the latest version:

    ionic cordova plugin add https://github.com/apache/cordova-plugin-camera


To access native features (like camera, geolocation, etc...) in browser run:

    ionic cordova run browser

Otherwise if you don't need those features you can test it locally with:

    ionic serve --watch
