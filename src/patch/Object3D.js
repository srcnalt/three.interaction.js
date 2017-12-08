import { Object3D } from 'three';
import { Utils } from '../utils/Utils';

/**
 * whether displayObject is interactively
 */
Object3D.prototype.interactive = false;

/**
 * whether displayObject's children is interactively
 */
Object3D.prototype.interactiveChildren = true;

/**
 * whether displayObject had touchstart
 * @private
 */
Object3D.prototype.started = false;

/**
 * tracked event cache, like: touchend、mouseout、pointerout which decided by primary-event
 */
Object.defineProperty(Object3D.prototype, 'trackedPointers', {
  get() {
    if (!this._trackedPointers) this._trackedPointers = {};
    return this._trackedPointers;
  },
});

/**
 * proxy `addEventListener` function
 *
 * @param {String} type event type, evnet name
 * @param {Function} fn callback
 * @return {this} this
 */
Object3D.prototype.on = function(type, fn) {
  if (!Utils.isFunction(fn)) return;
  this.interactive = true;
  this.addEventListener(type, fn);
  return this;
};

/**
 * proxy `removeEventListener` function
 *
 * @param {String} type event type, evnet name
 * @param {Function} fn callback, which you had bind before
 * @return {this} this
 */
Object3D.prototype.off = function(type, fn) {
  this.removeEventListener(type, fn);
  return this;
};

/**
 * binding a once event, just emit once time
 *
 * @param {String} type event type, evnet name
 * @param {Function} fn callback
 * @return {this} this
 */
Object3D.prototype.once = function(type, fn) {
  if (!Utils.isFunction(fn)) return;
  const cb = (ev) => {
    fn(ev);
    this.off(type, cb);
  };
  this.on(type, cb);
  return this;
};

/**
 * emit a event
 *
 * @param {String} type event type, evnet name
 * @return {this} this
 */
Object3D.prototype.emit = function(type, ...argument) {
  if (this._listeners === undefined || Utils.isUndefined(this._listeners[type])) return;
  const cbs = this._listeners[type] || [];
  const cache = cbs.slice(0);

  for (let i = 0; i < cache.length; i++) {
    cache[i].apply(this, argument);
  }
  return this;
};

/**
 * dispatch a raycast
 *
 * @param {Raycaster} raycaster Raycaster object, get from THREE.Raycaster
 * @return {Object|Boolean} had pass hit-test
 */
Object3D.prototype.raycastTest = function(raycaster) {
  const result = [];
  this.raycast(raycaster, result);

  if (result.length > 0) {
    return result[0];
  }

  return false;
};
