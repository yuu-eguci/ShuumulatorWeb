import { alert, Stack, defaultModules } from '@pnotify/core';
import * as PNotifyFontAwesome5Fix from '@pnotify/font-awesome5-fix';
import * as PNotifyFontAwesome5 from '@pnotify/font-awesome5';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

defaultModules.set(PNotifyFontAwesome5Fix, {});
defaultModules.set(PNotifyFontAwesome5, {});

// NOTE: Stack は毎回同じインスタンスを使わないといけない。通知ボックスが重なる不具合が起こります。
const stackDownLeft = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 5,
  modal: false,
  maxOpen: 3,
  maxStrategy: 'close',
  maxClosureCausesWait: false,
});

export default {

  __execPNotify: function (type, mes, hide) {
    // hide の初期値は false です。
    hide = hide || false;

    const obj = alert({
      type,
      text: mes,
      textTrusted: true,
      hide,
      delay: 3000,
      icon: true,
      closer: true,
      sticker: false,
      stack: stackDownLeft,
    });
    obj.on('click', () => {
      obj.close();
    });
  },

  popSuccess: function (mes) {
    this.__execPNotify('success', mes)
  },

  popHidingSuccess: function (mes) {
    this.__execPNotify('success', mes, /* hide = */ true)
  },

  popError: function (mes) {
    this.__execPNotify('error', mes)
  },

  popHidingError: function (mes) {
    this.__execPNotify('error', mes, /* hide = */ true)
  },

  popNotice: function (mes) {
    this.__execPNotify('notice', mes)
  },

  popHidingNotice: function (mes) {
    this.__execPNotify('notice', mes, /* hide = */ true)
  },

  popInfo: function (mes) {
    this.__execPNotify('info', mes)
  },

  popHidingInfo: function (mes) {
    this.__execPNotify('info', mes, /* hide = */ true)
  },

  createAnimateNoticeObject: function (mes) {
    return alert({
      type: 'notice',
      text: mes,
      textTrusted: true,
      hide: false,
      icon: 'fas fa-spinner fa-pulse',
      closer: false,
      sticker: false,
      stack: stackDownLeft,
    });
  },

  createAnimateNoticeIntervalObject: function (notifyObject, mes) {
    // NOTE: 機能としては不要だが、演出のために実装している interval イベントです。
    const faClasses = ['spinner', 'circle-notch', 'atom', 'slash', 'sync'];
    let i = 0;
    const options = {
      text: mes,
      textTrusted: true,
    };
    return setInterval(() => {
      options.icon = `fas fa-${faClasses[i % 5]} fa-pulse`;
      notifyObject.update(options);
      i += 1;
    }, 4000);
  },

}
