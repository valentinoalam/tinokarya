/**
 * Base Game class,
 * - loads in all assets
 * - loads Player and player actions/anims
 * - creates Map, sets camera/world bounds
 * - creates Exits and generates items (game manager)
 *
 * Satu scene ini dipakai untuk semua peta (house / street / store).
 * Pindah peta = ubah gameConfig.loadedScene lalu scene.restart() (lihat ObjectLoader.addExit).
 *
 * Bagian yang ditambahkan dari file asli ditandai dengan komentar [template].
 */

import Phaser from 'phaser';
import gameConfig from '../config/game-config';
import Map from '../classes/Map';
import ObjectLoader from '../classes/ObjectLoader';
import Player from '../sprites/Player';
import ImageLoader from '../classes/ImageLoader';
import BoxManager from '../classes/Box/BoxManager';
import { EventBus } from '../EventBus'; // [template] jembatan ke React

export default class Game extends Phaser.Scene {
  constructor() {
    super( 'Game' );
  }

  init() {
    // containers
    this._ANIMS = {
      pressedCursor: 'down', // keeps track of what cursor was pressed previously
      actionAnimation: '', // stores action animation to play on SPACE press
    };

    this._BTNS = {};
    this._INPUTS = {};
    this._MAP = {};
    this._MODAL = {};
    this._PLAYER = {};
    this._SPRITES = {};
    this._UTILITY = {};

    // [template] state yang harus di-reset setiap peta dimuat ulang
    this._TOUCH = { x: 0, y: 0 }; // d-pad layar sentuh
    this._changing = false; // sedang pindah peta
    gameConfig.pauseUpdateLoop = false;
    gameConfig.taskMenuOpen = false;
    gameConfig.overlapData = { isActive: false, sprite: {}, overlap: null };
  }

  preload() {
    new ImageLoader( this );
  }

  create() {
    const mapVars = gameConfig.map[gameConfig.loadedScene];

    // create map
    this._MAP = new Map({
      scene: this,
      key: mapVars.key,
      imgKey: mapVars.imgKey,
      tileSetName: mapVars.tileSetName,
      bgLayerName: 'background', // all tilesets have a "background" layer
      blockedLayerName: 'blocked' // similarly, they all have "blocked"
    });

    // world bounds
    this.physics.world.bounds.width = mapVars.mapBounds.width;
    this.physics.world.bounds.height = mapVars.mapBounds.height;

    // based on previous map ( gameConfig.previousData.scene ), determine appropriate x/y value and frame
    const playerCoords = this.setPlayerCoords();
    const playerFrame = this.setPlayerDirection();

    // create Jack
    this._PLAYER = new Player({
      scene: this,
      x: playerCoords.x,
      y: playerCoords.y,
      key: 'jack-standing',
      frame: playerFrame
    });

    // limit camera to size of map
    this.cameras.main.setBounds( 0, 0, mapVars.mapBounds.width, mapVars.mapBounds.height );
    this.cameras.main.startFollow( this._PLAYER ); // camera follows player
    this.cameras.main.fadeIn( 250, 0, 0, 0 ); // [template]

    // enable cursor keys
    // this._INPUTS = this.input.keyboard.createCursorKeys();
    this._INPUTS = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            // Tambahan WASD
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D
        });
    // assign additional keys
    this._INPUTS.enter = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.ENTER );
    this._INPUTS.space = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.SPACE );
    this._INPUTS.shift = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.SHIFT );
    this._INPUTS.escape = this.input.keyboard.addKey(  Phaser.Input.Keyboard.KeyCodes.ESC );
    this._INPUTS.e = this.input.keyboard.addKey(  Phaser.Input.Keyboard.KeyCodes.E );

    this.createObjectLoader();  // generate items
    this.createEventListeners();  // event listeners

    // handles modal box for tasks and status
    this._UTILITY.boxManager = new BoxManager( this );

    // [template] beri tahu HUD React nama lokasi
    EventBus.emit( 'scene-ready', mapVars.placeName );
    EventBus.emit( 'hint', null );
  }

  // update loop
  update( time, delta ) {
    // do walking anims if not paused
    if ( ! gameConfig.pauseUpdateLoop && ! this._changing ) {
      this.animation_update_loop();
    }

    // if there is an overlap sprite stored, check if overlapping
    if ( gameConfig.overlapData.isActive && Object.keys( gameConfig.overlapData.sprite ).length !== 0 ) {
      let isOverlapping = Phaser.Geom.Intersects.RectangleToRectangle( this._PLAYER.getBounds(), gameConfig.overlapData.overlap.getBounds() );

      if ( isOverlapping ) {
        gameConfig.overlapData.isActive = true;
      } else {
        gameConfig.overlapData.isActive = false;
        gameConfig.overlapData.sprite = {};
        EventBus.emit( 'hint', null ); // [template] sembunyikan petunjuk [Enter]
      }
    }

  }

  // plays animation of passed key
  playAnim( animKey ) {
    if( ! this._PLAYER.anims.isPlaying || this._PLAYER.anims.currentAnim.key !== animKey ) {
      this._PLAYER.anims.play( animKey );
    }
  }

  // animation update loop
  animation_update_loop() {
    // [template] keyboard ATAU d-pad layar sentuh
    const down = this._INPUTS.down.isDown || this._INPUTS.s.isDown || this._TOUCH.y > 0;
    const up = this._INPUTS.up.isDown || this._INPUTS.w.isDown  || this._TOUCH.y < 0;
    const left = this._INPUTS.left.isDown || this._INPUTS.a.isDown  || this._TOUCH.x < 0;
    const right = this._INPUTS.right.isDown  || this._INPUTS.d.isDown || this._TOUCH.x > 0;

    if ( down ) {
      this._PLAYER.body.setVelocityY( gameConfig.playerSpeed );
      this._PLAYER.body.setVelocityX( 0 );
      this._ANIMS.pressedCursor = 'down';
      this.playAnim( 'walking-down' );
    }
    else if ( up ) {
      this._PLAYER.body.setVelocityY(-gameConfig.playerSpeed );
      this._PLAYER.body.setVelocityX( 0 );
      this._ANIMS.pressedCursor = 'up';
      this.playAnim( 'walking-up' );
    }
    else if ( left ) {
      this._PLAYER.body.setVelocityX( -gameConfig.playerSpeed );
      this._PLAYER.body.setVelocityY( 0 );
      this._ANIMS.pressedCursor = 'left';
      this.playAnim( 'walking-left' );
    }
    else if ( right ) {
      this._PLAYER.body.setVelocityX( gameConfig.playerSpeed );
      this._PLAYER.body.setVelocityY( 0 );
      this._ANIMS.pressedCursor = 'right';
      this.playAnim( 'walking-right' );
    }
    else {
      this.stopPlayerAnim();
    }
  }

  // stops animation & velocity on player
  stopPlayerAnim() {
    this._PLAYER.body.setVelocityY( 0 );
    this._PLAYER.body.setVelocityX( 0 );
    this._PLAYER.anims.stop();
  }

  // manages chicken/item generation
  createObjectLoader() {
    this._UTILITY.ObjectLoader = new ObjectLoader( {
      scene: this,
      objectLayers: this._MAP.tilemap.objects
    } );
    this._UTILITY.ObjectLoader.setup();
  }

  createEventListeners() {
    // keyboard events
    this.input.keyboard.on( 'keydown', function() {

      // [template] saat dialog terbuka, hanya ESC yang dipakai (tombol lain tidak boleh membuka kunci)
      if ( this._UTILITY.boxManager.isOpen ) {
        if ( this._INPUTS.escape.isDown || this._INPUTS.e.isDown) {
          this._UTILITY.boxManager.hideBox();
        }
        return;
      }

      // on ENTER, open dialog box for animals/person/point-of-interest
      if ( this._INPUTS.enter.isDown && gameConfig.overlapData.isActive ) {
        this._UTILITY.boxManager.createBox( 'dialog' );
      }

      // on SHIFT, display Animal Status / Active Tasks buttons
      else if ( this._INPUTS.shift.isDown ) {
        this._UTILITY.boxManager.createBox( 'tasks' );
      }

      // ESC closes open dialog box
      else if ( this._INPUTS.escape.isDown ) {
        this._UTILITY.boxManager.hideBox();
      }

      // if SPACE bar is pressed, play stored Action animation
      else if ( this._INPUTS.space.isDown ) {
        gameConfig.pauseUpdateLoop = true;
        this.stopPlayerAnim();

        switch( this._ANIMS.pressedCursor ) {
          case 'down':
            this.playAnim( 'ring-cowbell-down' );
            break;
          case 'up':
            this.playAnim( 'ring-cowbell-up' );
            break;
          case 'left':
            this.playAnim( 'ring-cowbell-left' );
            break;
          case 'right':
            this.playAnim( 'ring-cowbell-right' );
            break;
          default:
            this._PLAYER.setTexture( 'jack-standing', 0 );
        }
      }

      // after SPACE bar pressed, restart update loop
      else if ( this._INPUTS.space.isUp ) {
        gameConfig.pauseUpdateLoop = false;
      }

    }.bind( this ) );

    // on animation complete, sets standing texture
    this._PLAYER.on( 'animationcomplete', ( animation, frame ) => {
      switch( this._ANIMS.pressedCursor ) {
        case 'down':
          this._PLAYER.setTexture( 'jack-standing', 0 );
          break;
        case 'up':
          this._PLAYER.setTexture( 'jack-standing', 1 );
          break;
        case 'left':
          this._PLAYER.setTexture( 'jack-standing', 2 );
          break;
        case 'right':
          this._PLAYER.setTexture( 'jack-standing', 3 );
          break;
        default:
          this._PLAYER.setTexture( 'jack-standing', 0 );
      }

      // [template] animasi lonceng selesai: lanjutkan jalan (kecuali dialog sedang terbuka)
      if ( ! this._UTILITY.boxManager.isOpen && ! this._changing ) {
        gameConfig.pauseUpdateLoop = false;
      }
    }, this );

    // [template] kontrol layar sentuh & event dari React
    const offs = [
      EventBus.on( 'touch-move', ( dir ) => { this._TOUCH = dir; } ),
      // tombol "E" = ENTER
      EventBus.on( 'touch-action', () => {
        if ( gameConfig.overlapData.isActive ) this._UTILITY.boxManager.createBox( 'dialog' );
      } ),
      // tombol menu = SHIFT
      EventBus.on( 'touch-menu', () => this._UTILITY.boxManager.createBox( 'tasks' ) ),
    ];
    this.events.once( 'shutdown', () => offs.forEach( ( off ) => off() ) );
  }

  // returns frame for player's Standing sprite
  setPlayerDirection() {
    switch( gameConfig.previousData.direction ) {
      case 'down':
        return 0;
      case 'up':
        return 1;
      case 'left':
        return 2;
      case 'right':
        return 3;
      default:
        return 0;
    }
  }

  // returns player's loading X/Y coords, based on previous Scene
  setPlayerCoords() {
    const prevScene = gameConfig.previousData.scene;
    const playerCoords = gameConfig.map[ gameConfig.loadedScene ].playerStartPos;

    // [template] fallback ke default jika tidak ada koordinat untuk peta asal tsb
    if ( prevScene.length > 0 && Object.keys( playerCoords ).length > 1 && playerCoords[ prevScene ] ) {
      return playerCoords[ prevScene ];
    } else {
      // else, no previous scene exists
      return playerCoords.default;
    }
  }

}
