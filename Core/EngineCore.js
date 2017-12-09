var EngineCore = function (width, height, fps)
{
    var Delta = 1.0 / fps;
    var MainLoopTimerID;

    this.Init = function ()
    {
        initThree();
        initCannon();
        InputManager("canvas");
        runInputManager();
    }

    this.Run = function ()
    {
        MainLoopTimerID = requestAnimationFrame(MainLoop, Delta);
    }

    var MainLoop = function ()
    {
        MainLoopTimerID = requestAnimationFrame(MainLoop, Delta);
        animate();        
    }

    var Stop = function ()
    {
        cancelAnimationFrame(MainLoopTimerID);
    }

    var world, mass, body, shape, timeStep=1/60,
            camera, scene, renderer, geometry, material, mesh;
    
    var initCannon = function() 
    {
        world = new CANNON.World();
        world.gravity.set(0,-0.01,0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 10;
        shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
        mass = 1;
        body = new CANNON.Body({
            mass: 1
        });
        body.addShape(shape);
        body.angularVelocity.set(0,10,0);
        body.angularDamping = 0.9;
        world.addBody(body);
    }

    var initThree = function() 
    {
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );
        renderer.domElement.id = "canvas";
        document.body.appendChild( renderer.domElement );
        
        InputManager("canvas");
        runInputManager();

        camera = new THREE.PerspectiveCamera( 75, width / height, 1, 100 );
        camera.position.z = 5;
        scene.add( camera );

        
        geometry = new THREE.BoxGeometry( 2, 2, 2 );
        material = new THREE.MeshBasicMaterial( { color: 0xff00dd, wireframe: false } );
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
    }
    
    var animate = function() 
    {
        updatePhysics();
        render();
    }

    var updatePhysics = function() 
    {
        if (InputManager.isKeyDown('KeyA'))
        {
            body.position.x -= 0.1;
        }

        // Step the physics world
        world.step(Delta);
        // Copy coordinates from Cannon.js to Three.js
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    }

    var render = function() 
    {
        renderer.render( scene, camera );
    }
}