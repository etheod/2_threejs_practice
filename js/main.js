
//project2- Dash Line

$(function(){
    
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
	var renderer = new THREE.WebGLRenderer({antialias:true});
	 var ani=0;
	
	//backgroundColor is black
	renderer.setClearColor(0x000000);
	//size of the renderer it assigns the size of window when loaded
	renderer.setSize(window.innerWidth, window.innerHeight);

	//enable  shadows in rendering
	renderer.shadowMap.Enabled=true;
	//smooth produced shadows
	renderer.shadowMapSoft=true;
  
	
         /*add controls*/
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render );
        
        
		 //8esi cameras           
        camera.position.x = 10;
        camera.position.y = 20;
        camera.position.z = 10; 
        camera.lookAt(scene.position);
		
		  
       $("#webGL-container").append(renderer.domElement);
        /*stats*/
        stats = new Stats();        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';     
        $("#webGL-container").append( stats.domElement );
		

     var guiControls=new function(){
		  /*geo  position*/
        this.rotationX  = 0.00;
        this.rotationY  = 0.01;
        this.rotationZ  = 0.00;
        
        
        /*line material*/
        this.material='solid';
        this.color='#ffc3c3';                   
        this.scale=1;
        this.dashSize=.0001;
        this.gapSize=1;
        
	 }		 
		
	/*adds controls to scene*/
        datGUI = new dat.GUI();
        var rotFolder = datGUI.addFolder('Rotation  Options');
        var materialFolder = datGUI.addFolder('Material Options');
        materialFolder.open();
        
        rotFolder.add(guiControls, 'rotationX',0,1);
        rotFolder.add(guiControls, 'rotationY',0,1);    
        rotFolder.add(guiControls, 'rotationZ',0,1);
        


        materialFolder.add(guiControls, 'material', ['solid' , 'dashed']).onChange(function(value){
            if (value == 'solid'){
                torusLine.material = sphereMaterialLineBasic;
            }
            else if (value == 'dashed'){
                torusLine.material = sphereMaterialDashed;
            }
        }); 
        
        materialFolder.addColor(guiControls, 'color').onChange(function(value){
            torusLine.material.color.setHex (value.replace('#','0x'));
        });
        materialFolder.add(guiControls, 'dashSize',0, 1).listen();
        materialFolder.add(guiControls, 'gapSize',0, 3).step(.05).onChange(function(value){
            torusLine.material.gapSize = value;
        });
   // datGUI.close();	
		
		
	/*create torus knot*/   
       var sphereGeometry = new THREE.SphereGeometry( 6, 64, 64); 
       var sphereMaterialLineBasic = new THREE.LineBasicMaterial( {            
            linewidth: 2,
            color: 0xffc3c3,
            } );
       var sphereMaterialDashed = new THREE.LineDashedMaterial( {
            color: 0xffc3c3,
            dashSize: 3,
            scale:1,
            gapSize:1,
            lineWidth:5
            } );
    
	//create inner sphere
	 var sphereInnerGeometry = new THREE.SphereGeometry( 4, 64, 64); 
       var sphereInnerMaterial = new THREE.MeshDepthMaterial( {            
            wireframe: true,
			morphTargets: true
			
            } );
			var sphereInner=new THREE.Mesh(sphereInnerGeometry,sphereInnerMaterial, THREE.LineSegments);
			
			
		sphereInner.position.x = 2.5
        sphereInner.position.y = 6;
        sphereInner.position.z = 2.5;
        sphereInner.castShadow = false;
        scene.add( sphereInner );
	
	   //ean de balw to teleytaio tha enwsei kai to eswteriko toy sxhmatos me grammes kai oxi mono thn //epifaneia
       var torusLine =  new THREE.Line(geo2line(sphereGeometry), sphereMaterialLineBasic, THREE.LineSegments);
       //var torusLine =  new THREE.Line(geo2line(sphereGeometry), sphereMaterialDashed);
        /*position and add objects to scene*/
        
        torusLine.position.x = 2.5
        torusLine.position.y = 6;
        torusLine.position.z = 2.5;
        torusLine.castShadow = false;
        scene.add( torusLine );
        	

        
    

        //taking the geometry of the object and calculating an einai triangulated or quad kai bazei se array ola ta vertices
   //according to their faces
   //meta ta metatrepei se line geometry kai epistrefei thn timh

   function geo2line( geo ) {

        var geometry = new THREE.Geometry();
        var vertices = geometry.vertices;

        for ( i = 0; i < geo.faces.length; i++ ) {

            var face = geo.faces[ i ];

            if ( face instanceof THREE.Face3 ) {

                    vertices.push( geo.vertices[ face.a ].clone() );
                    vertices.push( geo.vertices[ face.b ].clone() );
                    vertices.push( geo.vertices[ face.b ].clone() );
                    vertices.push( geo.vertices[ face.c ].clone() );
                    vertices.push( geo.vertices[ face.c ].clone() );
                    vertices.push( geo.vertices[ face.a ].clone() );

            } else if ( face instanceof THREE.Face4 ) {

                    vertices.push( geo.vertices[ face.a ].clone() );
                    vertices.push( geo.vertices[ face.b ].clone() );
                    vertices.push( geo.vertices[ face.b ].clone() );
                    vertices.push( geo.vertices[ face.c ].clone() );
                    vertices.push( geo.vertices[ face.c ].clone() );
                    vertices.push( geo.vertices[ face.d ].clone() );
                    vertices.push( geo.vertices[ face.d ].clone() );
                    vertices.push( geo.vertices[ face.a ].clone() );

            }

        }

        geometry.computeLineDistances();

        return geometry;
	}
    
    function render() {
		sphereInner.rotation.x +=.05 //me statheri timi
		//sphereInner.rotation.y +=.05 //me statheri timi
		sphereInner.rotation.z +=.1 //me statheri timi
        torusLine.rotation.x += guiControls.rotationX;
        torusLine.rotation.y += guiControls.rotationY;
        torusLine.rotation.z += guiControls.rotationZ;
		
        
        if (( ani < 1)&&( ani > 0 )){
            ani += .0001;
            torusLine.material.dashSize = ani;
            guiControls.dashSize = ani;
        }
        else if (ani>1){
            ani *= -1;
            ani += .0001;
            torusLine.material.dashSize = ani*-1;
            guiControls.dashSize = ani*-1;      
        }
        else{
            ani += .0001;
            torusLine.material.dashSize = ani*-1;   
            guiControls.dashSize = ani*-1;  
        }
    }
    function animate(){
    
        console.log(ani);
        requestAnimationFrame(animate);
        render();
        stats.update();     
        renderer.render(scene, camera);
        
    
    }
    
    $(window).resize(function(){


        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );



    });

    animate();

}); 