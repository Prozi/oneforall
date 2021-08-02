import { Scene } from '../src/scene'

const scene: Scene = new Scene({ visible: true, autoSize: true })

document.body.appendChild(scene.pixi.view)

scene.pixi.renderer.backgroundColor = 0xff8888 // tomato
scene.pixi.start()
