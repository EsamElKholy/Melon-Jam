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

    var objects = [];

    var initCannon = function() 
    {
        world = new CANNON.World();
        world.gravity.set(0,0,0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 10;
        shape = new CANNON.Sphere(new CANNON.Vec3(50, 50, 50));
        mass = 1;
        body = new CANNON.Body({
            mass: 1
        });

        /*shape1 = new CANNON.Sphere(new CANNON.Vec3(0.1,0.1,0.1));
        mass1 = 1;
        body1 = new CANNON.Body({
            mass: 1
        });*/

        shape2 = new CANNON.Sphere(new CANNON.Vec3(50, 50, 50));
        mass2 = 1;
        body2 = new CANNON.Body({
            mass: 1
        });

        shape3 = new CANNON.Sphere(new CANNON.Vec3(50, 50, 50));
        mass3 = 1;
        body3 = new CANNON.Body({
            mass: 1
        });

        body.addShape(shape);
        //body1.addShape(shape1);
        body2.addShape(shape2);
        body3.addShape(shape3);

        body.position.y = -1;

        //body1.position.x = 0;
        //body1.position.y = 2;

        body2.position.x = -3 * 50;
        body2.position.y = 2 * 50;

        body3.position.x = 3 * 50;
        body3.position.y = 2 * 50;

        body.angularVelocity.set(0,10,0);
        body.angularDamping = 0.5;
        body.customGrav = 200;
        body2.customGrav = 300;
        body3.customGrav = 250;
        //body1.linearDamping = 0;

        world.addBody(body);
        //world.addBody(body1);
        world.addBody(body2);
        world.addBody(body3);
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

       /* geometry1 = new THREE.SphereGeometry( 0.1, 30, 30 );
        material1 = new THREE.MeshStandardMaterial( { color: 0x00ff00, wireframe: false } );
        mesh1 = new THREE.Mesh( geometry1, material1 );*/

       // mesh1.position.x = 0;

        geometry2 = new THREE.SphereGeometry( 50, 30, 30 );
        material2 = new THREE.MeshStandardMaterial( { color: 0x0000ff, wireframe: false } );
        mesh2 = new THREE.Mesh( geometry2, material2 );

        mesh2.position.x = -3;
        mesh2.position.y = 2;

        geometry3 = new THREE.SphereGeometry( 50, 30, 30 );
        material3 = new THREE.MeshStandardMaterial( { color: 0xff0000, wireframe: false } );
        mesh3 = new THREE.Mesh( geometry3, material3 );

        mesh3.position.x = 3;
        mesh3.position.y = 2;
        
        scene.add( mesh );
        //scene.add( mesh1 );
        scene.add( mesh2 );
        scene.add( mesh3 );
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
            body.position.x -= 0.05;
        }

        if (InputManager.isKeyDown('KeyD'))
        {
            body.position.x += 0.05;
        }

        if (InputManager.isButtonUp(0))
        {
            let p = InputManager.getMousePos();
            
            let pos = new CANNON.Vec3(p[0], p[1], 0);
            //console.log(pos)
            AddObject(pos);
        }       

        for (let index = 0; index < objects.length; index++) 
        {
            var element = objects[index];
            
            var v = body.position.vsub(element.body.position);
            v.normalize();

            var v1 = body2.position.vsub(element.body.position);
            v1.normalize();

            var v2 = body3.position.vsub(element.body.position);
            v2.normalize();     
            
            element.body.force = element.body.force.vadd(v.mult(body.customGrav));
            element.body.force = element.body.force.vadd(v1.mult(body2.customGrav));
            element.body.force = element.body.force.vadd(v2.mult(body3.customGrav));                
        }

        // Step the physics world
        world.step(Delta);
        // Copy coordinates from Cannon.js to Three.js
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);

        for (let index = 0; index < objects.length; index++) 
        {
            var element = objects[index];
            
            element.mesh.position.copy(element.body.position);
            element.mesh.quaternion.copy(element.body.quaternion);
        }
        
        mesh2.position.copy(body2.position);
        mesh2.quaternion.copy(body2.quaternion);

        mesh3.position.copy(body3.position);
        mesh3.quaternion.copy(body3.quaternion);

        //console.log(InputManager.getMousePos())
    }

    var AddObject = function (pos)
    {
        var s1 = new CANNON.Sphere(new CANNON.Vec3(10,10,10));
        var m1 = 1;
        var b1 = new CANNON.Body({
            mass: 1
        });

        b1.addShape(s1);
        b1.position = pos;
        b1.stopped = false;
        var g = new THREE.SphereGeometry( 10, 30, 30 );
        var mat = new THREE.MeshStandardMaterial( { color: 0x00ff00, wireframe: false } );
        var m = new THREE.Mesh( g, mat );

        world.addBody(b1);
        scene.add( m );

        objects.push({body: b1, mesh: m});
    }

    var render = function() 
    {
        renderer.render( scene, camera );
    }
}