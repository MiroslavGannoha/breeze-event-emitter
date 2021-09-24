# 💨 Breeze Event Emitter 💨

Simple to use, type safe event emitter.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][build-image]][build-url]
[![Build coverage][coverage-image]][coverage-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]


## Install

```
$ npm install breeze-event-emitter
```

## Usage

```ts
import { BreezeEventEmitter}  from 'breeze-event-emitter';

const events = new BreezeEventEmitter();

events.on('user-add', user => {
	console.log(user);
});
```

## API

https://github.com/sindresorhus/emittery/edit/main/readme.md