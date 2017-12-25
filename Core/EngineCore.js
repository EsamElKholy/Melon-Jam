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

    var timeStep = 1 / 60, camera, scene, renderer;
    var spawners = [];

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
        PlaceSpawners();
    }

    var BuildLevel = function ()
    {
        var pointLight = new THREE.DirectionalLight(0xFFFFFF);
        var pointLight1 = new THREE.DirectionalLight(0xFFFFFF);

        pointLight.castShadow = true;
        pointLight1.castShadow = true;

        // set its position
        pointLight.position.x = -100;
        pointLight.position.y = 450;
        pointLight.position.z = 200;

        pointLight1.position.x = 100;
        pointLight1.position.y = 350;
        pointLight1.position.z = 200;

        // add to the scene
       // scene.add(pointLight);
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

    var PlaceSpawners = function ()
    {
        var spawner = new THREE.CubeGeometry(15, 3, 15);
        var spawnerMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: false });
        var spawnerMesh = new THREE.Mesh(spawner, spawnerMat);

        spawnerMesh.position.y = -23;
        spawnerMesh.position.x = -41;

        spawnerMesh.castShadow = true;
        spawnerMesh.receiveShadow = true;

        var spawner1 = new THREE.CubeGeometry(15, 3, 15);
        var spawnerMat1 = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false });
        var spawnerMesh1 = new THREE.Mesh(spawner1, spawnerMat1);

        spawnerMesh1.position.y = -23;
        spawnerMesh1.position.x = 41;

        spawnerMesh1.castShadow = true;
        spawnerMesh1.receiveShadow = true;

        spawners.push(spawnerMesh);
        spawners.push(spawnerMesh1);

        scene.add(spawnerMesh);
        scene.add(spawnerMesh1);
    }
    var raycaster = new THREE.Raycaster();
    var selectedSpawner = null;
    var CheckIntersection = function ()
    {
        var mousePos = InputManager.getMousePos();
        var x = (mousePos[0] / (width / 2.0));
        var y = (mousePos[1] / (height / 2.0));
        var mp = new THREE.Vector2(x, y);

        raycaster.setFromCamera(mp, camera);
        //console.log( x);
        if (InputManager.isButtonUp(0)) 
        {
            var intersects = raycaster.intersectObjects(spawners);

            if (intersects.length > 0)
            {
                selectedSpawner = intersects[0].object;
                console.log(selectedSpawner);
            }
        }
    }

    var copy = null;
    var oldMousePos = [0, 0];
    var PlaceCopy = function ()
    {
        if (selectedSpawner != null && copy == null)
        {
            var c = new THREE.CubeGeometry(15, 3, 5);
            var cMat = new THREE.MeshStandardMaterial({ color: selectedSpawner.material.color, wireframe: false });

            copy = new THREE.Mesh(c, cMat);

            copy.position.x = selectedSpawner.position.x;
            copy.position.y = selectedSpawner.position.y;
            copy.position.z = selectedSpawner.position.z;
            oldMousePos = InputManager.getMousePos();
            scene.add(copy);
        }

        if (copy != null)
        {
            var mousePos = InputManager.getMousePos();

            if (oldMousePos[0] != mousePos[0])
            {
                if (oldMousePos[0] > mousePos[0])
                {
                    copy.position.x -= (oldMousePos[0] - mousePos[0]) / 7;
                }
                else
                {
                    copy.position.x += (mousePos[0] - oldMousePos[0]) / 7;
                }
            }

            if (oldMousePos[1] != mousePos[1])
            {
                if (oldMousePos[1] > mousePos[1])
                {
                    copy.position.z += ((oldMousePos[1] - mousePos[1]) / 5);
                }
                else
                {
                    copy.position.z -= (mousePos[1] - oldMousePos[1]) / 5;
                }
            }

            oldMousePos = mousePos;
        }

        if (InputManager.isButtonUp(1) && copy != null)
        {
            copy = null;
            selectedSpawner = null;
        }
    }

    var animate = function () 
    {
        render();
    }

    var render = function() 
    {
        CheckIntersection();
        if (selectedSpawner != null)
        {
            PlaceCopy();
        }
        renderer.render(scene, camera);
    }
}