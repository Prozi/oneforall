'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            }
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
Object.defineProperty(exports, '__esModule', { value: true });
__exportStar(require('./lifecycle'), exports);
__exportStar(require('./sprite'), exports);
__exportStar(require('./component'), exports);
__exportStar(require('./container'), exports);
__exportStar(require('./animator'), exports);
__exportStar(require('./game-object'), exports);
__exportStar(require('./prefab'), exports);
__exportStar(require('./scene-ssr'), exports);
__exportStar(require('./scene'), exports);
__exportStar(require('./resources'), exports);
__exportStar(require('./state-machine'), exports);
__exportStar(require('./circle-body'), exports);
__exportStar(require('./polygon-body'), exports);
__exportStar(require('./box-body'), exports);
__exportStar(require('./texture-atlas'), exports);
