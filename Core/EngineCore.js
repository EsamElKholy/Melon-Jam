var EngineCore = function (width, height, fps)
{
    var Delta = 1.0 / fps;
    var MainLoopTimerID;

    this.Init = function ()
    {
        initThree();
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

    var timeStep=1/60, camera, scene, renderer, geometry, material, mesh;

    var initThree = function() 
    {
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );
        renderer.domElement.id = "canvas";
        document.body.appendChild( renderer.domElement );
        
        InputManager("canvas");
        runInputManager();

        camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 10000 );
        camera.position.z = 100;
        scene.add( camera );

        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 300;

        // add to the scene
        scene.add(pointLight);
        
        geometry = new THREE.SphereGeometry( 50, 30, 30 );
        material = new THREE.MeshStandardMaterial( { color: 0x00ffdd, wireframe: false } );
        mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );
    }
    
    var animate = function() 
    {
        render();
    }

    var render = function() 
    {
        renderer.render( scene, camera );
    }
}