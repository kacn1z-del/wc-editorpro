// En este archivo puedes exponer funciones para el renderer mediante contextBridge
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  message: '¡Hola desde preload.js!'
});