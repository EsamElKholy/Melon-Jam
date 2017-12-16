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
        renderer.shadowMap = true;
        InputManager("canvas");
        runInputManager();

        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
        camera.position.z = 65;
        camera.position.y = 20;

        camera.lookAt(0, -2, -100);

        scene.add( camera );

        BuildLevel();
    }

    var BuildLevel = function ()
    {
        var pointLight = new THREE.DirectionalLight(0xFFFFFF);
        var pointLight1 = new THREE.DirectionalLight(0xFFFFFF);

        // set its position
        pointLight.position.x = -200;
        pointLight.position.y = 550;
        pointLight.position.z = 300;

        pointLight1.position.x = 200;
        pointLight1.position.y = 550;
        pointLight1.position.z = 300;

        // add to the scene
        scene.add(pointLight);
        scene.add(pointLight1);

        var back = new THREE.CubeGeometry(100, 50, 3);
        var left = new THREE.CubeGeometry(3, 50, 30);
        var right = new THREE.CubeGeometry(3, 50, 30);
        var ground = new THREE.CubeGeometry(97, 3, 60);

        var backMat = new THREE.MeshStandardMaterial({ color: 0x00ffdd, wireframe: false });
        var leftMat = new THREE.MeshStandardMaterial({ color: 0xffffdd, wireframe: false });
        var rightMat = new THREE.MeshStandardMaterial({ color: 0xffffdd, wireframe: false });
        var groundMat = new THREE.MeshStandardMaterial({ color: 0xffffdd, wireframe: false });

        var backMesh = new THREE.Mesh(back, backMat);
        var leftMesh = new THREE.Mesh(left, leftMat);
        var rightMesh = new THREE.Mesh(right, rightMat);
        var groundMesh = new THREE.Mesh(ground, groundMat);

        leftMesh.position.x = 50;
        leftMesh.position.z = 5;

        rightMesh.position.x = -50;
        rightMesh.position.z = 5;

        groundMesh.position.y = -25;
        groundMesh.position.z = -9;

        backMesh.castShadow = true;
        backMesh.receiveShadow = true;

        leftMesh.castShadow = true;
        leftMesh.receiveShadow = true;

        rightMesh.castShadow = true;
        rightMesh.receiveShadow = true;

        groundMesh.castShadow = true;
        groundMesh.receiveShadow = true;

        scene.add(backMesh);
        scene.add(leftMesh);
        scene.add(rightMesh);
        scene.add(groundMesh);
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